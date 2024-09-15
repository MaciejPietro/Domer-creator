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

export class Wall extends Graphics {
    leftNode: WallNode;
    rightNode: WallNode;
    length: number;
    label: Label;

    clickStartTime: number;

    x1: number;
    x2: number;
    y1: number;
    y2: number;
    thickness: number;
    isExteriorWall: boolean;

    dragging: boolean;
    mouseStartPoint: Point;
    startLeftNode: Point;
    startRightNode: Point;

    color = '#ffffff';

    constructor(leftNode: WallNode, rightNode: WallNode) {
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
        this.label = new Label(0);

        this.addChild(this.label);
        this.thickness = WALL_THICKNESS;
        this.pivot.set(0, WALL_THICKNESS / 2);
        this.isExteriorWall = true;
        this.drawLine();

        this.watchStoreChanges();

        this.on('pointerdown', this.onMouseDown);
        this.on('globalpointermove', this.onMouseMove);
        this.on('pointerup', this.onMouseUp);
        this.on('pointerupoutside', this.onMouseUp);
        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);

        this.clickStartTime = 0;
    }

    private watchStoreChanges() {
        useStore.subscribe(() => {
            this.setStyles();
        });
    }

    public setStyles() {
        const strokeColor = this.isFocused() ? '#1C7ED6' : '#1a1a1a';

        this.fill({ color: this.color }).stroke({ width: 2, color: strokeColor });
    }

    private onPointerOver() {
        this.color = '#f0f0ff';

        if (this.isEditMode()) {
            this.setStyles();
        }
    }

    private onPointerOut() {
        if (this.dragging) return;
        this.color = '#fff';

        this.setStyles();
    }

    public setIsExterior(value: boolean) {
        this.isExteriorWall = value;
        if (value) {
            this.thickness = WALL_THICKNESS;
        } else {
            this.thickness = INTERIOR_WALL_THICKNESS;
        }
        this.pivot.set(0, this.thickness / 2);
        this.leftNode.setSize(this.thickness);
        this.rightNode.setSize(this.thickness);
        this.drawLine();
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

        let theta = Math.atan2(this.y2 - this.y1, this.x2 - this.x1); // aflu unghiul sa pot roti

        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        this.length = euclideanDistance(this.x1, this.x2, this.y1, this.y2);

        this.rect(0, 0, this.length, this.thickness - 2);

        this.setStyles();

        this.position.set(this.x1, this.y1);
        this.angle = theta;

        this.leftNode.angle = theta;
        this.rightNode.angle = theta;

        this.label.update(this.length);
        this.label.position.x = this.width / 2;
        this.label.angle = 360 - theta;

        this.label.position.y = 25;
        this.label.zIndex = 998;
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

    private onMouseUp() {
        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200) {
            const state = useStore.getState();

            state.setFocusedElement(this as unknown as WallNode);
        }

        this.dragging = false;

        return;
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        if (!this.isEditMode()) return;

        this.clickStartTime = Date.now();

        const coords = { x: viewportX(ev.global.x), y: viewportY(ev.global.y) };

        console.log('xdxd coords', coords);

        const localCoords = ev.getLocalPosition(this as unknown as Container);

        const state = useStore.getState();

        if (state.activeTool == Tool.Remove) {
            this.delete();
        }

        if (state.activeTool == Tool.WallAdd) {
            const addNode = new AddNodeAction(this, coords);

            addNode.execute();
        }

        if (state.activeTool == Tool.FurnitureAddWindow) {
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
        }

        if (state.activeTool == Tool.FurnitureAddDoor) {
            getDoor()
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

    private isFocused() {
        // @ts-expect-error TODO
        return useStore.getState().focusedElement === this;
    }

    private isEditMode() {
        return useStore.getState().activeMode === ViewMode.Edit;
    }
}
