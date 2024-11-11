import { Graphics } from 'pixi.js';
import { Point } from '@/helpers/Point';
import { COLOR_ACTIVE_ELEMENT_BORDER, COLOR_BACKGROUND, Tool } from '@/2d/editor/constants';
import { useStore } from '@/stores/EditorStore';
import { WindowType } from './config';
import { notifications } from '@mantine/notifications';
import { Wall } from '../../Walls/Wall';
import { BuildingElement, BuildingElementProps } from '../BuildingElement';
import { IWindowSerializable } from './IWindowSerializable';
import { WINDOW_Z_INDEX } from './constants';

// bg-blue-500 from tailwind.config.js
const COLOR = '#1C7ED6';
const WINDOW_WIDTH = 80;
const WINDOW_HEIGHT = 140;
const WINDOW_BOTTOM = 90;

type WindowProps = {
    length?: number;
    height?: number;
    bottom?: number;
};

export class WindowElement extends BuildingElement {
    baseLine: Graphics;
    length = WINDOW_WIDTH;
    private _height = WINDOW_HEIGHT;

    bottom = WINDOW_BOTTOM;
    type = WindowType.Single;
    zIndex = WINDOW_Z_INDEX;

    constructor(config?: WindowProps & BuildingElementProps) {
        super({
            position: config?.position,
            uuid: config?.uuid,
            parent: config?.parent,
        });

        if (config) {
            if (config.position) {
                this.setPosition(config.position);
            }

            if (config.length !== undefined) {
                this.length = config.length!;
            }

            if (config.height !== undefined) {
                this.height = config.height!;
            }

            if (config.bottom !== undefined) {
                this.bottom = config.bottom!;
            }
        }

        this.setBackground('transparent');

        this.setStroke();
    }

    public get height() {
        return this._height;
    }
    public set height(value) {
        this._height = value;
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

    public setType(type: WindowType) {
        this.type = type;
        this.setStroke();
    }

    private setBackground(strokeColor = 'transparent', fillColor = 'transparent') {
        const wallParentThickness = this.customParent?.thickness || 0;
        const offset = 10;

        this.background.clear();
        this.background.rect(
            0 - offset / 2,
            -wallParentThickness / 2 - offset / 2,
            this.length + offset,
            wallParentThickness + offset
        );
        this.background.fill(fillColor);
        this.background.stroke(strokeColor);
        this.addChild(this.background);
    }

    private setStroke() {
        this.baseLine?.clear();

        const wallParentThickness = (this.customParent?.thickness || 0) + 1;

        this.baseLine = new Graphics();
        const { x, y } = { x: 0, y: 0 };

        const strokeSettings = { width: 2, color: COLOR };

        // WALL GAP
        this.baseLine
            .rect(0, -wallParentThickness / 2, x + this.length, wallParentThickness)
            .fill({ color: COLOR_BACKGROUND });

        // DASHED LINE
        const cutWidth = 5;
        const num = Math.floor(this.length / cutWidth);

        for (let i = 0; i < num; i++) {
            this.baseLine
                .moveTo(i * cutWidth, 0)
                .lineTo(i * cutWidth + cutWidth / 2, 0)
                .stroke(strokeSettings);
        }

        // // TOP LINE
        this.baseLine
            .moveTo(0, -wallParentThickness / 2)
            .lineTo(0, wallParentThickness / 2)
            .stroke(strokeSettings);

        // BOTTOM LINE
        this.baseLine
            .moveTo(this.length, -wallParentThickness / 2)
            .lineTo(this.length, wallParentThickness / 2)
            .stroke(strokeSettings);

        // CASEMENT LINE
        if (this.type === WindowType.Casement) {
            this.baseLine
                .moveTo(this.length / 2, -5)
                .lineTo(this.length / 2, 5)
                .stroke(strokeSettings);
        }

        this.baseLine.position = { x: 0, y: 1 };

        this.addChild(this.baseLine);
    }

    private checkEventMode() {
        const activeTool = useStore.getState().activeTool;
        this.eventMode = activeTool === Tool.FurnitureAddWindow || activeTool === Tool.WallAdd ? 'none' : 'static';
    }

    private checkVisibility() {
        const focusedElement = useStore.getState().focusedElement;
        if (focusedElement === this) {
            this.isFocused = true;
            this.setBackground(COLOR_ACTIVE_ELEMENT_BORDER);
        }
        if (focusedElement !== this) {
            this.isFocused = false;
            this.setBackground();
        }
    }

    public setPosition({ x, y }: Nullable<Point>) {
        const wallParentThickness = this.customParent?.thickness || 0;
        // const fixedY = this.orientation === DoorOrientation.West ? wallParentThickness - 12 : 10;
        this.position = { x: x ?? this.position.x, y: wallParentThickness / 2 - 1 };
    }

    public setLength(length: number) {
        const prevLength = this.length;
        this.length = length;

        if (this.isCollide()) {
            this.length = prevLength;
            notifications.clean();
            notifications.show({
                title: '🪟 Nie można zmienić szerokości',
                message: 'Elementy na ścianie nie mogą nachodzić na siebie',
                color: 'red',
            });
            return;
        }

        this.setStroke();
        this.setBackground(COLOR_ACTIVE_ELEMENT_BORDER);
    }

    public serialize() {
        const parent = this.parent as Wall;

        const res: IWindowSerializable = {
            uuid: this.uuid,
            wallUuid: parent.uuid,
            x: this.x,
            y: this.y,
            length: this.length,
            height: this.height,
            bottom: this.bottom,
            type: this.type,
            element: 'window',
        };

        return res;
    }
}
