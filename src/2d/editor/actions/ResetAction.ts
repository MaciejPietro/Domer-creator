import { FloorPlan } from '../objects/Plan/FloorPlan';
import { Action } from './Action';

export class ResetAction implements Action {
    private receiver: FloorPlan;
    constructor() {
        this.receiver = FloorPlan.Instance;
    }

    public execute() {
        this.receiver.restart();
    }
}
