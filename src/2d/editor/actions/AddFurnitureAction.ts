import { Container } from 'pixi.js';
import { Point } from '@/common/types/point';
import { FurnitureData } from '../../../stores/FurnitureStore';
import { FloorPlan } from '../objects/FloorPlan';
import { Wall } from '../objects/Walls/Wall';
import { Action } from './Action';
import { Door } from '../objects/Furnitures/Door/Door';
import { WindowElement } from '../objects/Furnitures/Window/Window';

export class AddFurnitureAction implements Action {
    object: Door | WindowElement;
    attachedTo: Wall;
    position: Point;

    private receiver: FloorPlan;

    constructor(object: Door | WindowElement, attachedTo: Wall, position: Point) {
        this.object = object;
        this.attachedTo = attachedTo;
        this.position = position;

        this.receiver = FloorPlan.Instance;
    }

    public execute() {
        this.receiver.addFurniture(this.object, this.attachedTo, this.position);
        this.receiver.actions.push(this);
    }
}
