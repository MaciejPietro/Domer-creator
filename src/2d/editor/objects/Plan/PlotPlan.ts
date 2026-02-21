import { Container } from 'pixi.js';
import { Plot, PlotSerializable } from '../Plot/Plot';
import { PlotEdgeId, PlotNodeId } from '../Plot/types';
import { Action } from '../../actions/Action';
import { PlotPlanSerializable } from '../../persistence/PlotPlanSerializable';
import { Serializer } from '../../persistence/Serializer';

export class PlotPlan extends Container {
    private static instance: PlotPlan;

    private plot: Plot;
    private serializer: Serializer;
    public actions: Action[];

    private constructor() {
        super();
        this.plot = new Plot();
        this.actions = [];
        this.serializer = new Serializer();
        this.addChild(this.plot);
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    public getPlot() {
        return this.plot;
    }

    public removePlotNode(id: PlotNodeId) {
        this.plot.removeNode(id);
    }

    public removePlotEdge(id: PlotEdgeId) {
        this.plot.removeEdge(id);
    }

    public save(): PlotPlanSerializable {
        return this.serializer.serializePlot(this.plot);
    }

    public load(data: PlotPlanSerializable) {
        this.plot.load(data.plot);
    }

    public restart() {
        this.reset();
        this.actions = [];
        this.plot = new Plot();
        this.addChild(this.plot);
    }

    private reset() {
        this.plot.reset();
    }
}
