import { Graphics, FederatedPointerEvent, Container } from 'pixi.js';
import { lineIntersection, segmentIntersection } from '@pixi/math-extras';
import { euclideanDistance } from '../../../../helpers/EuclideanDistance';
import { Point } from '../../../../helpers/Point';
import { snap, viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';

import { useStore } from '../../../../stores/EditorStore';
import { AddNodeAction } from '../../actions/AddNodeAction';
import { DeleteWallAction } from '../../actions/DeleteWallAction';
import { INTERIOR_WALL_THICKNESS, Tool, ToolMode, ViewMode, WALL_THICKNESS } from '../../constants';
import { WallNode } from './WallNode';
import { main } from '@/2d/EditorRoot';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { WallType, wallTypeConfig } from './config';
import { v4 as uuidv4 } from 'uuid';

import { MeasureLabel } from '../TransformControls/MeasureLabel';
import { Door } from '../Furnitures/Door/Door';
import { WindowElement } from '../Furnitures/Window/Window';

import { AddFurnitureAction } from '../../actions/AddFurnitureAction';
import { notifications } from '@mantine/notifications';
import { DashedLine } from '../Helpers/DashedLine';
import { getClosestPointOnLine } from '@/2d/helpers/geometry';
import { AddWallManager } from '../../actions/AddWallManager';
import { DISTANCE_FROM_WALL } from '../Furnitures/BuildingElement';
import {
    WALL_ACTIVE_STROKE_COLOR,
    WALL_ACTIVE_Z_INDEX,
    WALL_FILL_COLOR,
    WALL_INACTIVE_Z_INDEX,
    WALL_STROKE_COLOR,
} from './constants';
import { WallNodeSequence } from './WallNodeSequence';

export const DEFAULT_WALL_TYPE = WallType.Exterior;

export type WallSettings = {
    uuid?: string;
    type?: WallType;
    thickness?: number;
};

const normalizeAngle = (angle: number) => (angle >= 180 ? angle - 180 : angle);

const areAnglesDifferent = (angle1: number, angle2: number) => normalizeAngle(~angle1) !== normalizeAngle(~angle2);

const IS_DEBUG = false;
export class Wall extends Graphics {
    uuid = uuidv4();
    leftNode: WallNode;
    rightNode: WallNode;
    length: number;
    measureLabelTop: MeasureLabel;
    measureLabelBottom: MeasureLabel;
    children: Container[] = [];
    lineHelper: Graphics;
    dotHelperA: Graphics;
    dotHelperB: Graphics;
    dotHelperC: Graphics;
    dotHelperD: Graphics;
    graphic: Graphics;

    // rightBackground: Graphics | undefined;
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

    tempFurniture: Door | WindowElement | null = null;

    color = WALL_FILL_COLOR;

    leftNodePlaceholder: Graphics | undefined;
    rightNodePlaceholder: Graphics | undefined;
    pointA: { x: number; y: number };
    pointC: { x: number; y: number };
    pointD: { x: number; y: number };
    pointB: { x: number; y: number };

    constructor(leftNode: WallNode, rightNode: WallNode, settings?: WallSettings) {
        super();
        this.sortableChildren = true;
        this.eventMode = 'dynamic';
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.dragging = false;
        this.mouseStartPoint = { x: 0, y: 0 };

        this.lineHelper = new Graphics();

        this.dotHelperA = new Graphics();
        this.dotHelperB = new Graphics();
        this.dotHelperC = new Graphics();
        this.dotHelperD = new Graphics();

        this.helpersContainer.addChild(this.lineHelper);
        this.helpersContainer.addChild(this.dotHelperA);
        this.helpersContainer.addChild(this.dotHelperB);
        this.helpersContainer.addChild(this.dotHelperC);
        this.helpersContainer.addChild(this.dotHelperD);

        this.addChild(this.helpersContainer);

        this.graphic = new Graphics();

        this.addChild(this.graphic);

        this.getNodesCords();

        this.measureLabelTop = new MeasureLabel(0);
        this.measureLabelBottom = new MeasureLabel(0);
        this.addChild(this.measureLabelTop);
        this.addChild(this.measureLabelBottom);

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

        this.drawLine();
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
        const pointA = this.pointA;
        const pointB = this.pointB;
        const pointC = this.pointC;
        const pointD = this.pointD;

        const strokeColor = this.focused ? WALL_ACTIVE_STROKE_COLOR : WALL_STROKE_COLOR;

        const middleEndPoint = { x: this.length, y: this.thickness / 2 };
        const middleStartPoint = { x: 0, y: this.thickness / 2 };

        this.graphic.clear();

        this.graphic
            .poly([
                pointA.x,
                pointA.y,
                pointB.x,
                pointB.y,
                middleEndPoint.x,
                middleEndPoint.y,
                pointC.x,
                pointC.y,
                pointD.x,
                pointD.y,
                middleStartPoint.x,
                middleStartPoint.y,
            ])
            .fill({ color: this.color })
            .stroke({ width: 1, color: strokeColor });
    }

    public setStyles() {
        if (!this.parent) return;

        const parent = this.parent as WallNodeSequence;

        this.pointA = { x: 0, y: this.thickness };
        this.pointB = { x: this.length, y: this.thickness };
        this.pointC = { x: this.length, y: 0 };
        this.pointD = { x: 0, y: 0 };

        const aCornerWall = parent.findFirstNeighbor(this, this.leftNode.getId(), true);

        if (aCornerWall && areAnglesDifferent(aCornerWall.angle, this.angle)) {
            const x1 = -100;
            const y1 = this.thickness;
            const x2 = this.length + 100;
            const y2 = this.thickness;

            const yPos = this.leftNode === aCornerWall.leftNode ? 0 : aCornerWall.thickness;

            const x3 = -100;
            const y3 = yPos;
            const x4 = aCornerWall.length + 100;
            const y4 = yPos;

            const point1 = this.toGlobal({ x: x1, y: y1 });
            const point2 = this.toGlobal({ x: x2, y: y2 });
            const point3 = aCornerWall.toGlobal({ x: x3, y: y3 });
            const point4 = aCornerWall.toGlobal({ x: x4, y: y4 });

            this.pointA = this.toLocal(lineIntersection(point1, point2, point3, point4));

            // aCornerWall.updateCorners(aCornerWall.pointA, aCornerWall.pointB, aCornerWall.pointC, aCornerWall.pointD);
        }

        const dCornerWall = parent.findFirstNeighbor(this, this.leftNode.getId(), false);
        if (dCornerWall && areAnglesDifferent(dCornerWall.angle, this.angle)) {
            const x1 = -100;
            const y1 = 0;
            const x2 = this.length + 100;
            const y2 = 0;

            const yPos = this.leftNode === dCornerWall.leftNode ? dCornerWall.thickness : 0;

            const x3 = -100;
            const y3 = yPos;
            const x4 = dCornerWall.length + 100;
            const y4 = yPos;

            const point1 = this.toGlobal({ x: x1, y: y1 });
            const point2 = this.toGlobal({ x: x2, y: y2 });
            const point3 = dCornerWall.toGlobal({ x: x3, y: y3 });
            const point4 = dCornerWall.toGlobal({ x: x4, y: y4 });

            this.pointD = this.toLocal(lineIntersection(point1, point2, point3, point4));
        }

        const cCornerWall = parent.findFirstNeighbor(this, this.rightNode.getId(), true);
        if (cCornerWall && areAnglesDifferent(cCornerWall.angle, this.angle)) {
            const x1 = -100;
            const y1 = 0;
            const x2 = this.length + 100;
            const y2 = 0;

            const yPos = this.rightNode === cCornerWall.rightNode ? cCornerWall.thickness : 0;

            const x3 = -100;
            const y3 = yPos;
            const x4 = cCornerWall.length + 100;
            const y4 = yPos;

            const point1 = this.toGlobal({ x: x1, y: y1 });
            const point2 = this.toGlobal({ x: x2, y: y2 });
            const point3 = cCornerWall.toGlobal({ x: x3, y: y3 });
            const point4 = cCornerWall.toGlobal({ x: x4, y: y4 });

            this.pointC = this.toLocal(lineIntersection(point1, point2, point3, point4));
        }

        const bCornerWall = parent.findFirstNeighbor(this, this.rightNode.getId(), false);

        if (bCornerWall && areAnglesDifferent(bCornerWall.angle, this.angle)) {
            const x1 = -100;
            const y1 = this.thickness;
            const x2 = this.length + 100;
            const y2 = this.thickness;

            const yPos = this.rightNode === bCornerWall.rightNode ? 0 : bCornerWall.thickness;

            const x3 = -100;
            const y3 = yPos;
            const x4 = bCornerWall.length + 100;
            const y4 = yPos;

            const point1 = this.toGlobal({ x: x1, y: y1 });
            const point2 = this.toGlobal({ x: x2, y: y2 });
            const point3 = bCornerWall.toGlobal({ x: x3, y: y3 });
            const point4 = bCornerWall.toGlobal({ x: x4, y: y4 });

            this.pointB = this.toLocal(lineIntersection(point1, point2, point3, point4));
        }

        this.updateDebugHelpers();
        this.updateCorners();
    }

    private updateDebugHelpers() {
        if (!IS_DEBUG) return;

        this.dotHelperA.clear();
        this.dotHelperA.zIndex = 1001;
        this.dotHelperA.circle(this.pointA.x, this.pointA.y, 3);
        this.dotHelperA.stroke({ width: 1, color: 'red' });

        this.dotHelperB.clear();
        this.dotHelperB.zIndex = 1001;
        this.dotHelperB.circle(this.pointB.x, this.pointB.y, 3);
        this.dotHelperB.stroke({ width: 1, color: 'green' });

        this.dotHelperC.clear();
        this.dotHelperC.zIndex = 1001;
        this.dotHelperC.circle(this.pointC.x, this.pointC.y, 3);
        this.dotHelperC.stroke({ width: 1, color: 'blue' });

        this.dotHelperD.clear();
        this.dotHelperD.zIndex = 1001;
        this.dotHelperD.circle(this.pointD.x, this.pointD.y, 3);
        this.dotHelperD.stroke({ width: 1, color: 'purple' });
    }

    private onMouseOver(ev: FederatedPointerEvent) {
        // this.color = WALL_HOVER_FILL_COLOR;

        // console.log({
        //     angle: this.angle,
        //     calcAngle: this.angle > 180 ? this.angle - 180 : this.angle,
        // });

        const state = useStore.getState();

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                this.removeTempFurniture();

                const Element = state.activeTool === Tool.FurnitureAddDoor ? Door : WindowElement;

                this.tempFurniture = new Element({ parent: this });
                this.tempFurniture.setTemporality(true);

                this.addChild(this.tempFurniture);
                this.updateFurniturePosition(localCoords);

                break;

            case Tool.WallAdd:
                const lineWidth = this.thickness;
                const line = new DashedLine(lineWidth);
                line.rotation = Math.PI * 0.5;
                this.addChild(line);

                this.leftNode.setVisibility(true);
                this.rightNode.setVisibility(true);

                break;
        }
    }

    private onMouseOut() {
        if (this.dragging) return;

        this.fill({ color: WALL_FILL_COLOR });

        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                this.removeTempFurniture();

                break;

            case Tool.WallAdd:
                for (const child of this.children) {
                    if (child instanceof DashedLine) {
                        child.visible = false;
                        // this.removeChild(child).destroy();
                    }
                }

                this.leftNode.setVisibility(false);
                this.rightNode.setVisibility(false);

                break;
        }
    }

    public setType(newType: WallType) {
        if (this.type === newType) return;

        this.type = newType;

        this.applySettings();
        this.drawLine();
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

    public getNodesCords() {
        return [this.leftNode.x, this.leftNode.y, this.rightNode.x, this.rightNode.y];
    }

    private drawWallNodesPlaceholders() {
        this.leftNodePlaceholder?.clear();
        this.rightNodePlaceholder?.clear();

        const nodes = [
            { x: 0, y: this.thickness / 2, el: this.leftNodePlaceholder, node: this.leftNode },
            { x: this.length, y: this.thickness / 2, el: this.rightNodePlaceholder, node: this.rightNode },
        ];
        nodes.forEach((node, idx) => {
            const isRight = idx;

            const nodeItem = new Graphics();

            nodeItem.circle(node.x, node.y, 5);
            nodeItem.fill('transparent');

            nodeItem.eventMode = 'static';

            nodeItem.on('pointerdown', () => {
                switch (useStore.getState().activeTool) {
                    case Tool.WallAdd:
                        AddWallManager.Instance.step(isRight ? this.rightNode : this.leftNode);
                        break;
                }
            });

            node.el = nodeItem;

            if (isRight) {
                this.rightNodePlaceholder = nodeItem;
                this.addChild(this.rightNodePlaceholder);
            }

            if (!isRight) {
                this.leftNodePlaceholder = nodeItem;
                this.addChild(this.leftNodePlaceholder);
            }
        });
    }

    public drawLine() {
        const x1 = this.leftNode.x;
        const y1 = this.leftNode.y;
        const x2 = this.rightNode.x;
        const y2 = this.rightNode.y;

        this.length = Math.floor(euclideanDistance(x1, x2, y1, y2));

        const minLength = this.getMinimumWallLength();

        if (this.length < minLength) {
            this.leftNode.dragging = false;
            this.rightNode.dragging = false;

            this.leftNode.setToPrevPosition();
            this.rightNode.setToPrevPosition();

            this.leftNode.setStyles({});
            this.rightNode.setStyles({});

            notifications.clean();

            notifications.show({
                title: '🚪 Za krótka ściana',
                message: 'Nie można zmniejszyć ściany. Usuń drzwi.',
                color: 'red',
            });

            this.drawLine();

            return;
        }

        this.setStyles();

        let theta = Math.atan2(y2 - y1, x2 - x1);

        theta *= 180 / Math.PI;
        if (theta < 0) theta = 360 + theta;

        this.position.set(x1, y1);
        this.angle = theta;

        this.leftNode.angle = theta;
        this.rightNode.angle = theta;

        this.updateMeasureLabels();

        this.drawWallNodesPlaceholders();
    }

    private getMinimumWallLength(): number {
        let minLength = 0;
        this.children.forEach((child) => {
            if (child instanceof Door || child instanceof WindowElement) {
                const childEndX = child.position.x + child.length;
                if (childEndX > minLength) {
                    minLength = childEndX;
                }
            }
        });
        return parseInt(minLength.toString());
    }

    private updateMeasureLabels() {
        const pointA = this.pointA?.x || 0;
        const pointB = this.pointB?.x || 0;
        const pointC = this.pointC?.x || 0;
        const pointD = this.pointD?.x || 0;

        const topLength = Math.abs(pointD - pointC);
        this.measureLabelTop.update({
            length: topLength,
            angle: this.angle,
            startX: pointC,
            endX: pointD,
            offsetY: -5,
            thickness: this.thickness,
        });

        const bottomLength = Math.abs(pointB - pointA);
        this.measureLabelBottom.update({
            thickness: this.thickness,
            length: bottomLength,
            angle: this.angle,
            startX: pointA,
            endX: pointB,
            offsetY: this.thickness + 20,
        });
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

        this.drawLine();
    }

    public blur() {
        this.focused = false;
        this.leftNode.setVisibility(false);
        this.rightNode.setVisibility(false);
        this.measureLabelTop.hide();
        this.measureLabelBottom.hide();
        this.zIndex = WALL_INACTIVE_Z_INDEX;

        this.updateCorners();
    }

    public focus() {
        this.focused = true;

        this.leftNode.setVisibility(true);
        this.rightNode.setVisibility(true);
        this.measureLabelTop.show();
        this.measureLabelBottom.show();

        this.zIndex = WALL_ACTIVE_Z_INDEX;

        this.updateCorners();
    }

    private onMouseClick(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        const globalCords = { x: viewportX(ev.global.x), y: viewportY(ev.global.y) };

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        let helperLine = null;

        for (const child of this.children) {
            if (child instanceof DashedLine) {
                helperLine = child;
            }
        }

        switch (state.activeTool) {
            case Tool.Edit:
                const parent = this.parent as WallNodeSequence;
                parent.blurAllElements(this.uuid);
                this.focus();
                state.setFocusedElement(this);

                break;
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                if (this.tempFurniture) {
                    const isDoor = state.activeTool === Tool.FurnitureAddDoor;
                    const furniture = isDoor ? (this.tempFurniture as Door) : (this.tempFurniture as WindowElement);

                    if (!furniture.isValid) {
                        notifications.clean();

                        const icon = isDoor ? '🚪' : '🪟';
                        const message = isDoor
                            ? 'Nie można dodać drzwi, które kolidują z innymi elementami'
                            : 'Nie można dodać okna, które koliduje z innymi elementami';

                        notifications.show({
                            title: `${icon} Niewłaściwa pozycja`,
                            message,
                            color: 'red',
                        });
                        return;
                    }

                    const { x, y } = furniture.position;

                    // furniture.setValidity(true);

                    const action = new AddFurnitureAction(furniture, this, { x, y });

                    action.execute();

                    this.removeTempFurniture();
                }

                break;

            case Tool.WallAdd:
                const isOccupied = this.isOccupiedSpot(localCoords.x);

                if (isOccupied) {
                    notifications.show({
                        title: 'Nie można stworzyć ściany',
                        message: 'Nie można stworzyć ściany w miejscu w którym znajdują się inne elementy.',
                        color: 'red',
                    });
                } else {
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
                }

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
        const [x1, y1, x2, y2] = this.getNodesCords();

        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const currentLength = euclideanDistance(x1, x2, y1, y2);

        const directionX = deltaX / currentLength;
        const directionY = deltaY / currentLength;

        const newRightX = x1 + directionX * newLength;
        const newRightY = y1 + directionY * newLength;

        this.rightNode.setPosition(newRightX, newRightY);

        this.drawLine();
    }

    private getXWithinWall(elementX: number): number {
        // WALL BOUNDARIES
        const furnitureHeight = this.tempFurniture?.length || 0;

        let currentX = elementX;

        const maxX = this.length;

        const wallOffset = 0;

        let isBusy = false;

        const endX = elementX + furnitureHeight;
        const startX = elementX;

        const isWallEnd = endX > maxX - wallOffset;
        const isWallStart = startX < wallOffset;

        if (isWallEnd) {
            currentX = maxX - wallOffset - furnitureHeight;
        } else if (isWallStart) {
            currentX = wallOffset;
        }

        return currentX;
    }

    private isOccupiedSpot(elementX: number): boolean {
        const furnitureHeight = this.tempFurniture?.length || 0;

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

    private getPossibleCords({ x, y }: Point) {
        const newCords = { x, y };

        const currentX = this.getXWithinWall(newCords.x);

        const isCoolide = this.tempFurniture?.isCollide();

        this.tempFurniture?.setValidity(!isCoolide);

        newCords.x = currentX;

        return newCords;
    }

    private updateFurniturePosition(localCoords: Point) {
        const furnitureHeight = this.tempFurniture?.length || 0;

        const wallThickness = this.thickness;

        const doorThickness = 12;

        const fixedCords = {
            x: localCoords.x - furnitureHeight / 2,
            y: 0 + wallThickness - doorThickness,
        };

        const newCords = this.getPossibleCords(fixedCords);

        this.tempFurniture?.setPosition(newCords);
    }

    onWallMouseMove(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                if (this.tempFurniture) {
                    this.updateFurniturePosition(localCoords);
                }

                break;

            case Tool.WallAdd:
                const isOccupied = this.isOccupiedSpot(localCoords.x);

                for (const child of this.children) {
                    if (child instanceof DashedLine) {
                        const hasOccupiedElements = this.children.some(
                            (el) => el instanceof Door || el instanceof WindowElement
                        );

                        child.setStroke(isOccupied ? 'red' : hasOccupiedElements ? 'orange' : undefined);
                        child.setPosition({ x: localCoords.x, y: 0 });
                    }
                }

                break;
        }
    }

    removeTempFurniture() {
        this.removeChild(this.tempFurniture as Container);

        this.tempFurniture = null;
    }
}
