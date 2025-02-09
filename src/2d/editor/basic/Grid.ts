import { Container, Graphics } from 'pixi.js';

const GRID_ALPHA = 0.25;
const GRID_ALPHA_M = 0.75;
const GRID_SIZE = 10;
const GRID_SIZE_M = 100;
const GRID_COLOR = 0x222222;
export class Grid extends Container {
    private gridGraphics: Graphics;
    private cmGrid: Graphics;
    private mGrid: Graphics;
    private worldWidth: number;
    private worldHeight: number;

    private mAlpha = GRID_ALPHA_M;
    private cmAlpha = GRID_ALPHA;

    constructor(worldWidth: number, worldHeight: number) {
        super();
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.cmGrid = new Graphics();
        this.mGrid = new Graphics();

        this.addChild(this.cmGrid);
        this.addChild(this.mGrid);

        this.drawCmGrid();
        this.drawMGrid();
    }

    private drawCmGrid() {
        // Draw centimeter grid
        for (let x = 0; x <= this.worldWidth; x += GRID_SIZE) {
            this.cmGrid.moveTo(x, 0);
            this.cmGrid.lineTo(x, this.worldHeight);
            this.cmGrid.stroke({ width: 0.5, color: GRID_COLOR, alpha: GRID_ALPHA });
        }

        for (let y = 0; y <= this.worldHeight; y += GRID_SIZE) {
            this.cmGrid.moveTo(0, y);
            this.cmGrid.lineTo(this.worldWidth, y);
            this.cmGrid.stroke({ width: 0.5, color: GRID_COLOR, alpha: GRID_ALPHA });
        }
    }

    private drawMGrid(isBold = false) {
        this.mGrid.clear();

        // Draw meter grid
        for (let x = 0; x <= this.worldWidth; x += GRID_SIZE_M) {
            this.mGrid.moveTo(x, 0);
            this.mGrid.lineTo(x, this.worldHeight);
            this.mGrid.stroke({ width: isBold ? 2 : 0.6, color: GRID_COLOR, alpha: GRID_ALPHA_M });
        }

        for (let y = 0; y <= this.worldHeight; y += GRID_SIZE_M) {
            this.mGrid.moveTo(0, y);
            this.mGrid.lineTo(this.worldWidth, y);
            this.mGrid.stroke({ width: isBold ? 1.5 : 0.6, color: GRID_COLOR, alpha: GRID_ALPHA_M });
        }
    }

    public hideCm() {
        this.cmGrid.alpha = 0;
        this.mGrid.alpha = 1;
        this.drawMGrid(true);
    }

    public showCm() {
        this.cmGrid.alpha = 1;
        this.drawMGrid(false);
    }

    public update(worldWidth: number, worldHeight: number) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.cmGrid.clear();
        this.mGrid.clear();

        this.drawCmGrid();
        this.drawMGrid();
    }
}
