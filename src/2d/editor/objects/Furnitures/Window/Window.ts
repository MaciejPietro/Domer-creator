import { Graphics } from 'pixi.js';
import { Point } from '@/helpers/Point';
import { Tool } from '@/2d/editor/constants';
import { useStore } from '@/stores/EditorStore';
import { DeleteFurnitureAction } from '@/2d/editor/actions/DeleteFurnitureAction';
import { v4 as uuidv4 } from 'uuid';
import { WindowType } from './config';
import { notifications } from '@mantine/notifications';
import { Wall } from '../../Walls/Wall';
import { BuildingElement, BuildingElementProps } from '../BuildingElement';
import { DashedLine } from '../../Helpers/DashedLine';

// bg-blue-500 from tailwind.config.js
const COLOR = '#1C7ED6';
const WINDOW_WIDTH = 80;

type WindowProps = {};

export class WindowElement extends BuildingElement {
    baseLine: Graphics;
    length = WINDOW_WIDTH;
    type = WindowType.Casement;

    constructor(config?: WindowProps & BuildingElementProps) {
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

    public setType(type: WindowType) {
        // this.type = type;
        // this.setStroke();
    }

    private setBackground(strokeColor = 'transparent', fillColor = 'transparent') {
        const wallParentThickness = this.customParent?.thickness || 0;

        this.background.clear();
        this.background.rect(0, -wallParentThickness / 2, this.length, wallParentThickness);
        this.background.fill(fillColor);
        this.background.stroke(strokeColor);
        this.addChild(this.background);
    }

    private setStroke() {
        this.baseLine?.clear();

        const wallParentThickness = this.customParent?.thickness || 0;

        this.baseLine = new Graphics();
        const { x, y } = { x: 0, y: 0 };

        const strokeSettings = { width: 2, color: COLOR };

        console.log(this.length);

        const cutWidth = 5;
        const num = Math.floor(this.length / cutWidth);

        for (let i = 0; i < num; i++) {
            this.baseLine
                .moveTo(i * cutWidth, 0)
                .lineTo(i * cutWidth + cutWidth / 2, 0)
                .stroke(strokeSettings);
        }

        // this.baseLine.addChild(line);

        // ARC
        // this.baseLine
        //     .arc(x, y, this.length, 0, 0.1)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 0.15, 0.25)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 0.3, 0.4)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 0.45, 0.55)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 0.6, 0.7)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 0.75, 0.85)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 0.9, 1.0)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 1.05, 1.15)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 1.2, 1.3)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 1.35, 1.45)
        //     .stroke(strokeSettings)
        //     .arc(x, y, this.length, 1.5, 1.55)
        //     .stroke(strokeSettings);

        // // THICK LINE
        // this.baseLine.rect(0, 0, x + this.length, 10).fill({ color: COLOR });

        // // LINE
        this.baseLine
            .moveTo(0, -wallParentThickness / 2)
            .lineTo(0, wallParentThickness / 2)
            .stroke(strokeSettings);

        this.baseLine
            .moveTo(this.length, -wallParentThickness / 2)
            .lineTo(this.length, wallParentThickness / 2)
            .stroke(strokeSettings);

        this.addChild(this.baseLine);
    }

    private checkEventMode() {
        const activeTool = useStore.getState().activeTool;
        this.eventMode = activeTool === Tool.FurnitureAddWindow || activeTool === Tool.WallAdd ? 'none' : 'static';
    }

    private checkVisibility() {
        // const focusedElement = useStore.getState().focusedElement;
        // if (focusedElement === this) {
        //     this.setBackground('green');
        // }
        // if (focusedElement !== this) {
        //     this.setBackground();
        // }
    }

    public setPosition({ x, y }: Nullable<Point>) {
        const wallParentThickness = this.customParent?.thickness || 0;
        // const fixedY = this.orientation === DoorOrientation.West ? wallParentThickness - 12 : 10;
        this.position = { x: x ?? this.position.x, y: wallParentThickness / 2 - 1 };
    }

    public setLength(length: number) {
        // const prevLength = this.length;
        // this.length = length;
        // if (this.isCollide()) {
        //     this.length = prevLength;
        //     notifications.clean();
        //     notifications.show({
        //         title: '🚪 Nie można zmienić szerokości',
        //         message: 'Drzwi nie mogą nachodzić na siebie',
        //         color: 'red',
        //     });
        //     return;
        // }
        // this.setStroke();
        // this.setBackground('green');
    }
}
