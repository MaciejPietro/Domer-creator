import { FloorPlan } from '../objects/Plan/FloorPlan';
import { PlotPlan } from '../objects/Plan/PlotPlan';
import { PlotPlanSerializable } from '../persistence/PlotPlanSerializable';
import { Action } from './Action';

export class LoadAction implements Action {
    private receiver: FloorPlan;
    private loadData: string;

    constructor(loadData: string) {
        this.receiver = FloorPlan.Instance;
        this.loadData = loadData;
    }

    public execute() {
        this.receiver.load(this.loadData);

        const parsed = JSON.parse(this.loadData);
        if (parsed.plot) {
            const plotPlanData = new PlotPlanSerializable();
            plotPlanData.plot = parsed.plot;
            PlotPlan.Instance.load(plotPlanData);
        }
    }
}
