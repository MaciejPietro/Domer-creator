import { Graphics, FederatedPointerEvent, Texture, Container } from 'pixi.js';
import { getDoor, getWindow } from '../../../../api/api-client';
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
import { AddFurnitureObjectAction } from '../../actions/AddFurnitureObjectAction';
import { MeasureLabel } from '../TransformControls/MeasureLabel';
import { Door } from '../Furnitures/Door';

export const DEFAULT_WALL_TYPE = WallType.Exterior;

export type WallSettings = {
    type: WallType;
};

export class Wall extends Graphics {
    leftNode: WallNode;
    rightNode: WallNode;
    length: number;
    label: MeasureLabel;

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

        this.label = new MeasureLabel(0);

        this.addChild(this.label);
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
        this.on('globalpointermove', this.onMouseMove);
        this.on('pointermove', this.onWallMouseMove);
        this.on('pointerup', this.onMouseUp);
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

        if (focusedElement === this) this.focused = true;
        if (focusedElement !== this) this.focused = false;

        this.setStyles();
    }

    private applySettings() {
        const wallThickness = wallTypeConfig[this.type].thickness;

        this.thickness = wallThickness;
        this.pivot.set(0, wallThickness / 2);
    }

    public setStyles() {
        const strokeColor = this.focused ? '#1C7ED6' : '#1a1a1a';

        this.fill({ color: this.color }).stroke({ width: 1, color: strokeColor });
    }

    private onPointerOver() {
        this.color = '#f5f9ff';

        if (this.isEditMode()) {
            this.setStyles();
        }

        this.tempFurniture = new Door();

        this.addChild(this.tempFurniture);

        switch (Tool.FurnitureAddDoor) {
            case Tool.FurnitureAddDoor:
                this.removeTempFurniture();

                this.tempFurniture = new Door();
                this.addChild(this.tempFurniture);

                break;
        }
    }

    private onPointerOut() {
        if (this.dragging) return;
        this.color = '#fff';

        this.setStyles();
        // this.removeTempFurniture();

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

        this.label.updateText(this.length, this.angle);
        this.label.updateLine(this.length, this.angle);
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

    private onMouseClick() {
        const state = useStore.getState();

        state.setFocusedElement(this as unknown as WallNode);

        this.leftNode.show();
        this.rightNode.show();
        this.label.visible = true;
    }

    private onMouseUp() {
        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200 && useStore.getState().activeTool === Tool.Edit) {
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
                getWindow()
                    .then((res) => {
                        const action = new AddFurnitureAction(
                            res[0],
                            this,
                            { x: localCoords.x, y: 0 },
                            this.leftNode.getId(),
                            this.rightNode.getId()
                        );

                        action.execute();

                        return;
                    })
                    .catch((err) => console.error(err));
                break;
            case Tool.FurnitureAddDoor:
                // console.log('xdxd getDoor', this.tempFurniture);

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

    onWallMouseMove(ev: any) {
        // if (this.dragging) return
        const state = useStore.getState();

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        this.tempFurniture?.setPosition(localCoords);

        return;

        switch (state.activeTool) {
            case Tool.FurnitureAddDoor:
                if (this.tempFurniture) {
                    const localCoords = ev.getLocalPosition(this as unknown as Container);

                    this.tempFurniture?.setPosition(localCoords);

                    // const furnitureHeight = this.tempFurniture?._texture.height;

                    // this.tempFurniture.position.set(localCoords.x, 0);
                    // this.tempFurniture.loadTexture(doorSvg);

                    // const furnitureEndX = localCoords.x + furnitureHeight / 2;
                    // const furnitureStartX = localCoords.x - furnitureHeight / 2;

                    // const minX = 10;
                    // const maxX = this.length;

                    // // if (furnitureEndX > maxX - 5 || furnitureStartX < 5) {
                    // //     this.tempFurniture.loadTexture(doorRedSvg);
                    // // } else {
                    // //     this.tempFurniture.loadTexture(doorGreenSvg);
                    // // }

                    // const isLeftSide = localCoords.y < this.thickness / 2;

                    // if (isLeftSide) {
                    //     this.tempFurniture.setOrientation(FurnitureOrientation._180);
                    // } else {
                    //     this.tempFurniture.setOrientation(FurnitureOrientation._0);
                    // }

                    // return;
                }
                const furnitureData = {
                    _id: '66e7f088294f7393fb6ee24a',
                    name: 'Door',
                    width: 1,
                    height: 1,
                    imagePath: doorSvg,
                    category: '66e7f088294f7393fb6ee246',
                };

                this.tempFurniture = new Furniture(
                    furnitureData,
                    3333,
                    this,
                    this.leftNode.getId(),
                    this.rightNode.getId()
                );

                this.tempFurniture.position.set(localCoords.x, 0);

                this.addChild(this.tempFurniture);

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
