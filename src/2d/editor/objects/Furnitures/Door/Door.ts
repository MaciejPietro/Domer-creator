import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { Point } from '@/helpers/Point';
import { Tool } from '@/2d/editor/constants';
import { useStore } from '@/stores/EditorStore';
import { DeleteFurnitureAction } from '@/2d/editor/actions/DeleteFurnitureAction';
import { v4 as uuidv4 } from 'uuid';
import { DoorOrientation, DoorType } from './config';
import { notifications } from '@mantine/notifications';
import { Wall } from '../../Walls/Wall';

// bg-blue-500 from tailwind.config.js
const COLOR = '#1C7ED6';
const DOOR_WIDTH = 80;

export type FurnitureOrientation = number; // 0 <-> 359

type DoorProps = {
    position?: Point;
    uuid?: string;
    parent?: Wall;
};

export class Door extends Container {
    uuid = uuidv4();
    baseLine: Graphics;
    background: Graphics;
    length = DOOR_WIDTH;
    clickStartTime: number;
    type = DoorType.Left;
    orientation = DoorOrientation.West;
    customParent: Wall | undefined;
    public isTemporary = false;
    public isValid = false;

    constructor(config?: DoorProps) {
        super();

        this.eventMode = 'none';

        if (config?.uuid) this.uuid = config.uuid;
        if (config?.parent) this.customParent = config.parent;

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

    private setBackground(strokeColor = 'transparent', fillColor = 'transparent') {
        this.background.clear();
        this.background.rect(-2.5, -2.5, this.length + 5, this.length + 5);
        this.background.fill(fillColor);
        this.background.stroke(strokeColor);

        this.addChild(this.background);
    }

    private setStroke() {
        this.baseLine?.clear();

        this.baseLine = new Graphics();
        const { x, y } = { x: 0, y: 0 };

        const strokeSettings = { width: 2, color: COLOR };

        // ARC
        this.baseLine
            .arc(x, y, this.length, 0, 0.1)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 0.15, 0.25)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 0.3, 0.4)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 0.45, 0.55)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 0.6, 0.7)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 0.75, 0.85)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 0.9, 1.0)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 1.05, 1.15)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 1.2, 1.3)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 1.35, 1.45)
            .stroke(strokeSettings)
            .arc(x, y, this.length, 1.5, 1.55)
            .stroke(strokeSettings);

        // THICK LINE
        this.baseLine.rect(0, 0, x + this.length, 10).fill({ color: COLOR });

        // LINE
        this.baseLine
            .moveTo(x, y)
            .lineTo(0, y + this.length)
            .stroke(strokeSettings);

        if (this.orientation === DoorOrientation.West) {
            this.position.y = (this.customParent?.thickness || 0) - 12;

            console.log(this.position.y);

            this.scale.y = 1;
            this.scale.x = this.type === DoorType.Left ? 1 : -1;

            if (this.type === DoorType.Left) {
                this.baseLine.position.x = 0;
                this.background.position.x = 0;
            }

            if (this.type === DoorType.Right) {
                this.baseLine.position.x = -this.length;
                this.background.position.x = -this.length;
            }
        }

        if (this.orientation === DoorOrientation.East) {
            this.scale.y = -1;
            this.position.y = 10;

            if (this.type === DoorType.Left) {
                this.scale.x = -1;

                this.baseLine.position.x = -this.length;
                this.background.position.x = -this.length;
            }

            if (this.type === DoorType.Right) {
                this.scale.x = 1;

                this.baseLine.position.x = 0;
                this.background.position.x = 0;
            }
        }

        this.addChild(this.baseLine);
    }

    private checkEventMode() {
        const activeTool = useStore.getState().activeTool;

        this.eventMode = activeTool === Tool.FurnitureAddDoor || activeTool === Tool.WallAdd ? 'none' : 'static';
    }

    private checkVisibility() {
        const focusedElement = useStore.getState().focusedElement;

        if (focusedElement === this) {
            this.setBackground('green');
        }
        if (focusedElement !== this) {
            this.setBackground();
        }
    }

    public setPosition({ x, y }: Nullable<Point>) {
        const wallParentThickness = this.customParent?.thickness || 0;
        const fixedY = this.orientation === DoorOrientation.West ? wallParentThickness - 12 : 10;

        this.position = { x: x ?? this.position.x, y: fixedY };
    }

    public setType(type: DoorType) {
        this.type = type;

        this.setStroke();
    }

    public setLength(length: number) {
        const prevLength = this.length;
        this.length = length;

        const occupiedSpots: Array<{
            start: number;
            end: number;
        }> = [];

        for (const child of this.parent.children) {
            if (child instanceof Door) {
                occupiedSpots.push({ start: child.position.x, end: child.position.x + child.length });
            }
        }

        occupiedSpots.sort((a, b) => a.start - b.start);

        console.log(occupiedSpots);

        for (const key in occupiedSpots) {
            const current = occupiedSpots[key];
            const next = occupiedSpots[+key + 1];

            if (current.end > next?.start) {
                this.length = prevLength;

                notifications.clean();

                notifications.show({
                    title: '🚪 Nie można zmienić szerokości',
                    message: 'Drzwi nie mogą nachodzić na siebie',
                    color: 'red',
                });

                return;
            }
        }

        this.setStroke();
        this.setBackground('green');
    }

    public setOrientation(orientation: DoorOrientation) {
        this.orientation = orientation;

        this.setStroke();
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
