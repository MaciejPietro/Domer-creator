import saveAs from 'file-saver';
import { FloorPlan } from '../objects/Plan/FloorPlan';
import { PlotPlan } from '../objects/Plan/PlotPlan';
import { Action } from './Action';

export class SaveAction implements Action {
    private receiver: FloorPlan;
    constructor() {
        this.receiver = FloorPlan.Instance;
    }

    public execute() {
        const floorData = this.receiver.save();
        const plotData = PlotPlan.Instance.save();

        const data = {
            ...floorData,
            plot: plotData.plot,
        };

        const jsonData = JSON.stringify(data, null, 2);

        const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
        saveAs(blob, 'floor_plan.json');
    }
}
