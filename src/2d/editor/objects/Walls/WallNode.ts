import { Graphics, FederatedPointerEvent, Container } from 'pixi.js';
import { Tool, ViewMode } from '../../constants';
import { useStore } from '../../../../stores/EditorStore';
import { AddWallManager } from '../../actions/AddWallManager';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { INodeSerializable } from '../../persistence/INodeSerializable';
import { FloorPlan } from '../FloorPlan';
import { snap } from '../../../../helpers/ViewportCoordinates';
import { Wall } from './Wall';
import { main } from '@/2d/EditorRoot';
import { Point } from '@/helpers/Point';
import { BuildingElement } from '../Furnitures/BuildingElement';
import { showCollisionError, showMinLengthError } from './errors';
import { isWall } from '@/2d/helpers/objects';
import { MIN_WALL_LENGTH } from './constants';

export class WallNode extends Container {
    public dragging: boolean;
    private id: number;
    private dot = new Graphics();
    mouseStartPoint: Point;

    private size = 10;
    public prevPosition = { x: 0, y: 0 };
    private isMouseOver = false;
    background: any;

    constructor(x: number, y: number, nodeId: number) {
        super();
        this.eventMode = 'static';
        this.id = nodeId;

        this.setStyles({});

        this.mouseStartPoint = { x: 0, y: 0 };

        this.prevPosition = { x, y };
        this.position.set(x, y);
        this.zIndex = 999;
        this.visible = false;

        this.watchStoreChanges();

        this.on('pointerdown', this.onMouseDown);
        this.on('globalpointermove', this.onMouseMove);
        this.on('globalpointerup', this.onMouseUp);

        this.on('pointerup', this.onMouseUp);
        this.on('pointerupoutside', this.onMouseUp);

        this.on('pointerover', this.onMouseOver);
        this.on('pointerout', this.onPointerOut);
    }

    public getId() {
        return this.id;
    }

    private watchStoreChanges() {
        useStore.subscribe(() => {
            this.checkVisibility();
            this.checkEventMode();
        });
    }

    private checkVisibility() {
        const focusedElement = useStore.getState().focusedElement;

        if (!focusedElement) return this.hide();
        if (focusedElement instanceof BuildingElement) return this.hide();

        if (focusedElement instanceof Wall) {
            if (focusedElement.leftNode === this) return;
            if (focusedElement.rightNode === this) return;
            this.hide();

            return;
        }

        this.show();
    }

    private checkEventMode() {
        switch (useStore.getState().activeTool) {
            case Tool.WallAdd:
                this.visible = true;
                break;
            default:
                break;
        }
        // switch (useStore.getState().activeTool) {
        //     case Tool.Edit:
        //         this.eventMode = 'static';
        //         break;
        //     default:
        //         this.eventMode = 'none';
        //         break;
        // }
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    public setVisibility(visible: boolean) {
        if (this.isMouseOver) return (this.visible = true);
        this.visible = visible;
    }

    public setStyles({ color = 0x222222 }: { color?: string | number }) {
        this.dot.clear();
        this.dot.circle(0, 0, this.size / 2);
        this.dot.fill(this.dragging ? '#1C7ED6' : color);

        this.addChild(this.dot);
    }

    private onMouseOver() {
        this.isMouseOver = true;
        if (!this.isEditMode()) return;

        switch (useStore.getState().activeTool) {
            case Tool.WallAdd:
                break;

            default:
                this.setStyles({ color: '#1C7ED6' });
                break;
        }
    }

    private onPointerOut() {
        this.isMouseOver = false;

        this.setStyles({});
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        // if (!this.isEditMode()) return;

        switch (useStore.getState().activeTool) {
            case Tool.Edit:
                this.dragging = true;
                this.mouseStartPoint.x = ev.global.x;
                this.mouseStartPoint.y = ev.global.y;
                break;
            case Tool.Remove:
                this.delete();
                break;
            case Tool.WallAdd:
                AddWallManager.Instance.step(this);
                break;
        }
    }

    private getConnectedWalls() {
        return this.parent.children.filter((child) => {
            if (!isWall(child)) return;

            return child.leftNode === this || child.rightNode === this;
        }) as Wall[];
    }

    private calcWallLength(wall: Wall): number {
        const dx = wall.rightNode.x - wall.leftNode.x;
        const dy = wall.rightNode.y - wall.leftNode.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public redrawConnectedWalls() {
        this.getConnectedWalls().forEach((wall) => {
            wall.drawWall();
        });
    }

    private onMouseMove(ev: FederatedPointerEvent) {
        if (!this.dragging) {
            return;
        }

        this.prevPosition = { x: this.x, y: this.y };

        const shouldSnap = useStore.getState().snap;

        const currentPoint = ev.global;

        let x = currentPoint.x / main.scale.x + main.corner.x;
        let y = currentPoint.y / main.scale.y + main.corner.y;

        if (shouldSnap) {
            x = snap(x);
            y = snap(y);
        }

        // Temporarily set position to check validity
        this.x = x;
        this.y = y;

        const connectedWalls = this.getConnectedWalls();

        // Check length using current node positions (not cached wall.length)
        const invalidLengthWall = connectedWalls.find(
            (wall) => this.calcWallLength(wall) < MIN_WALL_LENGTH
        );

        if (invalidLengthWall) {
            this.x = this.prevPosition.x;
            this.y = this.prevPosition.y;
            showMinLengthError();
            return;
        }

        // Redraw walls to update their geometry before checking collisions
        FloorPlan.Instance.redrawWalls();

        // Check collisions after redraw (needs updated wall.length)
        const collidingWall = connectedWalls.find((wall) => wall.isColliding());

        if (collidingWall) {
            // Revert position and redraw again
            this.x = this.prevPosition.x;
            this.y = this.prevPosition.y;
            FloorPlan.Instance.redrawWalls();
            showCollisionError();
            return;
        }
    }

    public setToPrevPosition() {
        this.x = this.prevPosition.x;
        this.y = this.prevPosition.y;
    }

    public setPosition(x: number, y: number, redrawWalls = true) {
        this.prevPosition = { x: this.x, y: this.y };

        this.x = x;
        this.y = y;
        if (redrawWalls) FloorPlan.Instance.redrawWalls();
    }

    private onMouseUp() {
        this.dragging = false;

        useStore.getState().refreshFocusedElement();
    }

    private isEditMode() {
        return useStore.getState().activeMode === ViewMode.Edit;
    }

    public delete() {
        const action = new DeleteWallNodeAction(this.id);

        action.execute();
    }

    public serialize() {
        let res: INodeSerializable;

        res = {
            id: this.id,
            x: this.x,
            y: this.y,
        };

        return res;
    }
}
