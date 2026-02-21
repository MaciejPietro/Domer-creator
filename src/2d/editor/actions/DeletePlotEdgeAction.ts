import { PlotPlan } from '../objects/Plan/PlotPlan';
import { PlotEdgeId, PlotNodeId } from '../objects/Plot/types';
import { Action } from './Action';

export class DeletePlotEdgeAction implements Action {
    private id: PlotEdgeId;
    private receiver: PlotPlan;

    constructor(edge: PlotEdgeId) {
        this.id = edge;
        this.receiver = PlotPlan.Instance;
    }

    public execute(): void {
        this.receiver.actions.push(this);
        this.receiver.removePlotEdge(this.id);
    }
}
