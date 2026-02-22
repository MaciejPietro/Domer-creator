import { FederatedPointerEvent } from 'pixi.js';
import { euclideanDistance } from '../../../helpers/EuclideanDistance';
import { Point } from '../../../helpers/Point';
import { PlotPlan } from '../objects/Plan/PlotPlan';
import { PlotNode } from '../objects/Plot/PlotNode';
import { Preview } from './MeasureToolManager';
import { PLOT_EDGE_COLOR } from '../objects/Plot/constants';
import { METER } from '@/2d/constants/mathConstants';

export class AddPlotManager {
    private static instance: AddPlotManager;

    public previousNode: PlotNode | undefined;
    public preview: Preview;

    private constructor() {
        this.previousNode = undefined;
        this.preview = new Preview({ color: PLOT_EDGE_COLOR });
    }

    public checkStep(coords: Point) {
        const plot = PlotPlan.Instance.getPlot();
        if (!plot) return true;

        if (this.previousNode == undefined) {
            for (const [id, node] of plot.getNodes()) {
                if (euclideanDistance(coords.x, node.x, coords.y, node.y) < 0.3 * METER) {
                    return false;
                }
            }

            return true;
        }

        if (euclideanDistance(coords.x, this.previousNode.x, coords.y, this.previousNode.y) < 0.3 * METER) {
            return false;
        }

        return true;
    }

    public step(node: PlotNode) {
        // First click - set first node
        if (this.previousNode === undefined) {
            this.previousNode = node;
            this.preview.setA(this.previousNode.position);

            return;
        }

        // Add edge between previous node and current node
        const plot = PlotPlan.Instance.getPlot();
        if (plot) {
            plot.addEdge(this.previousNode.getId(), node.getId());
        }

        this.preview.setA(node.position);
        this.previousNode = node;
    }

    public updatePreview(ev: FederatedPointerEvent) {
        this.preview.updatePreview(ev);
    }

    public unset() {
        this.previousNode = undefined;
        this.preview.setA(undefined);
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    public resetTools() {
        this.unset();
    }
}
