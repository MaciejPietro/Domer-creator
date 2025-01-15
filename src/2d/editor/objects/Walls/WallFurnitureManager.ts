import { Point } from 'pixi.js';
import { Door } from '../Furnitures/Door/Door';
import { WindowElement } from '../Furnitures/Window/Window';
import { Wall } from './Wall';

// New class to manage wall furniture
export class WallFurnitureManager {
    private wall: Wall;
    private tempFurniture: Door | WindowElement | null = null;

    constructor(wall: Wall) {
        this.wall = wall;
    }

    public updateFurniturePosition(localCoords: Point) {
        if (!this.tempFurniture) return;

        const furnitureHeight = this.tempFurniture.length;
        const wallThickness = this.wall.thickness;
        const doorThickness = 12;

        const fixedCords = {
            x: localCoords.x - furnitureHeight / 2,
            y: wallThickness - doorThickness,
        };

        const newCords = this.getPossibleCords(fixedCords);
        this.tempFurniture.setPosition(newCords);
    }

    // Other furniture-related methods...
}
