import { Graphics, FederatedPointerEvent, Container } from 'pixi.js';
import { lineIntersection } from '@pixi/math-extras';
import { euclideanDistance } from '../../../../helpers/EuclideanDistance';
import { Point } from '../../../../helpers/Point';
import { snap, viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';

import { useStore } from '../../../../stores/EditorStore';
import { AddNodeAction } from '../../actions/AddNodeAction';
import { DeleteWallAction } from '../../actions/DeleteWallAction';
import { Tool, ViewMode } from '../../constants';
import { WallNode } from './WallNode';
import { main } from '@/2d/EditorRoot';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { WallType, wallTypeConfig } from './config';
import { v4 as uuidv4 } from 'uuid';

import { Door } from '../Furnitures/Door/Door';
import { WindowElement } from '../Furnitures/Window/Window';

import { notifications } from '@mantine/notifications';

import { getClosestPointOnLine } from '@/2d/helpers/geometry';
import { DISTANCE_FROM_WALL } from '../Furnitures/BuildingElement';
import {
    WALL_ACTIVE_STROKE_COLOR,
    WALL_ACTIVE_Z_INDEX,
    WALL_FILL_COLOR,
    WALL_INACTIVE_Z_INDEX,
    WALL_STROKE_COLOR,
} from './constants';
import { WallNodeSequence } from './WallNodeSequence';
import WallDebugContainer from './WallDebugContainer';
import WallMeasuresContainer from './WallMeasuresContainer';
import WallDashedLineContainer from './WallDashedLineContainer';
import WallTempFurniture from './WallTempFurniture';

export const DEFAULT_WALL_TYPE = WallType.Exterior;

export const MIN_WALL_LENGTH = 20;

export type WallSettings = {
    uuid?: string;
    type?: WallType;
    thickness?: number;
};

const normalizeAngle = (angle: number) => (angle >= 180 ? angle - 180 : angle);

const areAnglesDifferent = (angle1: number, angle2: number) => normalizeAngle(~angle1) !== normalizeAngle(~angle2);

export class Wall extends Graphics {
    uuid = uuidv4();
    leftNode: WallNode;
    rightNode: WallNode;
    length: number;
    children: Container[] = [];

    graphic: Graphics;

    debugContainer: WallDebugContainer | null = null;
    measuresContainer: WallMeasuresContainer | null = null;
    dashedLineContainer: WallDashedLineContainer | null = null;
    tempFurniture: WallTempFurniture | null = null;

    helpersContainer = new Container();

    focused = false;

    clickStartTime: number;

    x1: number;
    x2: number;
    y1: number;
    y2: number;
    thickness: number;
    type = WallType.Exterior;

    dragging: boolean;
    mouseStartPoint: Point;

    color = WALL_FILL_COLOR;

    leftNodePlaceholder: Graphics | undefined;
    rightNodePlaceholder: Graphics | undefined;
    pointA: Point = { x: 0, y: 0 };
    pointC: Point = { x: 0, y: 0 };
    pointD: Point = { x: 0, y: 0 };
    pointB: Point = { x: 0, y: 0 };

    constructor(leftNode: WallNode, rightNode: WallNode, settings?: WallSettings) {
        super();
        this.sortableChildren = true;
        this.eventMode = 'dynamic';
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.dragging = false;
        this.mouseStartPoint = { x: 0, y: 0 };

        const points = {
            a: this.pointA,
            b: this.pointB,
            c: this.pointC,
            d: this.pointD,
        };

        if (settings?.type !== undefined) {
            this.type = settings?.type;
        } else {
            const state = useStore.getState();

            const activeToolSettings = state.activeToolSettings;

            this.type = activeToolSettings?.wallType || DEFAULT_WALL_TYPE;
        }

        if (settings?.uuid) this.uuid = settings.uuid;
        if (settings?.thickness) this.thickness = settings.thickness;

        this.applySettings(settings?.thickness);

        // this.debugContainer = new WallDebugContainer(points);
        this.measuresContainer = new WallMeasuresContainer(points);
        this.dashedLineContainer = new WallDashedLineContainer(this.thickness);
        this.tempFurniture = new WallTempFurniture(this);

        // this.addChild(this.debugContainer);
        this.addChild(this.measuresContainer);
        this.addChild(this.dashedLineContainer);
        this.addChild(this.tempFurniture);

        this.graphic = new Graphics();

        this.addChild(this.graphic);

        this.drawWall();
        this.pivot.set(0, this.thickness * 0.5);

        this.on('pointerdown', this.onMouseDown);
        this.on('pointerup', this.onMouseUp);
        this.on('globalpointermove', this.onMouseMove);
        this.on('pointermove', this.onWallMouseMove);
        this.on('pointerupoutside', this.onMouseUp);
        this.on('pointerover', this.onMouseOver);
        this.on('pointerout', this.onMouseOut);

        this.clickStartTime = 0;
        this.zIndex = WALL_INACTIVE_Z_INDEX;
    }

    private applySettings(thickness = wallTypeConfig[this.type].thickness) {
        this.thickness = thickness;
        this.pivot.set(0, thickness * 0.5);
    }

    public updateCorners() {
        if (!this.graphic) return;

        const strokeColor = this.focused ? WALL_ACTIVE_STROKE_COLOR : WALL_STROKE_COLOR;
        const middleEndPoint = { x: this.length, y: this.thickness / 2 };
        const middleStartPoint = { x: 0, y: this.thickness / 2 };

        this.graphic
            .clear()
            .poly([
                this.pointA.x,
                this.pointA.y,
                this.pointB.x,
                this.pointB.y,
                middleEndPoint.x,
                middleEndPoint.y,
                this.pointC.x,
                this.pointC.y,
                this.pointD.x,
                this.pointD.y,
                middleStartPoint.x,
                middleStartPoint.y,
            ])
            .fill({ color: this.color })
            .stroke({ width: 1, color: strokeColor });
    }

    private calcCornersPositions() {
        if (!this.parent) return;

        const parent = this.parent as WallNodeSequence;

        // Cache values that don't change during drag
        const thickness = this.thickness;
        const length = this.length;

        // Initialize default corner points - moved outside of corners loop
        this.pointA.x = 0;
        this.pointA.y = this.thickness;

        this.pointB.x = length;
        this.pointB.y = this.thickness;

        this.pointC.x = length;
        this.pointC.y = 0;

        this.pointD.x = 0;
        this.pointD.y = 0;

        // Cache angle calculations
        const wallAngle = this.angle;

        const leftNodeId = this.leftNode.getId();
        const rightNodeId = this.rightNode.getId();

        // Process corners only if we have neighbors
        const corners = [
            {
                point: 'pointA',
                nodeId: leftNodeId,
                isClockwise: true,
                y1: thickness,
                getYPos: (cornerWall: Wall) => (this.leftNode === cornerWall.leftNode ? 0 : cornerWall.thickness),
            },
            {
                point: 'pointD',
                nodeId: leftNodeId,
                isClockwise: false,
                y1: 0,
                getYPos: (cornerWall: Wall) => (this.leftNode === cornerWall.leftNode ? cornerWall.thickness : 0),
            },
            {
                point: 'pointC',
                nodeId: rightNodeId,
                isClockwise: true,
                y1: 0,
                getYPos: (cornerWall: Wall) => (this.rightNode === cornerWall.rightNode ? cornerWall.thickness : 0),
            },
            {
                point: 'pointB',
                nodeId: rightNodeId,
                isClockwise: false,
                y1: thickness,
                getYPos: (cornerWall: Wall) => (this.rightNode === cornerWall.rightNode ? 0 : cornerWall.thickness),
            },
        ];

        // Process each corner only if there's a neighbor
        corners.forEach(({ point, nodeId, isClockwise, y1, getYPos }) => {
            const cornerWall = parent.findFirstNeighbor(this, nodeId, isClockwise);

            if (cornerWall) {
                const cornerAngle = cornerWall.angle;

                // Skip if angles are the same
                if (!areAnglesDifferent(cornerAngle, wallAngle)) {
                    return;
                }

                // Cache intersection calculation values
                const yPos = getYPos(cornerWall);
                const x1 = -100;
                const x2 = length + 100;
                const x3 = -100;
                const x4 = cornerWall.length + 100;

                // Calculate intersection only when necessary
                const point1 = this.toGlobal({ x: x1, y: y1 });
                const point2 = this.toGlobal({ x: x2, y: y1 });
                const point3 = cornerWall.toGlobal({ x: x3, y: yPos });
                const point4 = cornerWall.toGlobal({ x: x4, y: yPos });

                const { x, y } = this.toLocal(lineIntersection(point1, point2, point3, point4));

                switch (point) {
                    case 'pointA':
                        this.pointA.x = x;
                        this.pointA.y = y;
                        break;

                    case 'pointB':
                        this.pointB.x = x;
                        this.pointB.y = y;
                        break;

                    case 'pointC':
                        this.pointC.x = x;
                        this.pointC.y = y;
                        break;

                    case 'pointD':
                        this.pointD.x = x;
                        this.pointD.y = y;
                        break;
                }
            }
        });
    }

    private onMouseOver(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                this.tempFurniture?.create(state.activeTool, this).show();

                break;

            case Tool.WallAdd:
                this.dashedLineContainer?.show();

                break;
        }
    }

    private onMouseOut() {
        if (this.dragging) return;

        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                this.tempFurniture?.hide();

                break;

            case Tool.WallAdd:
                this.dashedLineContainer?.hide();
                break;
        }
    }

    public setType(newType: WallType) {
        if (this.type === newType) return;

        this.type = newType;

        this.applySettings();
        this.drawWall();
        this.updateChildren();
    }

    private updateChildren() {
        for (const item of this.children) {
            if (item instanceof Door || item instanceof WindowElement) {
                item.setPosition({ x: null, y: null });
                item.setStroke();
                item.setBackground();
            }
        }
    }

    public handleInvalidLength() {
        console.log('handleInvalidLength');
    }

    public isInvalidLength() {
        return this.length > MIN_WALL_LENGTH;
    }

    public drawWall() {
        const x1 = this.leftNode.x;
        const y1 = this.leftNode.y;
        const x2 = this.rightNode.x;
        const y2 = this.rightNode.y;

        // Cache length calculation
        this.length = Math.floor(euclideanDistance(x1, x2, y1, y2));

        // Cache angle calculation
        const theta = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        this.angle = theta < 0 ? 360 + theta : theta;

        // Batch position updates
        this.position.set(x1, y1);
        this.leftNode.angle = this.angle;
        this.rightNode.angle = this.angle;

        this.calcCornersPositions();
        this.updateCorners();

        if (this.focused) {
            this.debugContainer?.update();
            this.measuresContainer?.update({ thickness: this.thickness, angle: this.angle });
        }
    }

    private onMouseMove(ev: FederatedPointerEvent) {
        if (!this.dragging) {
            return;
        }
        const shouldSnap = useStore.getState().snap;

        const currentPoint = ev.global;

        let x = (currentPoint.x - this.mouseStartPoint.x) / main.scale.x;
        let y = (currentPoint.y - this.mouseStartPoint.y) / main.scale.y;

        if (shouldSnap) {
            x = snap(x);
            y = snap(y);
        }

        this.leftNode.setPosition(this.x1 + x, this.y1 + y);
        this.rightNode.setPosition(this.x2 + x, this.y2 + y);

        this.drawWall();
    }

    public blur() {
        this.focused = false;
        this.leftNode.setVisibility(false);
        this.rightNode.setVisibility(false);
        this.measuresContainer?.hide();
        this.zIndex = WALL_INACTIVE_Z_INDEX;

        this.updateCorners();
    }

    public focus() {
        this.focused = true;

        this.leftNode.setVisibility(true);
        this.rightNode.setVisibility(true);

        this.measuresContainer?.show();

        this.zIndex = WALL_ACTIVE_Z_INDEX;

        this.updateCorners();
    }

    private onMouseClick(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        const globalCords = { x: viewportX(ev.global.x), y: viewportY(ev.global.y) };

        switch (state.activeTool) {
            case Tool.Edit:
                const parent = this.parent as WallNodeSequence;
                parent.blurAllElements(this.uuid);
                this.focus();
                state.setFocusedElement(this);

                break;
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                this.tempFurniture?.add();

                break;

            case Tool.WallAdd:
                const hasChildren = this.children.some(
                    (child) => child instanceof Door || child instanceof WindowElement
                );

                if (hasChildren) {
                    notifications.show({
                        title: 'Błędna pozycja',
                        message: 'Nie można podzielić ściany na której znajdują się inne elementy.',
                        color: 'red',
                    });
                    return;
                }

                const addNode = new AddNodeAction(
                    this,
                    getClosestPointOnLine(globalCords, [
                        { x: this.leftNode.x, y: this.leftNode.y },
                        { x: this.rightNode.x, y: this.rightNode.y },
                    ])
                );

                addNode.execute();

                break;
        }
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        if (useStore.getState().activeMode !== ViewMode.Edit) return;

        this.clickStartTime = Date.now();

        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.Edit:
                if (this.dragging) return;

                this.dragging = true;
                this.mouseStartPoint.x = ev.global.x;
                this.mouseStartPoint.y = ev.global.y;

                this.x1 = this.leftNode.position.x;
                this.y1 = this.leftNode.position.y;

                this.x2 = this.rightNode.position.x;
                this.y2 = this.rightNode.position.y;
                break;
            case Tool.Remove:
                this.delete();

                break;
            case Tool.FurnitureAddWindow:
                break;
        }
    }

    private onMouseUp(ev: FederatedPointerEvent) {
        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200) {
            this.onMouseClick(ev);
        }

        this.dragging = false;

        return;
    }

    public delete() {
        const action = new DeleteWallAction(this);

        action.execute();

        new DeleteWallNodeAction(this.leftNode.getId()).execute();
        new DeleteWallNodeAction(this.rightNode.getId()).execute();
    }

    public setLength(newLength: number) {
        const [x1, y1, x2, y2] = [this.leftNode.x, this.leftNode.y, this.rightNode.x, this.rightNode.y];

        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const currentLength = euclideanDistance(x1, x2, y1, y2);

        const directionX = deltaX / currentLength;
        const directionY = deltaY / currentLength;

        const newRightX = x1 + directionX * newLength;
        const newRightY = y1 + directionY * newLength;

        this.rightNode.setPosition(newRightX, newRightY);

        this.drawWall();
    }

    private isOccupiedSpot(elementX: number): boolean {
        const furnitureHeight = this.tempFurniture?.element?.length || 0;

        if (furnitureHeight > this.length - DISTANCE_FROM_WALL) return true;

        const startX = elementX;
        const endX = elementX + furnitureHeight;

        let isOccupied = false;

        const occupiedSpots: { start: number; end: number }[] = [];

        this.children.forEach((child) => {
            if ((child instanceof Door || child instanceof WindowElement) && !child.isTemporary) {
                const x = child.position.x;
                occupiedSpots.push({ start: x, end: x + child.length });
            }
        });

        occupiedSpots.sort((a, b) => a.start - b.start);

        for (const { start, end } of occupiedSpots) {
            if (endX >= start && startX <= end) {
                isOccupied = true;
                break;
            }

            isOccupied = false;
        }

        return isOccupied;
    }

    private hasElements() {
        return this.children.some((child) => child instanceof Door || child instanceof WindowElement);
    }

    onWallMouseMove(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                this.tempFurniture?.updatePosition(localCoords);

                break;

            case Tool.WallAdd:
                this.dashedLineContainer?.update({
                    isOccupied: this.hasElements() || this.isOccupiedSpot(localCoords.x),
                    localCoords,
                });

                break;
        }
    }
}
