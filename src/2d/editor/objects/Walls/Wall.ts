import { Graphics, FederatedPointerEvent, Texture, Container } from 'pixi.js';
import { euclideanDistance } from '../../../../helpers/EuclideanDistance';
import { Point } from '../../../../helpers/Point';
import { getCorrespondingY } from '../../../../helpers/Slope';
import { viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';

import { useStore } from '../../../../stores/EditorStore';
import { AddFurnitureAction } from '../../actions/AddFurnitureAction';
import { AddNodeAction } from '../../actions/AddNodeAction';
import { DeleteWallAction } from '../../actions/DeleteWallAction';
import { INTERIOR_WALL_THICKNESS, Tool, ToolMode, ViewMode, WALL_THICKNESS } from '../../constants';
import { Label } from '../TransformControls/Label';
import { WallNode } from './WallNode';
import { AddWallManager } from '../../actions/AddWallManager';
import { main } from '@/2d/EditorRoot';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { WallType, wallTypeConfig } from './config';

import doorSvg from '@/assets/door/door.svg';

import { Furniture, FurnitureOrientation } from '../Furniture';
import { MeasureLabel } from '../TransformControls/MeasureLabel';
import { Door } from '../Furnitures/Door';
import { AddDoorAction } from '../../actions/AddDoorAction';

export const DEFAULT_WALL_TYPE = WallType.Exterior;

export type WallSettings = {
    type: WallType;
};

export class Wall extends Graphics {
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
    startLeftNode: Point;
    startRightNode: Point;

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
        this.startLeftNode = { x: 0, y: 0 };
        this.startRightNode = { x: 0, y: 0 };
        this.setLineCoords();

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
        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);

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

    private onPointerOver(ev: FederatedPointerEvent) {
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

    private onPointerOut() {
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

    public setIsExterior(value: boolean) {
        // this.isExteriorWall = value;
        // if (value) {
        //     this.thickness = WALL_THICKNESS;
        // } else {
        //     this.thickness = INTERIOR_WALL_THICKNESS;
        // }
        // this.pivot.set(0, this.thickness / 2);
        // this.leftNode.setSize(this.thickness);
        // this.rightNode.setSize(this.thickness);
        // this.drawLine();
    }

    public getIsExterior() {
        return this.isExteriorWall;
    }
    public setLineCoords() {
        if (this.leftNode.x == this.rightNode.x) {
            if (this.leftNode.y < this.rightNode.y) {
                return [this.leftNode.x, this.leftNode.y, this.rightNode.x, this.rightNode.y];
            } else {
                return [this.rightNode.x, this.rightNode.y, this.leftNode.x, this.leftNode.y];
            }
        } else if (this.leftNode.x < this.rightNode.x) {
            return [this.leftNode.x, this.leftNode.y, this.rightNode.x, this.rightNode.y];
        } else {
            return [this.rightNode.x, this.rightNode.y, this.leftNode.x, this.leftNode.y];
        }
    }

    public drawLine() {
        this.clear();
        [this.x1, this.y1, this.x2, this.y2] = this.setLineCoords();

        let theta = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);

        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        this.length = euclideanDistance(this.x1, this.x2, this.y1, this.y2);

        this.rect(0, 0, this.length, this.thickness - 2);

        this.setStyles();

        this.position.set(this.x1, this.y1);
        this.angle = theta;

        this.leftNode.angle = theta;
        this.rightNode.angle = theta;

        this.measureLabel.updateText(this.length, this.angle);
        this.measureLabel.updateLine(this.length);
    }

    private onMouseMove(ev: FederatedPointerEvent) {
        if (!this.dragging) {
            return;
        }

        const currentPoint = ev.global;
        const delta = {
            x: (currentPoint.x - this.mouseStartPoint.x) / main.scale.x,
            y: (currentPoint.y - this.mouseStartPoint.y) / main.scale.y,
        };

        this.leftNode.setPosition(this.startLeftNode.x + delta.x, this.startLeftNode.y + delta.y);
        this.rightNode.setPosition(this.startRightNode.x + delta.x, this.startRightNode.y + delta.y);
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

                    const action = new AddDoorAction(
                        this.tempFurniture,
                        this,
                        { x, y }
                        // res[0],
                        // this,
                        // this.leftNode.getId(),
                        // this.rightNode.getId()
                    );

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

                this.startLeftNode.x = this.leftNode.position.x;
                this.startLeftNode.y = this.leftNode.position.y;

                this.startRightNode.x = this.rightNode.position.x;
                this.startRightNode.y = this.rightNode.position.y;
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
        const [x1, y1, x2, y2] = this.setLineCoords();

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
