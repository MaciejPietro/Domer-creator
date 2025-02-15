import { FederatedPointerEvent } from 'pixi.js';

export class ObjectEvents {
    private clickStartTime = 0;
    private readonly clickThreshold = 200; // ms

    onPointerDown() {
        this.clickStartTime = Date.now();
    }

    isClick(): boolean {
        const clickDuration = Date.now() - this.clickStartTime;
        return clickDuration < this.clickThreshold;
    }
}
