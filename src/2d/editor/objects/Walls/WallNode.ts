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

export class WallNode extends Container {
    public dragging: boolean;
    private id: number;
    private dot = new Graphics();
    mouseStartPoint: Point;

    private size = 10;
    public prevPosition = { x: 0, y: 0 };
    private startDragPosition = { x: 0, y: 0 };
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
            case Tool.Remove:
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
            case Tool.Remove:
                this.setStyles({ color: '#FF0000' });
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
        this.startDragPosition = { x: this.x, y: this.y };

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

    private checkIfCanDragFurther() {
        const parentWalls = this.parent.children.filter((child) => child instanceof Wall);

        if (parentWalls.length) {
            parentWalls.forEach((wall) => {
                if (!wall.isValidLength()) {
                    showMinLengthError();
                    this.setToStartDragPosition();
                }

                if (wall.isColliding()) {
                    showCollisionError();
                    this.setToStartDragPosition();
                }

                const connectedWalls = this.getConnectedWalls(wall);

                if (connectedWalls.length === 0) return;
            });
        }
    }

    private getConnectedWalls(currentWall: Wall): Wall[] {
        return this.parent.children.filter((child) => {
            if (!isWall(child)) return;
            if (child === currentWall) return;

            return (
                child.leftNode === currentWall.leftNode ||
                child.leftNode === currentWall.rightNode ||
                child.rightNode === currentWall.leftNode ||
                child.rightNode === currentWall.rightNode
            );
        }) as Wall[];
    }

    private calculateAngleBetweenWalls(wall1: Wall, wall2: Wall): number | undefined {
        const angle1 = wall1.angle;
        const angle2 = wall2.angle;
        const angleDifference = Math.abs(angle1 - angle2);

        if (wall1.rightNode === wall2.rightNode) {
            return angleDifference;
        }

        if (wall1.leftNode === wall2.rightNode) {
            return Math.abs(180 - angleDifference);
        }

        if (wall1.rightNode === wall2.leftNode) {
            return Math.abs(180 - angleDifference);
        }

        if (wall1.leftNode === wall2.leftNode) {
            return angleDifference;
        }
    }

    private onMouseMove(ev: FederatedPointerEvent) {
        this.checkIfCanDragFurther();

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

        this.x = x;
        this.y = y;

        // TODO make this redraw only the walls that are affected
        FloorPlan.Instance.redrawWalls();
    }

    private setToStartDragPosition() {
        this.dragging = false;

        setTimeout(() => {
            this.x = this.startDragPosition.x;
            this.y = this.startDragPosition.y;
            FloorPlan.Instance.redrawWalls();
        }, 500);
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
        // TODO #1
        // const action = new DeleteWallNodeAction(this.id);
        // action.execute();
        // this.parent.removeChild(this);
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
