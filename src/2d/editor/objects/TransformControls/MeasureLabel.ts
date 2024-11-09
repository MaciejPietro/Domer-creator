import { Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { Point } from '../../../../helpers/Point';
import { METER } from '../../constants';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '../Walls/Wall';

// bg-blue-500 from tailwind.config.js
const LINE_STYLE = { width: 1, color: '#1C7ED6' };

export class MeasureLabel extends Container {
    text: Text;
    textStyle = new TextStyle({ fontSize: 14, fill: 0x000000, align: 'center' });
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

        this.text = new Text({ text: '', style: this.textStyle });

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

    public updateText(length: number, angle: number) {
        if (angle <= 90 || angle >= 270) {
            this.textContainer.scale.y = 1;
            this.textContainer.scale.x = 1;
            this.textContainer.position.x = length / 2 - 20;
            this.textContainer.position.y = -20;
        }

        if (angle > 90 && angle < 270) {
            this.textContainer.scale.y = -1;
            this.textContainer.scale.x = -1;
            this.textContainer.position.x = length / 2 + 20;
            this.textContainer.position.y = -6;
        }

        this.textContainer.zIndex = 998;

        this.text.text = this.toMeter(length);
    }

    public updateLine(length: number) {
        this.lineAGraphic.clear().moveTo(1, -6).lineTo(1, 6).stroke(LINE_STYLE);
        this.lineBGraphic.clear().moveTo(length, -6).lineTo(length, 6).stroke(LINE_STYLE);

        this.lineGraphic.clear().moveTo(1, 0).lineTo(length, 0).stroke(LINE_STYLE);
    }

    private toMeter(size: number) {
        size = Math.abs(size) / METER;

        const sizeLabel = (Math.round(size * 100) / 100).toFixed(2);

        return sizeLabel + 'm';
    }
}
