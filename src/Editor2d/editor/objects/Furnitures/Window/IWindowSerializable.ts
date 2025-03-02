import { WindowType } from './config';

export interface IWindowSerializable {
    uuid: string;
    wallUuid: string;
    x: number;
    y: number;
    length: number;
    bottom: number;
    height: number;
    type: WindowType;
    element: 'window';
}
