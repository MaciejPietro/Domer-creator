import { Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { Point } from '../../../../helpers/Point';
import { METER } from '../../constants';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '../Walls/Wall';

// bg-blue-500 from tailwind.config.js
const LINE_STYLE = { width: 1, color: '#1C7ED6' };

export class MeasureLabel extends Container {
    text: Text;
    textStyle = new TextStyle({
        fontSize: 14,
        fill: 0x000000,
        align: 'center',
        fontFamily: 'Arial',
        letterSpacing: 0,
    });
    lineContainer = new Container();
    textContainer = new Container();
    lineGraphic: Graphics;
    lineAGraphic: Graphics;
    lineBGraphic: Graphics;

    constructor(length?: number) {
        super();

        this.eventMode = 'none';

        if (!length) {
            length = 0;
        }

        this.visible = false;

        this.text = new Text({ text: '', style: this.textStyle, resolution: 3 });

        this.textContainer.addChild(this.text);
        this.addChild(this.textContainer);

        this.pivot.set(this.width / 2, this.height / 2);
        this.zIndex = 1001;

        this.lineGraphic = new Graphics();
        this.lineAGraphic = new Graphics();
        this.lineBGraphic = new Graphics();

        this.lineContainer.addChild(this.lineAGraphic);
        this.lineContainer.addChild(this.lineBGraphic);
        this.lineContainer.addChild(this.lineGraphic);

        this.addChild(this.lineContainer);

        this.watchStoreChanges();
    }

    private watchStoreChanges() {
        // useStore.subscribe(() => {
        //     this.checkVisibility();
        // });
    }

    private checkVisibility() {
        const focusedElement = useStore.getState().focusedElement;

        if (!focusedElement) return this.hide();

        if (focusedElement instanceof Wall) {
            // if (focusedElement.leftNode === this) return;
            // if (focusedElement.rightNode === this) return;
            // this.hide();

            return;
        }

        this.show();
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    public updateText(length: number, angle: number, offset: { x: number; y: number }) {
        if (angle <= 90 || angle >= 270) {
            this.textContainer.scale.y = 1;
            this.textContainer.scale.x = 1;
            this.textContainer.position.x = offset.x + length / 2;
            this.textContainer.position.y = offset.y;
        }

        if (angle > 90 && angle < 270) {
            this.textContainer.scale.y = -1;
            this.textContainer.scale.x = -1;
            this.textContainer.position.x = offset.x + length / 2;
            this.textContainer.position.y = offset.y;
        }

        this.textContainer.zIndex = 998;

        this.text.text = this.toMeter(length);
    }

    public updateLine(startX: number, endX: number, yOffset: number, containerYOffset: number) {
        this.lineAGraphic
            .clear()
            .moveTo(startX, yOffset - 6)
            .lineTo(startX, yOffset + 6)
            .stroke(LINE_STYLE);
        this.lineBGraphic
            .clear()
            .moveTo(endX, yOffset - 6)
            .lineTo(endX, yOffset + 6)
            .stroke(LINE_STYLE);

        this.lineGraphic.clear().moveTo(startX, yOffset).lineTo(endX, yOffset).stroke(LINE_STYLE);

        this.lineContainer.position.set(0, 8 + containerYOffset);
    }

    private toMeter(size: number) {
        size = Math.abs(size) / METER;

        const sizeLabel = (Math.round(size * 100) / 100).toFixed(2);

        return sizeLabel + 'm';
    }
}
