import { Graphics, FederatedPointerEvent } from 'pixi.js';
import { useStore } from '../../../../stores/EditorStore';
import { Tool, ViewMode } from '../../constants';
import { PlotNode } from './PlotNode';
import { PLOT_EDGE_COLOR, PLOT_EDGE_ACTIVE_COLOR, PLOT_EDGE_WIDTH } from './constants';

export class PlotEdge extends Graphics {
    public leftNode: PlotNode;
    public rightNode: PlotNode;
    private focused = false;

    constructor(leftNode: PlotNode, rightNode: PlotNode) {
        super();
        this.leftNode = leftNode;
        this.rightNode = rightNode;

        this.eventMode = 'static';
        this.zIndex = 10;

        this.draw();

        this.on('pointerover', this.onMouseOver);
        this.on('pointerout', this.onMouseOut);
        this.on('pointerdown', this.onMouseDown);
    }

    public draw() {
        const color = this.focused ? PLOT_EDGE_ACTIVE_COLOR : PLOT_EDGE_COLOR;

        this.clear();
        this.moveTo(this.leftNode.x, this.leftNode.y);
        this.lineTo(this.rightNode.x, this.rightNode.y);
        this.stroke({ width: PLOT_EDGE_WIDTH, color });
    }

    private onMouseOver() {
        if (useStore.getState().activeMode !== ViewMode.Edit) return;

        this.focused = true;
        this.draw();
    }

    private onMouseOut() {
        this.focused = false;
        this.draw();
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.Remove:
                this.delete();
                break;
            case Tool.Edit:
                // Could add node in middle of edge
                break;
        }
    }

    public delete() {
        const plot = this.parent as any;
        if (plot && plot.removeEdge) {
            plot.removeEdge(this.leftNode.getId(), this.rightNode.getId());
        }
    }

    public serialize() {
        return {
            leftNodeId: this.leftNode.getId(),
            rightNodeId: this.rightNode.getId(),
        };
    }
}
