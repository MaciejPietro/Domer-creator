import { FloorPlan } from '../objects/FloorPlan';
import { Action } from './Action';

// Action for removing furniture piece from FloorPlan.
export class DeleteFurnitureAction implements Action {
    private uuid: string;
    private receiver: FloorPlan;

    constructor(uuid: string) {
        this.uuid = uuid;
        this.receiver = FloorPlan.Instance;
    }

    public execute() {
        this.receiver.actions.push(this);
        this.receiver.removeFurniture(this.uuid);
    }
}
