import { Graphics, FederatedPointerEvent, Texture, Container } from 'pixi.js';
import { WALL_NODE_THICKNESS, Tool, ViewMode, WALL_THICKNESS } from '../../constants';
import { useStore } from '../../../../stores/EditorStore';
import { AddWallManager } from '../../actions/AddWallManager';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { INodeSerializable } from '../../persistence/INodeSerializable';
import { FloorPlan } from '../FloorPlan';
import { snap, viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';
import { isMobile } from 'react-device-detect';
import { WallType, wallTypeConfig } from './config';
import { DEFAULT_WALL_TYPE, Wall } from './Wall';
import { main } from '@/2d/EditorRoot';
import { Point } from '@/helpers/Point';
import { Building } from 'tabler-icons-react';
import { BuildingElement } from '../Furnitures/BuildingElement';

export class WallNode extends Container {
    public dragging: boolean;
    private id: number;
    private dot = new Graphics();
    mouseStartPoint: Point;

    private type: WallType = WallType.Partition;
    private size = 20;
    public prevPosition = { x: 0, y: 0 };
    private isMouseOver = false;

    constructor(x: number, y: number, nodeId: number) {
        super();
        this.eventMode = 'none';
        this.id = nodeId;

        this.setSettings();

        this.setStyles({});

        this.mouseStartPoint = { x: 0, y: 0 };

        this.prevPosition = { x, y };
        this.position.set(x, y);
        this.zIndex = 999;
        this.dot.visible = false;

        this.watchStoreChanges();

        this.on('pointerdown', this.onMouseDown);
        this.on('globalpointermove', this.onMouseMove);
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
            case Tool.Edit:
                this.eventMode = 'static';
                break;

            default:
                this.eventMode = 'none';

                break;
        }
    }

    public show() {
        this.dot.visible = true;
    }

    public hide() {
        this.dot.visible = false;
    }

    private setSettings() {
        const state = useStore.getState();

        const activeToolSettings = state.activeToolSettings;

        this.type = activeToolSettings?.wallType || DEFAULT_WALL_TYPE;

        // const wallThickness = wallTypeConfig[this.type].thickness;
        // this.size = Math.max(8, wallThickness / 3);
        this.size = 10;
    }

    public setVisibility(visible: boolean) {
        if (this.isMouseOver) return (this.dot.visible = true);
        this.dot.visible = visible;
    }

    public setStyles({ color = 0x222222 }: { color?: string | number }) {
        this.dot.clear();
        this.dot.circle(0, 0, this.size / 2);
        // bg-blue-500 from tailwind.config.js
        this.dot.fill(this.dragging ? '#1C7ED6' : color);

        this.addChild(this.dot);

        this.dot.zIndex = 1;

        // SQUARE IN PLACE OF WALL DOT
        // const background = new Graphics();
        // background.rect(-WALL_THICKNESS / 2 + 1, -WALL_THICKNESS / 2 + 2, WALL_THICKNESS - 1, WALL_THICKNESS - 2);
        // background.fill('white');
        // // background.stroke({ texture: Texture.WHITE, width: 1, color: 'black' });
        // background.zIndex = -1;
        // this.addChildAt(background, 0);
    }

    private onMouseOver() {
        this.isMouseOver = true;
        if (!this.isEditMode()) return;

        switch (useStore.getState().activeTool) {
            case Tool.WallAdd:
                break;

            default:
                // bg-blue-500 from tailwind.config.js
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

    private onMouseMove(ev: FederatedPointerEvent) {
        if (!this.dragging) {
            return;
        }
        const shouldSnap = useStore.getState().snap;

        this.prevPosition = { x: this.x, y: this.y };

        const currentPoint = ev.global;

        let x = currentPoint.x / main.scale.x + main.corner.x;
        let y = currentPoint.y / main.scale.y + main.corner.y;

        if (shouldSnap) {
            x = snap(x);
            y = snap(y);
        }

        this.x = x;
        this.y = y;

        FloorPlan.Instance.redrawWalls();
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
