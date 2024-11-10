import { DoorOrientation, DoorType } from './config';

export interface IDoorSerializable {
    uuid: string;
    wallUuid: string;
    x: number;
    y: number;
    length: number;
    orientation: DoorOrientation;
    type: DoorType;
    element: 'door';
}
