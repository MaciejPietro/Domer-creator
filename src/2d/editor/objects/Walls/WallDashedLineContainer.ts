import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { Point } from '../../../../helpers/Point';
import { useStore } from '@/stores/EditorStore';
import { snap } from '@/helpers/ViewportCoordinates';
import { WALL_DASHED_LINE_Z_INDEX } from './constants';

const VALID_COLOR = 'black';
const INVALID_COLOR = 'red';

export default class WallDashedLineContainer extends Container {
    baseLine: Graphics;

    constructor(private length: number) {
        super();

        this.eventMode = 'none';
        this.baseLine = new Graphics();

        this.rotation = Math.PI * 0.5;

        this.setStroke(VALID_COLOR);
        this.visible = false;
        this.zIndex = WALL_DASHED_LINE_Z_INDEX;
    }

    public setStroke(color: string) {
        this.baseLine = new Graphics();

        const num = Math.floor(this.length / 5.5);
        const cutWidth = 5;

        for (let i = 0; i < num; i++) {
            this.baseLine
                .moveTo(i * cutWidth, 0)
                .lineTo(i * cutWidth + cutWidth / 2, 0)
                .stroke({ width: 1, color });
        }

        this.addChild(this.baseLine);
    }

    public setPosition(position: Point) {
        const shouldSnap = useStore.getState().snap;

        let x = position.x,
            y = position.y;

        if (shouldSnap) {
            x = snap(position.x);
            y = snap(position.y);
        }
        this.position = { x, y: y + 3 };
    }

    public update({ isOccupied, localCoords }: { isOccupied: boolean; localCoords: Point }) {
        this.setStroke(isOccupied ? INVALID_COLOR : VALID_COLOR);
        this.setPosition({ x: localCoords.x, y: 0 });
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }
}
