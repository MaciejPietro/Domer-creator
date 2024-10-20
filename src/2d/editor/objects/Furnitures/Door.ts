import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { Point } from '../../../../helpers/Point';
import { METER, Tool } from '../../constants';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '../Walls/Wall';
import { DeleteFurnitureAction } from '../../actions/DeleteFurnitureAction';
import { v4 as uuidv4 } from 'uuid';

// bg-blue-500 from tailwind.config.js
const COLOR = '#1C7ED6';
const DOOR_WIDTH = 80;

export type FurnitureOrientation = number; // 0 <-> 359

type DoorProps = {
    position?: Point;
    uuid?: string;
};

export class Door extends Container {
    uuid = uuidv4();
    arcLine: Graphics;
    baseLine: Graphics;
    background: Graphics;
    length = DOOR_WIDTH;
    orientation = 0;
    clickStartTime: number;
    public isTemporary = false;
    public isValid = false;

    constructor(config?: DoorProps) {
        super();

        this.eventMode = 'none';

        if (config?.uuid) this.uuid = config.uuid;

        this.background = new Graphics();

        this.setBackground('transparent');

        this.setStroke();

        this.watchStoreChanges();

        this.on('pointerdown', this.onMouseDown);
        this.on('pointerup', this.onMouseUp);

        this.clickStartTime = 0;

        if (config?.position) {
            this.setPosition(config.position);
        }
    }

    private watchStoreChanges() {
        useStore.subscribe(() => {
            this.checkVisibility();
            this.checkEventMode();
        });
    }

    private setBackground(strokeColor: string, fillColor = 'transparent') {
        this.background.clear();
        this.background.rect(-2.5, -2.5, DOOR_WIDTH + 5, DOOR_WIDTH + 5);
        this.background.fill(fillColor);
        this.background.stroke(strokeColor);

        this.addChild(this.background);
    }

    private setStroke() {
        this.baseLine = new Graphics();
        const { x, y } = { x: 0, y: 0 };

        const color = this.isValid ? COLOR : 'red';

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
    }

    private checkEventMode() {
        const activeTool = useStore.getState().activeTool;

        this.eventMode = activeTool === Tool.FurnitureAddDoor || activeTool === Tool.WallAdd ? 'none' : 'static';

        console.log(this.eventMode);
    }

    private checkVisibility() {
        const focusedElement = useStore.getState().focusedElement;

        if (focusedElement === this) {
            this.setBackground('green');
        }
        if (focusedElement !== this) {
            this.setBackground('transparent');
        }
    }

    public setPosition({ x, y }: Point) {
        this.position = { x, y };
    }

    public setOrientation(orientation: FurnitureOrientation) {
        // const radians = orientation * DEG_TO_RAD;
        // this.baseLine.rotation = radians;
        // this.orientation = orientation;
    }

    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();
        console.log('xdxd click');

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

    public setTemporality(temporary: boolean) {
        if (temporary) {
            this.alpha = 0.5;
        } else {
            this.alpha = 1;
        }
        this.isTemporary = temporary;
        this.eventMode = temporary ? 'none' : 'static';
    }

    public setValidity(isValid = true) {
        if (isValid) {
            this.isValid = true;
        } else {
            this.isValid = false;
        }

        this.setBackground('transparent', this.isValid ? 'transparent' : '#ff000020');
    }

    public hide() {
        this.visible = false;
    }

    public delete() {
        const action = new DeleteFurnitureAction(this.uuid);

        action.execute();
        // new DeleteWallNodeAction(this.leftNode.getId()).execute();
        // new DeleteWallNodeAction(this.rightNode.getId()).execute();
    }
}
