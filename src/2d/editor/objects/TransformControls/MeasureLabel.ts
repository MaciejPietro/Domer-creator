import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '../Walls/Wall';
import { METER } from '@/2d/constants/mathConstants';

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
        // this.zIndex = 1001;

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

    private updateText(length: number, angle: number, position: { x: number; y: number }) {
        const shouldFlip = angle <= 90 || angle >= 270;

        if (shouldFlip) {
            this.textContainer.scale.y = 1;
            this.textContainer.scale.x = 1;
            this.textContainer.position.x = position.x - this.textContainer.width / 2;
            this.textContainer.position.y = position.y - 24;
        } else {
            this.textContainer.scale.y = -1;
            this.textContainer.scale.x = -1;
            this.textContainer.position.x = position.x + this.textContainer.width / 2;
            this.textContainer.position.y = position.y - 10;
        }

        this.textContainer.zIndex = 998;

        this.text.text = this.toMeter(length);
    }

    public update({
        length,
        angle,
        thickness,
        startX,
        endX,
        offsetY,
    }: {
        length: number;
        angle: number;
        thickness: number;
        startX: number;
        endX: number;
        offsetY: number;
    }) {
        this.lineAGraphic
            .clear()
            .moveTo(startX, offsetY - 6)
            .lineTo(startX, offsetY + 6)
            .stroke(LINE_STYLE);

        this.lineBGraphic
            .clear()
            .moveTo(endX, offsetY - 6)
            .lineTo(endX, offsetY + 6)
            .stroke(LINE_STYLE);

        this.lineGraphic.clear().moveTo(startX, offsetY).lineTo(endX, offsetY).stroke(LINE_STYLE);

        const isTopLine = offsetY < 0;

        const textX = isTopLine ? endX + length / 2 : endX - length / 2;
        const textY = isTopLine ? 0 : thickness + 48;

        this.updateText(length, angle, { x: textX, y: textY });
    }

    private toMeter(size: number) {
        size = Math.abs(size) / METER;

        const sizeLabel = (Math.round(size * 100) / 100).toFixed(2);

        return sizeLabel + 'm';
    }
}
