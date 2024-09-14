import { Graphics, FederatedPointerEvent, Point, Texture } from 'pixi.js';
import { WALL_NODE_THICKNESS, Tool, ViewMode, WALL_THICKNESS } from '../../constants';
import { useStore } from '../../../../stores/EditorStore';
import { AddWallManager } from '../../actions/AddWallManager';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { INodeSerializable } from '../../persistence/INodeSerializable';
import { FloorPlan } from '../FloorPlan';
import { viewportX, viewportY } from '../../../../helpers/ViewportCoordinates';
import { isMobile } from 'react-device-detect';

export class WallNode extends Graphics {
    private dragging: boolean;
    private id: number;

    constructor(x: number, y: number, nodeId: number) {
        super();
        this.eventMode = 'static';
        this.id = nodeId;

        //  this.drawCircle(0,0,WALL_NODE_THICKNESS / 2)
        // if (isMobile) {
        //     this.setStyles(WALL_NODE_THICKNESS * 2);
        // } else {
        this.setStyles({});
        // }

        this.position.set(x, y);
        this.zIndex = 999;
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

    public setStyles({ size = WALL_NODE_THICKNESS, color = 0x222222 }: { size?: number; color?: string | number }) {
        this.clear();
        this.circle(0, 0, size / 2);
        this.fill(color);

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
            this.setStyles({ color: '#7f7fff' });
        }
    }

    private onPointerOut() {
        this.setStyles({});
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        if (!this.isEditMode()) return;

        switch (useStore.getState().activeTool) {
            case Tool.Edit:
                this.dragging = true;
                break;
            case Tool.Remove:
                // this.delete();
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
