import { Container } from 'pixi.js';
import { Tool } from '../../constants';
import { WindowElement } from '../Furnitures/Window/Window';
import { Door } from '../Furnitures/Door/Door';
import { Wall } from './Wall';
import { Point } from '@/Common/types/point';
import { WALL_TEMP_FURNITURE_Z_INDEX } from './constants';
import { AddFurnitureAction } from '../../actions/AddFurnitureAction';
import { notifications } from '@mantine/notifications';

class WallTempFurniture extends Container {
    element: Door | WindowElement | null = null;
    parentWall: Wall;
    className = 'WallTempFurniture';

    constructor(parent: Wall) {
        super();
        this.parentWall = parent;
    }

    create(activeTool: Tool, parent: Wall) {
        this.removeChildren();

        const Element = activeTool === Tool.FurnitureAddDoor ? Door : WindowElement;

        this.element = new Element({ parent });
        this.zIndex = WALL_TEMP_FURNITURE_Z_INDEX;
        this.element.setTemporality(true);
        this.addChild(this.element);

        return this;
    }

    public add() {
        if (!this.element) return;

        if (!this.element.isValid) {
            const isDoor = this.element instanceof Door;
            notifications.clean();
            const icon = isDoor ? '🚪' : '🪟';
            const message = isDoor
                ? 'Nie można dodać drzwi, które kolidują z innymi elementami'
                : 'Nie można dodać okna, które koliduje z innymi elementami';
            notifications.show({
                title: `${icon} Niewłaściwa pozycja`,
                message,
                color: 'red',
            });

            return;
        }

        const { x, y } = this.element.position;
        this.element.setTemporality(false);
        const action = new AddFurnitureAction(this.element, this.parentWall, { x, y });
        action.execute();
        this.removeChildren();
        this.hide();
    }

    public show() {
        this.element?.show();

        return this;
    }

    public hide() {
        this.element?.hide();

        return this;
    }

    public updatePosition(localCoords: Point) {
        const furnitureHeight = this.element?.length || 0;

        const wallThickness = this.parentWall.thickness;

        const doorThickness = 12;

        const fixedCords = {
            x: localCoords.x - furnitureHeight / 2,
            y: 0 + wallThickness - doorThickness,
        };

        const newCords = this.getPossibleCords(fixedCords);

        this.element?.setPosition(newCords);
    }

    private getPossibleCords({ x, y }: Point) {
        const newCords = { x, y };

        const currentX = this.getXWithinWall(newCords.x);

        const isCoolide = this.element?.isCollide();

        this.element?.setValidity(!isCoolide);

        newCords.x = currentX;

        return newCords;
    }

    private getXWithinWall(elementX: number): number {
        const furnitureHeight = this.element?.length || 0;

        let currentX = elementX;

        const maxX = this.parentWall.length;

        const wallOffset = 0;

        const endX = elementX + furnitureHeight;
        const startX = elementX;

        const isWallEnd = endX > maxX - wallOffset;
        const isWallStart = startX < wallOffset;

        if (isWallEnd) {
            currentX = maxX - wallOffset - furnitureHeight;
        } else if (isWallStart) {
            currentX = wallOffset;
        }

        return currentX;
    }
}

export default WallTempFurniture;
