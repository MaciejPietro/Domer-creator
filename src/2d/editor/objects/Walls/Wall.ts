import { Graphics, FederatedPointerEvent, Texture, Container } from 'pixi.js';
import { euclideanDistance } from '../../../../helpers/EuclideanDistance';
import { Point } from '../../../../helpers/Point';
import { getCorrespondingY } from '../../../../helpers/Slope';
import { snap, viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';

import { useStore } from '../../../../stores/EditorStore';
import { AddNodeAction } from '../../actions/AddNodeAction';
import { DeleteWallAction } from '../../actions/DeleteWallAction';
import { INTERIOR_WALL_THICKNESS, Tool, ToolMode, ViewMode, WALL_THICKNESS } from '../../constants';
import { Label } from '../TransformControls/Label';
import { WallNode } from './WallNode';
import { AddWallManager } from '../../actions/AddWallManager';
import { main } from '@/2d/EditorRoot';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { WallType, wallTypeConfig } from './config';
import { v4 as uuidv4 } from 'uuid';

import doorSvg from '@/assets/door/door.svg';

import { Furniture, FurnitureOrientation } from '../Furniture';
import { MeasureLabel } from '../TransformControls/MeasureLabel';
import { Door } from '../Furnitures/Door';
import { AddFurnitureAction } from '../../actions/AddFurnitureAction';
import { notifications } from '@mantine/notifications';

export const DEFAULT_WALL_TYPE = WallType.Exterior;

export type WallSettings = {
    type: WallType;
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
    isExteriorWall: boolean;
    type: WallType;

    dragging: boolean;
    mouseStartPoint: Point;
    // startLeftNode: Point;
    // startRightNode: Point;

    //TODO move all below to different class

    tempFurniture: Door | null = null;

    color = '#ffffff';

    constructor(leftNode: WallNode, rightNode: WallNode, settings?: WallSettings) {
        super();
        this.sortableChildren = true;
        this.eventMode = 'dynamic';
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.dragging = false;
        this.mouseStartPoint = { x: 0, y: 0 };
        // this.startLeftNode = { x: 0, y: 0 };
        // this.startRightNode = { x: 0, y: 0 };
        this.getNodesCords();

        this.measureLabel = new MeasureLabel(0);

        this.addChild(this.measureLabel);
        this.isExteriorWall = true;
        this.drawLine();

        if (settings?.type !== undefined) {
            this.type = settings?.type;
        } else {
            const state = useStore.getState();

            const activeToolSettings = state.activeToolSettings;

            this.type = activeToolSettings?.wallType || DEFAULT_WALL_TYPE;
        }

        this.applySettings();

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
            this.checkVisibility();
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

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
                this.removeTempFurniture();

                const localCoords = ev.getLocalPosition(this as unknown as Container);

                this.tempFurniture = new Door();
                this.tempFurniture.setTemporality(true);
                this.addChild(this.tempFurniture);
                this.updateFurniturePosition(localCoords);

                break;
        }
    }

    private onMouseOut() {
        if (this.dragging) return;
        this.color = '#fff';

        this.setStyles();

        switch (Tool.FurnitureAddDoor) {
            case Tool.FurnitureAddDoor:
                this.removeTempFurniture();

                break;
        }
    }

    public setType(newType: WallType) {
        if (this.type === newType) return;

        this.type = newType;

        this.applySettings();
        this.drawLine();
    }

    public getIsExterior() {
        return this.isExteriorWall;
    }
    public getNodesCords() {
        return [this.leftNode.x, this.leftNode.y, this.rightNode.x, this.rightNode.y];
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

        this.rect(0, 0, this.length, this.thickness - 2);

        this.setStyles();

        this.position.set(x1, y1);
        this.angle = theta;

        this.leftNode.angle = theta;
        this.rightNode.angle = theta;

        this.measureLabel.updateText(this.length, this.angle);
        this.measureLabel.updateLine(this.length);
    }

    private getMinimumWallLength(): number {
        let minLength = 0;
        this.children.forEach((child) => {
            if (child instanceof Door) {
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

        this.leftNode.setPosition(this.x1 + x, this.y1 + y, false);
        this.rightNode.setPosition(this.x2 + x, this.y2 + y, false);

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

    private onMouseClick() {
        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.Edit:
                state.setFocusedElement(this as unknown as WallNode);

                this.focus();
                break;
            case Tool.FurnitureAddDoor:
                if (this.tempFurniture) {
                    const { x, y } = this.tempFurniture.position;

                    this.tempFurniture.setTemporality(false);

                    const action = new AddFurnitureAction(this.tempFurniture, this, { x, y });

                    action.execute();

                    this.removeTempFurniture();
                }

                break;
        }
    }

    private onMouseUp() {
        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200) {
            this.onMouseClick();
        }

        this.dragging = false;

        return;
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        if (!this.isEditMode()) return;

        this.clickStartTime = Date.now();

        const coords = { x: viewportX(ev.global.x), y: viewportY(ev.global.y) };

        const localCoords = ev.getLocalPosition(this as unknown as Container);

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

            case Tool.WallAdd:
                const addNode = new AddNodeAction(this, coords);

                addNode.execute();
                break;

            case Tool.Remove:
                this.delete();

                break;
            case Tool.FurnitureAddWindow:
                break;
            case Tool.FurnitureAddDoor:
                // if (this.tempFurniture) {
                //     const action = new AddFurnitureObjectAction(this.tempFurniture, this);

                //     action.execute();
                // }

                // const action = new AddFurnitureAction(
                //     {
                //         _id: '66e7f088294f7393fb6ee24a',
                //         name: 'Door',
                //         width: 1,
                //         height: 1,
                //         imagePath: doorSvg,
                //         category: '66e7f088294f7393fb6ee246',
                //     },
                //     this,
                //     { x: localCoords.x, y: 0 },
                //     this.leftNode.getId(),
                //     this.rightNode.getId()
                // );

                // this.removeTempFurniture();

                // action.execute();

                break;
        }
    }

    public delete() {
        const action = new DeleteWallAction(this);

        action.execute();

        new DeleteWallNodeAction(this.leftNode.getId()).execute();
        new DeleteWallNodeAction(this.rightNode.getId()).execute();
    }

    public setLength(newLength: number) {
        // Get the current coordinates of the wall nodes
        const [x1, y1, x2, y2] = this.getNodesCords();

        // Find the direction of the wall (unit vector)
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const currentLength = euclideanDistance(x1, x2, y1, y2);

        // Normalize the direction
        const directionX = deltaX / currentLength;
        const directionY = deltaY / currentLength;

        // Calculate the new position for the rightNode based on the new length
        const newRightX = x1 + directionX * newLength;
        const newRightY = y1 + directionY * newLength;

        // Update the right node's position
        this.rightNode.setPosition(newRightX, newRightY);

        // Redraw the wall with the updated node positions
        this.drawLine();
    }

    private isEditMode() {
        return useStore.getState().activeMode === ViewMode.Edit;
    }

    private getNextFreeSpot(elementX: number, elementHeight: number): number {
        const occupiedSpots: { start: number; end: number }[] = [];

        // Collect all occupied spots from children elements
        this.children.forEach((child) => {
            if (child instanceof Door && !child.isTemporary) {
                const x = child.position.x;
                occupiedSpots.push({ start: x, end: x + child.length });
            }
        });

        // Sort occupied spots by their start position
        occupiedSpots.sort((a, b) => a.start - b.start);

        let currentX = elementX;

        // Iterate through each occupied spot to find the next free spot
        for (const spot of occupiedSpots) {
            // If the current position + element height is before the start of the current spot,
            // then the current position is a valid free spot
            if (currentX + elementHeight <= spot.start) {
                return currentX;
            }

            // If the current position overlaps with the occupied spot, move past the end of this spot
            if (currentX < spot.end) {
                currentX = spot.end;
            }
        }

        // Return the current position, which will be past all occupied spots
        return currentX;
    }

    private getPossibleCords({ x, y }: Point) {
        const newCords = { x, y };
        const furnitureHeight = 80;

        const maxX = this.length;

        const wallOffset = 0;

        const furnitureEndX = newCords.x + furnitureHeight;
        const furnitureStartX = newCords.x;

        const isWallEnd = furnitureEndX > maxX - wallOffset;

        const isWallStart = furnitureStartX < wallOffset;

        if (isWallEnd) {
            newCords.x = maxX - wallOffset - furnitureHeight;
        } else if (isWallStart) {
            newCords.x = wallOffset;
        }

        const nextX = this.getNextFreeSpot(newCords.x, furnitureHeight);

        newCords.x = nextX;

        return newCords;
    }

    private updateFurniturePosition(localCoords: Point) {
        const furnitureHeight = 80;

        const wallThickness = this.thickness;

        const doorThickness = 12;

        const fixedCords = {
            x: localCoords.x - furnitureHeight / 2,
            y: 0 + wallThickness - doorThickness,
        };

        const newCords = this.getPossibleCords(fixedCords);

        this.tempFurniture?.setPosition(newCords);

        // const isLeftSide = localCoords.y < this.thickness / 2;

        // if (isLeftSide) {
        //     this.tempFurniture?.setOrientation(0);
        // } else {
        //     this.tempFurniture?.setOrientation(FurnitureOrientation._0);
        // }

        // return;
    }

    onWallMouseMove(ev: FederatedPointerEvent) {
        // if (this.dragging) return
        const state = useStore.getState();

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
                if (this.tempFurniture) {
                    this.updateFurniturePosition(localCoords);
                }
                // const furnitureData = {
                //     _id: '66e7f088294f7393fb6ee24a',
                //     name: 'Door',
                //     width: 1,
                //     height: 1,
                //     imagePath: doorSvg,
                //     category: '66e7f088294f7393fb6ee246',
                // };

                // this.tempFurniture = new Furniture(
                //     furnitureData,
                //     3333,
                //     this,
                //     this.leftNode.getId(),
                //     this.rightNode.getId()
                // );

                // this.tempFurniture.position.set(localCoords.x, 0);

                // this.addChild(this.tempFurniture);

                // const action = new AddFurnitureAction(
                //     {
                //         _id: '66e7f088294f7393fb6ee24a',
                //         name: 'Door',
                //         width: 1,
                //         height: 1,
                //         imagePath: doorSvg,
                //         category: '66e7f088294f7393fb6ee246',
                //     },
                //     this,
                //     { x: localCoords.x, y: 0 },
                //     this.leftNode.getId(),
                //     this.rightNode.getId()
                // );

                // action.execute();

                break;
        }

        // const currentPoint = ev.global;
        // const delta = {
        //     x: (currentPoint.x - this.mouseStartPoint.x) / main.scale.x,
        //     y: (currentPoint.y - this.mouseStartPoint.y) / main.scale.y,
        // };

        // this.leftNode.setPosition(this.startLeftNode.x + delta.x, this.startLeftNode.y + delta.y);
        // this.rightNode.setPosition(this.startRightNode.x + delta.x, this.startRightNode.y + delta.y);
    }

    removeTempFurniture() {
        this.removeChild(this.tempFurniture as Container);

        this.tempFurniture = null;
    }
}
