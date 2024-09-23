import { Container, DEG_TO_RAD, FederatedPointerEvent, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { Point } from '../../../../helpers/Point';
import { METER, Tool } from '../../constants';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '../Walls/Wall';

const COLOR = '#1C7ED6';
const DOOR_WIDTH = 80;

export type FurnitureOrientation = number; // 0 <-> 359

type DoorProps = {
    position?: Point;
};

export class Door extends Container {
    arcLine: Graphics;
    baseLine: Graphics;
    orientation = 0;
    clickStartTime: number;

    constructor(config?: DoorProps) {
        super();

        this.eventMode = 'static';

        const { x, y } = { x: 0, y: 0 };

        this.baseLine = new Graphics();

        this.baseLine
            .arc(x, y, DOOR_WIDTH, 0, 0.1)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 0.15, 0.25)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 0.3, 0.4)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 0.45, 0.55)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 0.6, 0.7)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 0.75, 0.85)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 0.9, 1.0)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 1.05, 1.15)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 1.2, 1.3)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 1.35, 1.45)
            .stroke({ width: 2, color: COLOR })
            .arc(x, y, DOOR_WIDTH, 1.5, 1.55)
            .stroke({ width: 2, color: COLOR });

        this.baseLine.rect(0, 0, x + DOOR_WIDTH, 10).fill({ color: COLOR });

        this.baseLine
            .moveTo(x, y)
            .lineTo(0, y + DOOR_WIDTH)
            .stroke({ width: 2, color: COLOR });

        this.addChild(this.baseLine);

        this.on('pointerdown', this.onMouseDown);
        this.on('pointerup', this.onMouseUp);

        this.clickStartTime = 0;

        if (config?.position) {
            this.setPosition(config.position);
        }
    }

    public setPosition({ x, y }: Point) {
        this.baseLine.position = { x, y };
    }

    public setOrientation(orientation: FurnitureOrientation) {
        // const radians = orientation * DEG_TO_RAD;
        // this.baseLine.rotation = radians;
        // this.orientation = orientation;
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        this.clickStartTime = Date.now();
    }

    private onMouseUp(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200) {
            this.onMouseClick();
        }

        return;
    }

    private onMouseClick() {
        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.Edit:
                console.log('xdxd click', this);
                state.setFocusedElement(this as unknown as Door);

                // this.leftNode.show();
                // this.rightNode.show();
                // this.label.visible = true;
                break;
        }
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }
}
