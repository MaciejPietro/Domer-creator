import { Graphics, FederatedPointerEvent, Container } from 'pixi.js';
import { Tool, ViewMode } from '../../constants';
import { useStore } from '../../../../stores/EditorStore';
import { snap } from '../../../../helpers/ViewportCoordinates';
import { main } from '@/2d/EditorRoot';
import { Point } from '@/helpers/Point';
import { PLOT_NODE_COLOR, PLOT_NODE_ACTIVE_COLOR, PLOT_NODE_SIZE } from './constants';
import { AddPlotManager } from '../../actions/AddPlotManager';

export class PlotNode extends Container {
    public dragging: boolean = false;
    private id: number;
    private dot = new Graphics();
    mouseStartPoint: Point;

    public prevPosition = { x: 0, y: 0 };
    private isMouseOver = false;

    constructor(x: number, y: number, nodeId: number) {
        super();
        this.eventMode = 'static';
        this.id = nodeId;

        this.setStyles({});

        this.mouseStartPoint = { x: 0, y: 0 };

        this.prevPosition = { x, y };
        this.position.set(x, y);
        this.zIndex = 999;
        this.visible = true;

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
            this.checkEventMode();
        });
    }

    private checkEventMode() {
        switch (useStore.getState().activeTool) {
            case Tool.PlotAdd:
                this.visible = true;
                break;
            case Tool.Edit:
                this.visible = true;
                break;
            default:
                break;
        }
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    public setStyles({ color = PLOT_NODE_COLOR }: { color?: string | number }) {
        this.dot.clear();
        this.dot.circle(0, 0, PLOT_NODE_SIZE / 2);
        this.dot.fill(this.dragging ? PLOT_NODE_ACTIVE_COLOR : color);

        this.addChild(this.dot);
    }

    private onMouseOver() {
        this.isMouseOver = true;
        if (!this.isEditMode()) return;

        switch (useStore.getState().activeTool) {
            case Tool.PlotAdd:
                break;

            default:
                this.setStyles({ color: PLOT_NODE_ACTIVE_COLOR });
                break;
        }
    }

    private onPointerOut() {
        this.isMouseOver = false;
        this.setStyles({});
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        switch (useStore.getState().activeTool) {
            case Tool.Edit:
                this.dragging = true;
                this.mouseStartPoint.x = ev.global.x;
                this.mouseStartPoint.y = ev.global.y;
                break;
            case Tool.Remove:
                this.delete();
                break;
            case Tool.PlotAdd:
                AddPlotManager.Instance.step(this);
                break;
        }
    }

    public redrawConnectedEdges() {
        if (!this.parent) return;
        // The parent (Plot) will handle redrawing
        const plot = this.parent as any;
        if (plot.drawEdges) {
            plot.drawEdges();
        }
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

        this.x = x;
        this.y = y;

        this.redrawConnectedEdges();
    }

    public setToPrevPosition() {
        this.x = this.prevPosition.x;
        this.y = this.prevPosition.y;
    }

    public setPosition(x: number, y: number, redraw = true) {
        this.prevPosition = { x: this.x, y: this.y };

        this.x = x;
        this.y = y;
        if (redraw) this.redrawConnectedEdges();
    }

    private onMouseUp() {
        this.dragging = false;
    }

    private isEditMode() {
        return useStore.getState().activeMode === ViewMode.Edit;
    }

    public delete() {
        const plot = this.parent as any;
        if (plot && plot.removeNode) {
            plot.removeNode(this.id);
        }
    }

    public serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
        };
    }
}
