import { Container, Graphics } from 'pixi.js';

const CM_GRID_ALPHA = 0.25;
const M_GRID_ALPHA = 0.75;
const CM_GRID_SIZE = 10;
const M_GRID_SIZE = 100;
const CM_GRID_COLOR = 0x222222;
const M_GRID_COLOR = 0x111111;

export class Grid extends Container {
    private cmGrid: Graphics;
    private mGrid: Graphics;

    constructor(worldWidth: number, worldHeight: number) {
        super();

        this.cmGrid = new Graphics();
        this.mGrid = new Graphics();

        this.addChild(this.cmGrid);
        this.addChild(this.mGrid);

        this.drawGrid(this.cmGrid, worldWidth, worldHeight, CM_GRID_SIZE, 0.2, CM_GRID_COLOR, CM_GRID_ALPHA);
        this.drawGrid(this.mGrid, worldWidth, worldHeight, M_GRID_SIZE, 1, M_GRID_COLOR, M_GRID_ALPHA);
    }

    private drawGrid(g: Graphics, w: number, h: number, step: number, strokeWidth: number, color: number, alpha: number) {
        for (let x = 0; x <= w; x += step) {
            g.moveTo(x, 0);
            g.lineTo(x, h);
            g.stroke({ width: strokeWidth, color, alpha });
        }
        for (let y = 0; y <= h; y += step) {
            g.moveTo(0, y);
            g.lineTo(w, y);
            g.stroke({ width: strokeWidth, color, alpha });
        }
    }

    public hideCm() {
        this.cmGrid.visible = false;
    }

    public showCm() {
        this.cmGrid.visible = true;
    }
}
