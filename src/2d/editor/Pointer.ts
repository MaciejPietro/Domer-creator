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
            worldX = Math.trunc(worldX - (worldX % 10));
            worldY = Math.trunc(worldY - (worldY % 10));
        }

        this.position.set(worldX, worldY);
    }
}
