import { Container } from 'pixi.js';
import { Point } from '../../../helpers/Point';
import { FurnitureData } from '../../../stores/FurnitureStore';
import { FloorPlan } from '../objects/FloorPlan';
import { Wall } from '../objects/Walls/Wall';
import { Action } from './Action';

export class AddFurnitureObjectAction implements Action {
    object: Container;
    attachedTo: Wall;

    private receiver: FloorPlan;

    constructor(object: Container, attachedTo: Wall) {
        this.object = object;
        this.attachedTo = attachedTo;

        this.receiver = FloorPlan.Instance;
    }

    public execute() {
        this.receiver.addFurnitureObject(this.object, this.attachedTo);
        this.receiver.actions.push(this);
    }
}
