import { Door } from '../editor/objects/Furnitures/Door/Door';
import { WindowElement } from '../editor/objects/Furnitures/Window/Window';

export const isDoor = (child: any): child is Door => child instanceof Door;
export const isWindow = (child: any): child is WindowElement => child instanceof WindowElement;
