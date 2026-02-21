import { PlotPlan } from '../objects/Plan/PlotPlan';
import { PlotNodeId } from '../objects/Plot/types';
import { Action } from './Action';

export class DeletePlotNodeAction implements Action {
    private id: PlotNodeId;
    private receiver: PlotPlan;

    constructor(id: PlotNodeId) {
        this.id = id;
        this.receiver = PlotPlan.Instance;
    }

    public execute(): void {
        this.receiver.actions.push(this);
        this.receiver.removePlotNode(this.id);
    }
}
