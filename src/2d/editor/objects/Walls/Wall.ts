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
import { isDoor, isWindow } from '@/2d/helpers/objects';
import { getDefaultSettings } from './helpers';

export const DEFAULT_WALL_TYPE = WallType.Exterior;

export const MIN_WALL_LENGTH = 20;

const DEBUG_MODE = false;

export type WallSettings = {
    uuid?: string;
    type?: WallType;
    thickness?: number;
};

const normalizeAngle = (angle: number) => (angle >= 180 ? angle - 180 : angle);

const areAnglesDifferent = (angle1: number, angle2: number) => normalizeAngle(~angle1) !== normalizeAngle(~angle2);

export class Wall extends Graphics {
    uuid = uuidv4();
    length: number;
    children: Container[] = [];

    graphic: Graphics;

    debugContainer: WallDebugContainer | null = null;
    measuresContainer: WallMeasuresContainer | null = null;
    dashedLineContainer: WallDashedLineContainer | null = null;
    tempFurniture: WallTempFurniture | null = null;

    helpersContainer = new Container();

    focused = false;

    clickStartTime = 0;

    x1: number;
    x2: number;
    y1: number;
    y2: number;
    thickness: number;
    type = DEFAULT_WALL_TYPE;

    dragging: boolean = false;
    mouseStartPoint: Point = { x: 0, y: 0 };

    color = WALL_FILL_COLOR;

    leftNodePlaceholder: Graphics | undefined;
    rightNodePlaceholder: Graphics | undefined;
    pointA: Point = { x: 0, y: 0 };
    pointC: Point = { x: 0, y: 0 };
    pointD: Point = { x: 0, y: 0 };
    pointB: Point = { x: 0, y: 0 };

    constructor(
        public leftNode: WallNode,
        public rightNode: WallNode,
        private settings: WallSettings = getDefaultSettings()
    ) {
        super();
        this.sortableChildren = true;
        this.eventMode = 'dynamic';

        const points = {
            a: this.pointA,
            b: this.pointB,
            c: this.pointC,
            d: this.pointD,
        };

        console.log('t', this.settings);

        this.applySettings();

        this.measuresContainer = new WallMeasuresContainer(points);
        this.dashedLineContainer = new WallDashedLineContainer(this.thickness);
        this.tempFurniture = new WallTempFurniture(this);

        this.addChild(this.measuresContainer);
        this.addChild(this.dashedLineContainer);
        this.addChild(this.tempFurniture);

        if (DEBUG_MODE) {
            this.debugContainer = new WallDebugContainer(points);
            this.addChild(this.debugContainer);
        }

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

        this.zIndex = WALL_INACTIVE_Z_INDEX;
    }

    private applySettings() {
        const { type, uuid, thickness } = this.settings || {};

        if (type !== undefined) {
            this.type = type;
        } else {
            const state = useStore.getState();

            const activeToolSettings = state.activeToolSettings;

            this.type = activeToolSettings?.wallType || DEFAULT_WALL_TYPE;
        }

        this.thickness = thickness || wallTypeConfig[this.type].thickness;

        if (uuid) this.uuid = uuid;

        this.pivot.set(0, this.thickness * 0.5);
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

    public setType(newType: WallType) {
        if (this.type === newType) return;

        this.settings.type = newType;
        this.settings.thickness = wallTypeConfig[newType].thickness;

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

    public handleInvalidLength() {}

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
        this.measuresContainer?.update({ thickness: this.thickness, angle: this.angle });

        this.zIndex = WALL_ACTIVE_Z_INDEX;

        this.updateCorners();
    }

    private onMouseOver() {
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

    private onMouseClick(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        const globalCords = { x: viewportX(ev.global.x), y: viewportY(ev.global.y) };

        switch (state.activeTool) {
            case Tool.Remove:
                this.delete();
                break;
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

        if (state.activeTool !== Tool.Edit) return;
        if (this.dragging) return;

        this.dragging = true;
        this.mouseStartPoint.x = ev.global.x;
        this.mouseStartPoint.y = ev.global.y;

        this.x1 = this.leftNode.position.x;
        this.y1 = this.leftNode.position.y;

        this.x2 = this.rightNode.position.x;
        this.y2 = this.rightNode.position.y;
    }

    private onMouseUp(ev: FederatedPointerEvent) {
        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200) this.onMouseClick(ev);

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

    public getOccupiedSpots() {
        const occupiedSpots: Array<{
            start: number;
            end: number;
        }> = [
            { start: DISTANCE_FROM_WALL, end: DISTANCE_FROM_WALL },
            { start: this.length - DISTANCE_FROM_WALL, end: this.length - DISTANCE_FROM_WALL },
        ];

        for (const child of this.children) {
            if (isDoor(child) || isWindow(child)) {
                occupiedSpots.push({ start: child.position.x, end: child.position.x + child.length || 0 });
            }
        }

        occupiedSpots.sort((a, b) => a.start - b.start);

        return occupiedSpots;
    }

    private isOccupiedSpot(elementX: number): boolean {
        const furnitureHeight = this.tempFurniture?.element?.length || 0;

        if (furnitureHeight > this.length - DISTANCE_FROM_WALL) return true;

        const startX = elementX;
        const endX = elementX + furnitureHeight;

        const occupiedSpots = this.getOccupiedSpots();

        for (const { start, end } of occupiedSpots) {
            if (endX >= start && startX <= end) {
                return true;
            }
        }

        return false;
    }

    private hasElements() {
        return this.children.some((child) => child instanceof Door || child instanceof WindowElement);
    }

    private onWallMouseMove(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
            case Tool.FurnitureAddWindow:
                this.tempFurniture?.updatePosition(localCoords);

                break;

            case Tool.WallAdd:
                const tooCloseToEdge =
                    localCoords.x < DISTANCE_FROM_WALL || localCoords.x > this.length - DISTANCE_FROM_WALL;

                this.dashedLineContainer?.update({
                    isOccupied: tooCloseToEdge || this.hasElements() || this.isOccupiedSpot(localCoords.x),
                    localCoords,
                });

                break;
        }
    }
}
