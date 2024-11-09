import { Graphics } from 'pixi.js';
import { Point } from '@/helpers/Point';
import { Tool } from '@/2d/editor/constants';
import { useStore } from '@/stores/EditorStore';
import { DeleteFurnitureAction } from '@/2d/editor/actions/DeleteFurnitureAction';
import { v4 as uuidv4 } from 'uuid';
import { DoorOrientation, DoorType } from './config';
import { notifications } from '@mantine/notifications';
import { Wall } from '../../Walls/Wall';
import { BuildingElement, BuildingElementProps } from '../BuildingElement';

// bg-blue-500 from tailwind.config.js
const COLOR = '#1C7ED6';
const DOOR_WIDTH = 80;

export type FurnitureOrientation = number; // 0 <-> 359

type DoorProps = {};

export class Door extends BuildingElement {
    baseLine: Graphics;
    length = DOOR_WIDTH;
    type = DoorType.Left;
    orientation = DoorOrientation.West;

    constructor(config?: DoorProps & BuildingElementProps) {
        super({
            position: config?.position,
            uuid: config?.uuid,
            parent: config?.parent,
        });

        this.setBackground('transparent');

        this.setStroke();

        if (config?.position) {
            this.setPosition(config.position);
        }
    }

    protected onStoreChange() {
        this.checkVisibility();
        this.checkEventMode();
    }

    public setValidity(isValid = true) {
        if (isValid) {
            this.isValid = true;
        } else {
            this.isValid = false;
        }

        this.setBackground('transparent', this.isValid ? 'transparent' : '#ff000020');
    }

    public setType(type: DoorType) {
        this.type = type;

        this.setStroke();
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

    public setLength(length: number) {
        const prevLength = this.length;
        this.length = length;

        if (this.isCollide()) {
            this.length = prevLength;

            notifications.clean();

            notifications.show({
                title: '🚪 Nie można zmienić szerokości',
                message: 'Drzwi nie mogą nachodzić na siebie',
                color: 'red',
            });
            return;
        }

        this.setStroke();
        this.setBackground('green');
    }

    public setOrientation(orientation: DoorOrientation) {
        this.orientation = orientation;

        this.setStroke();
    }
}
