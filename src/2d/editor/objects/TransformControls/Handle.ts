import { Graphics, FederatedPointerEvent } from 'pixi.js';
import { isMobile } from 'react-device-detect';
import { Point } from '../../../../helpers/Point';
import { viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';
import { TransformLayer } from './TransformLayer';
import { WALL_THICKNESS } from '../../constants';

type Furniture = any;

export enum HandleType {
    Horizontal,
    Vertical,
    HorizontalVertical,
    Rotate,
    Move,
}

export interface IHandleConfig {
    size?: number;
    color?: number;
    type: HandleType;
    target: Furniture;
    pos?: Point;
}

export class Handle extends Graphics {
    private type: HandleType;
    private target: Furniture | null;
    private size = 10;

    private active = false;
    private mouseStartPoint: Point;
    private targetStartPoint: Point;
    private mouseEndPoint: Point;
    private startRotaton: number;
    private startScale: Point;
    private targetStartCenterPoint: Point;
    localCoords: { x: number; y: number };

    constructor(handleConfig: IHandleConfig) {
        super();
        this.eventMode = 'static';
        if (handleConfig.color) {
            // @ts-expect-error find why
            this.color = handleConfig.color;
        }

        if (handleConfig.size) {
            this.size = handleConfig.size;
        }

        this.mouseStartPoint = { x: 0, y: 0 };
        this.targetStartPoint = { x: 0, y: 0 };

        this.startScale = { x: 0, y: 0 };
        this.targetStartCenterPoint = { x: 0, y: 0 };
        this.localCoords = { x: 0, y: 0 };
        this.mouseEndPoint = { x: 0, y: 0 };

        this.type = handleConfig.type;
        this.target = handleConfig.target;
        // this.buttonMode = true;
        // this.beginFill(this.color).lineStyle(1, this.color);
        // this.stroke({ texture: Texture.WHITE, width: 1, color: this.color });
        this.rect(0, 0, 10, 10).stroke({ width: 1, color: 0x1a1a1a });

        if (isMobile) {
            this.size = this.size * 2.5;
        }
        if (this.type == HandleType.Rotate) {
            this.circle(0, 0, this.size / 1.5);
            this.pivot.set(this.size / 3, this.size / 3);
        } else {
            this.rect(0, 0, this.size, this.size);
            this.pivot.set(0.5);
        }

        switch (this.type) {
            case HandleType.Move:
                this.cursor = 'move';
                break;
            case HandleType.Horizontal:
                this.cursor = 'ew-resize';
                break;
            case HandleType.Vertical:
                this.cursor = 'ns-resize';
                break;
            case HandleType.HorizontalVertical:
                this.cursor = 'nwse-resize';
                break;
            case HandleType.Rotate:
                this.cursor = 'wait';
                break;
        }

        if (handleConfig.pos) {
            this.position.set(handleConfig.pos.x, handleConfig.pos.y);
        }

        this.on('pointerdown', this.onMouseDown);
        this.on('pointerup', this.onMouseUp);
        this.on('pointerupoutside', this.onMouseUp);
        this.on('pointermove', this.onMouseMove);
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        if (TransformLayer.dragging) {
            return;
        }
        this.mouseStartPoint.x = ev.data.global.x;
        this.mouseStartPoint.y = ev.data.global.y; // unde se afla target la mousedown
        this.targetStartPoint = this.target.getGlobalPosition();
        this.targetStartCenterPoint.x = this.targetStartPoint.x + this.target.width / 2;
        this.targetStartCenterPoint.y = this.targetStartPoint.y + this.target.height / 2;
        const localCoords = ev.data.getLocalPosition(this.target);

        this.startRotaton = this.target.rotation;
        this.startScale.x = this.target.scale.x;
        this.startScale.y = this.target.scale.y;
        TransformLayer.dragging = true;
        this.active = true;
        // this.target.setSmartPivot(0);
        ev.stopPropagation();
    }

    private onMouseUp(ev: FederatedPointerEvent) {
        TransformLayer.dragging = false;
        this.active = false;
        ev.stopPropagation();
    }

    private onMouseMove(ev: FederatedPointerEvent) {
        if (!this.active || !TransformLayer.dragging) {
            return;
        }

        // unde se afla mouse-ul acum
        this.mouseEndPoint.x = ev.data.global.x;
        this.mouseEndPoint.y = ev.data.global.y;
        // distanta de la obiect la punctul de start (unde a dat click utilizatorul)
        const startDistance = this.getDistance(this.mouseStartPoint, this.targetStartPoint);
        // distanta de la obiect la pozitia noua a mouse-ului
        const endDistance = this.getDistance(this.mouseEndPoint, this.targetStartPoint);
        // raportul dintre cele doua distante:
        // raport > 1 -> se mareste obiectul
        // raport < 1 -> se micsoreaza obiectul
        const sizeFactor = endDistance / startDistance;
        const startCenterAngle = this.target.centerAngle;

        switch (this.type) {
            case HandleType.Rotate:
                const relativeStart = {
                    x: this.mouseStartPoint.x - this.targetStartPoint.x,
                    y: this.mouseStartPoint.y - this.targetStartPoint.y,
                };
                const relativeEnd = {
                    x: this.mouseEndPoint.x - this.targetStartPoint.x,
                    y: this.mouseEndPoint.y - this.targetStartPoint.y,
                };

                const endAngle = Math.atan2(relativeEnd.y, relativeEnd.x);
                const startAngle = Math.atan2(relativeStart.y, relativeStart.x);
                const deltaAngle = endAngle - startAngle;

                this.target.rotation = this.startRotaton + deltaAngle;
                break;
            case HandleType.Horizontal:
                this.target.scale.x = this.startScale.x * sizeFactor;
                break;
            case HandleType.Vertical:
                this.target.scale.y = this.startScale.y * sizeFactor;
                break;
            case HandleType.HorizontalVertical:
                this.target.scale.x = this.startScale.x * sizeFactor;
                this.target.scale.y = this.startScale.y * sizeFactor;
                break;
            case HandleType.Move:
                // move delta: distanta intre click original si click in urma mutarii
                const delta = {
                    x: this.mouseEndPoint.x - this.mouseStartPoint.x,
                    y: this.mouseEndPoint.y - this.mouseStartPoint.y,
                };

                if (!this.target.xLocked) {
                    this.target.position.x = viewportX(this.targetStartPoint.x + delta.x);
                    this.target.position.y = viewportY(this.targetStartPoint.y + delta.y);
                } else {
                    const amount = (delta.x + delta.y) * 0.8;

                    //start of wall
                    if (this.localCoords.x + amount <= WALL_THICKNESS * 0.5) {
                        this.target.position.x = WALL_THICKNESS * 0.5;
                    }
                    //end of wall
                    else if (
                        this.localCoords.x + amount >=
                        this.target.parent.length - this.target.width - WALL_THICKNESS * 0.5 //parent wall length
                    ) {
                        this.target.position.x = this.target.parent.length - this.target.width - WALL_THICKNESS * 0.5;
                    }
                    //meddle of wall
                    else {
                        this.target.position.x = this.localCoords.x + amount;
                    }

                    // this.target.position.x = viewportX(this.targetStartPoint.x) + delta.x;
                }

                break;
        }
    }

    private getDistance(src: Point, dest: Point) {
        return Math.sqrt(Math.pow(dest.x - src.x, 2) + Math.pow(dest.y - src.y, 2));
    }

    public setTarget(target: Furniture) {
        this.target = target;
    }

    /* sets scale and transform */
    public update(pos: Point) {
        this.position.set(pos.x, pos.y);
    }
}
