import { FloorPlan } from '../objects/FloorPlan';
import { Action } from './Action';

export class SaveInProjectAction implements Action {
    private receiver: FloorPlan;
    constructor() {
        this.receiver = FloorPlan.Instance;
    }

    public execute() {
        const data = this.receiver.save();
        const jsonData = JSON.stringify(data);

        console.log('Sending message to parent:', {
            type: 'SAVE_FLOOR_PLAN',
            payload: jsonData,
        });

        window.parent.postMessage(
            {
                type: 'SAVE_FLOOR_PLAN',
                payload: jsonData,
            },
            // 'http://localhost:5173'
            '*'
        );
    }
}
