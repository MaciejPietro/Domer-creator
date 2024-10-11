import { Container, Graphics } from 'pixi.js';

export class Grid extends Container {
    private gridGraphics: Graphics;
    private worldWidth: number;
    private worldHeight: number;

    constructor(worldWidth: number, worldHeight: number) {
        super();
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.gridGraphics = new Graphics();
        this.addChild(this.gridGraphics);
        this.drawGrid();
    }

    private drawGrid() {
        const GRID_SIZE = 10;
        const GRID_SIZE_M = 100;
        const GRID_COLOR = 0x222222;
        const GRID_ALPHA = 0.25;
        const GRID_ALPHA_M = 0.75;

        // Draw centimeter grid
        for (let x = 0; x <= this.worldWidth; x += GRID_SIZE) {
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, this.worldHeight);
            this.gridGraphics.stroke({ width: 0.5, color: GRID_COLOR, alpha: GRID_ALPHA });
        }

        for (let y = 0; y <= this.worldHeight; y += GRID_SIZE) {
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(this.worldWidth, y);
            this.gridGraphics.stroke({ width: 0.5, color: GRID_COLOR, alpha: GRID_ALPHA });
        }

        // Draw meter grid
        for (let x = 0; x <= this.worldWidth; x += GRID_SIZE_M) {
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, this.worldHeight);
            this.gridGraphics.stroke({ width: 0.5, color: GRID_COLOR, alpha: GRID_ALPHA_M });
        }

        for (let y = 0; y <= this.worldHeight; y += GRID_SIZE_M) {
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(this.worldWidth, y);
            this.gridGraphics.stroke({ width: 0.5, color: GRID_COLOR, alpha: GRID_ALPHA_M });
        }
    }

    public update(worldWidth: number, worldHeight: number) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.gridGraphics.clear();
        this.drawGrid();
    }
}
