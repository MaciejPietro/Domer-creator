import { IDoorSerializable } from '../objects/Furnitures/Door/IDoorSerializable';
import { IWindowSerializable } from '../objects/Furnitures/Window/IWindowSerializable';
import { INodeSerializable } from './INodeSerializable';

export type IFurnitureSerializable = IDoorSerializable | IWindowSerializable;

export class FloorSerializable {
    public furnitureArray: IFurnitureSerializable[];
    public wallNodes: INodeSerializable[];
    public wallNodeLinks: [
        number,
        Array<{
            id: number;
            wallUuid: string;
        }>,
    ][];

    public constructor() {
        this.furnitureArray = [];
        this.wallNodes = [];
        this.wallNodeLinks = [];
    }
}
