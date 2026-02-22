import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { viewportX, viewportY } from '../../helpers/ViewportCoordinates';
import { useStore } from '../../stores/EditorStore';

export class Pointer extends Container {
    private dot: Graphics;
    private hand: Graphics;

    constructor() {
        super();

        this.eventMode = 'none';

        this.dot = new Graphics().circle(0, 0, 0).fill(0xf);
        this.addChild(this.dot);

        this.hand = new Graphics();
        this.hand.circle(0, 0, 4).fill(0xaabbcc);
        this.addChild(this.hand);
    }

    public update(ev: FederatedPointerEvent) {
        let worldX = viewportX(ev.global.x);
        let worldY = viewportY(ev.global.y);

        if (useStore.getState().snap) {
            const zoom = useStore.getState().zoom;
            let snapFactor = 10;

            if (zoom >= 2) {
                snapFactor = 10;
            } else if (zoom >= 1) {
                snapFactor = 20;
            } else if (zoom >= 0.5) {
                snapFactor = 50;
            } else {
                snapFactor = 100;
            }

            worldX = Math.trunc(worldX - (worldX % snapFactor));
            worldY = Math.trunc(worldY - (worldY % snapFactor));
        }

        this.position.set(worldX, worldY);
    }
}
