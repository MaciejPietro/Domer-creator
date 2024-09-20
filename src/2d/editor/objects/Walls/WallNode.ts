import { Graphics, FederatedPointerEvent, Point, Texture } from 'pixi.js';
import { WALL_NODE_THICKNESS, Tool, ViewMode, WALL_THICKNESS } from '../../constants';
import { useStore } from '../../../../stores/EditorStore';
import { AddWallManager } from '../../actions/AddWallManager';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { INodeSerializable } from '../../persistence/INodeSerializable';
import { FloorPlan } from '../FloorPlan';
import { viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';
import { isMobile } from 'react-device-detect';
import { WallType, wallTypeConfig } from './config';
import { DEFAULT_WALL_TYPE, Wall } from './Wall';

export class WallNode extends Graphics {
    private dragging: boolean;
    private id: number;

    private type: WallType = WallType.Partition;
    private size = 20;

    constructor(x: number, y: number, nodeId: number) {
        super();
        this.eventMode = 'static';
        this.id = nodeId;

        this.setSettings();

        this.setStyles({});

        this.position.set(x, y);
        this.zIndex = 999;
        this.visible = false;

        this.watchStoreChanges();

        this.on('pointerdown', this.onMouseDown);
        this.on('globalpointermove', this.onMouseMove);
        this.on('pointerup', this.onMouseUp);
        this.on('pointerupoutside', this.onMouseUp);

        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
    }

    public getId() {
        return this.id;
    }

    private watchStoreChanges() {
        useStore.subscribe(() => {
            this.checkVisibility();
        });
    }

    private checkVisibility() {
        const focusedElement = useStore.getState().focusedElement;

        if (!focusedElement) return this.hide();

        if (focusedElement instanceof Wall) {
            if (focusedElement.leftNode === this) return;
            if (focusedElement.rightNode === this) return;
            this.hide();

            return;
        }

        this.show();
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    private setSettings() {
        const state = useStore.getState();

        const activeToolSettings = state.activeToolSettings;

        this.type = activeToolSettings?.wallType || DEFAULT_WALL_TYPE;

        // const wallThickness = wallTypeConfig[this.type].thickness;
        // this.size = Math.max(8, wallThickness / 3);
        this.size = 10;
    }

    public setStyles({ color = 0x222222 }: { color?: string | number }) {
        this.clear();
        this.circle(0, 0, this.size / 2);
        this.fill(this.dragging ? '#1C7ED6' : color);

        // SQUARE IN PLACE OF WALL DOT
        // const background = new Graphics();
        // background.rect(-WALL_THICKNESS / 2, -WALL_THICKNESS / 2, WALL_THICKNESS, WALL_THICKNESS);
        // background.fill('white');
        // background.stroke({ texture: Texture.WHITE, width: 2, color: 'black' });
        // background.zIndex = -1;
        // this.addChildAt(background, 0);
    }

    private onPointerOver() {
        if (this.isEditMode()) {
            this.setStyles({ color: '#1C7ED6' });
        }
    }

    private onPointerOut() {
        this.setStyles({});
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        // if (!this.isEditMode()) return;

        switch (useStore.getState().activeTool) {
            case Tool.Edit:
                this.dragging = true;
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

        const currentPoint = { x: ev.global.x, y: ev.global.y };

        this.x = viewportX(currentPoint.x);
        this.y = viewportY(currentPoint.y);

        FloorPlan.Instance.redrawWalls();
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        FloorPlan.Instance.redrawWalls();
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
