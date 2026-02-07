import { Point } from '../../../helpers/Point';
import { FloorPlan } from '../objects/Plan/FloorPlan';
import { AddPlotManager } from './AddPlotManager';

export class AddPlotNodeAction {
    private coords: Point;

    constructor(coords: Point) {
        this.coords = coords;
    }

    public execute() {
        const manager = AddPlotManager.Instance;

        if (!manager.checkStep(this.coords)) {
            return;
        }

        const plot = FloorPlan.Instance.getPlot();
        if (!plot) return;

        const newNode = plot.addNode(this.coords.x, this.coords.y);

        if (newNode) {
            manager.step(newNode);
        }
    }
}
