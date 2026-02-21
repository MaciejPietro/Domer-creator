import { PlotSerializable } from '../objects/Plot/Plot';

export class PlotPlanSerializable {
    plot: PlotSerializable;

    constructor() {
        this.plot = { nodes: [], edges: [] };
    }
}
