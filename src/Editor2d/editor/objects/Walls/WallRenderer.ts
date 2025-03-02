import { Graphics } from 'pixi.js';
import { WALL_ACTIVE_STROKE_COLOR, WALL_STROKE_COLOR } from './constants';
import { Wall } from './Wall';

// New class to handle wall rendering
export class WallRenderer {
    private wall: Wall;
    private graphic: Graphics;

    constructor(wall: Wall) {
        this.wall = wall;
        this.graphic = new Graphics();
    }

    public updateCorners() {
        const { pointA, pointB, pointC, pointD, thickness, length, focused } = this.wall;
        const strokeColor = focused ? WALL_ACTIVE_STROKE_COLOR : WALL_STROKE_COLOR;
        const middleEndPoint = { x: length, y: thickness / 2 };
        const middleStartPoint = { x: 0, y: thickness / 2 };

        this.graphic.clear();
        this.graphic
            .poly([
                pointA.x,
                pointA.y,
                pointB.x,
                pointB.y,
                middleEndPoint.x,
                middleEndPoint.y,
                pointC.x,
                pointC.y,
                pointD.x,
                pointD.y,
                middleStartPoint.x,
                middleStartPoint.y,
            ])
            .fill({ color: this.wall.color })
            .stroke({ width: 1, color: strokeColor });
    }

    // Other rendering methods...
}
