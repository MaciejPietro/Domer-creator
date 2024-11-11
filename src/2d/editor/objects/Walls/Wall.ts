import { Graphics, FederatedPointerEvent, Container } from 'pixi.js';
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

export const DEFAULT_WALL_TYPE = WallType.Exterior;

export type WallSettings = {
    uuid?: string;
    type?: WallType;
};

export class Wall extends Graphics {
    uuid = uuidv4();
    leftNode: WallNode;
    rightNode: WallNode;
    length: number;
    measureLabel: MeasureLabel;
    children: Container[] = [];

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

    color = '#ffffff';

    leftNodePlaceholder: Graphics | undefined;
    rightNodePlaceholder: Graphics | undefined;

    constructor(leftNode: WallNode, rightNode: WallNode, settings?: WallSettings) {
        super();
        this.sortableChildren = true;
        this.eventMode = 'dynamic';
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.dragging = false;
        this.mouseStartPoint = { x: 0, y: 0 };

        // this.zIndex = wallTypeConfig[this.type].zIndex;

        this.getNodesCords();

        this.measureLabel = new MeasureLabel(0);

        this.addChild(this.measureLabel);
        this.drawLine();

        if (settings?.type !== undefined) {
            this.type = settings?.type;
        } else {
            const state = useStore.getState();

            const activeToolSettings = state.activeToolSettings;

            this.type = activeToolSettings?.wallType || DEFAULT_WALL_TYPE;
        }

        if (settings?.uuid) this.uuid = settings.uuid;

        this.applySettings();

        this.drawWallNodesPlaceholders();

        this.watchStoreChanges();

        this.on('pointerdown', this.onMouseDown);
        this.on('pointerup', this.onMouseUp);
        this.on('globalpointermove', this.onMouseMove);
        this.on('pointermove', this.onWallMouseMove);
        this.on('pointerupoutside', this.onMouseUp);
        this.on('pointerover', this.onMouseOver);
        this.on('pointerout', this.onMouseOut);

        this.clickStartTime = 0;
    }

    private watchStoreChanges() {
        useStore.subscribe(() => {
            if (this.context) this.checkVisibility();
        });
    }

    private checkVisibility() {
        const focusedElement = useStore.getState().focusedElement;

        this.setStyles();

        if (focusedElement === this) {
            this.focus();
        }
        if (focusedElement !== this) {
            this.blur();
        }
        this.setStyles();
    }

    private applySettings() {
        const wallThickness = wallTypeConfig[this.type].thickness;

        this.thickness = wallThickness;
        this.pivot.set(0, wallThickness * 0.5);
    }

    public setStyles() {
        // bg-blue-500 from tailwind.config.js
        const strokeColor = this.focused ? '#1C7ED6' : '#1a1a1a';

        this.fill({ color: this.color }).stroke({ width: 1, color: strokeColor });
    }

    private onMouseOver(ev: FederatedPointerEvent) {
        this.color = '#f5f9ff';

        if (this.isEditMode()) {
            this.setStyles();
        }

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
        this.color = '#fff';

        this.setStyles();

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

        // this.zIndex = wallTypeConfig[this.type].zIndex;

        this.applySettings();
        this.drawLine();
        this.updateChildren();
    }

    private updateChildren() {
        for (const item of this.children) {
            if (item instanceof Door || item instanceof WindowElement) {
                item.setPosition({ x: null, y: null });
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
            { x: 0, y: this.thickness / 2, el: this.leftNodePlaceholder },
            { x: this.length, y: this.thickness / 2, el: this.rightNodePlaceholder },
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

        let theta = Math.atan2(y2 - y1, x2 - x1);

        theta *= 180 / Math.PI;
        if (theta < 0) theta = 360 + theta;

        this.clear();

        // testing fill end and start of the wall, previously was         this.rect(0, 0, this.length, this.thickness);
        // this.rect(-this.thickness / 2, 0, this.length + this.thickness, this.thickness);
        this.rect(0, 0, this.length, this.thickness);

        this.setStyles();

        this.position.set(x1, y1);
        this.angle = theta;

        this.leftNode.angle = theta;
        this.rightNode.angle = theta;

        this.measureLabel.updateText(this.length, this.angle);
        this.measureLabel.updateLine(this.length);
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
        this.leftNode.hide();
        this.rightNode.hide();
        this.measureLabel.hide();
    }

    public focus() {
        this.focused = true;
        this.leftNode.show();
        this.rightNode.show();
        this.measureLabel.show();
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
                state.setFocusedElement(this as unknown as WallNode);

                this.focus();
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

                    furniture.setTemporality(false);

                    furniture.setValidity(true);

                    const action = new AddFurnitureAction(furniture, this, { x, y });

                    action.execute();
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

        if (!this.isEditMode()) return;

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

    private isEditMode() {
        return useStore.getState().activeMode === ViewMode.Edit;
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

        console.log(occupiedSpots);

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
