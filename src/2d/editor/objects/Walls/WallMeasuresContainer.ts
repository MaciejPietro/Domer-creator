import { Container } from 'pixi.js';
import { Point } from '@/helpers/Point';
import { MeasureLabel } from '../TransformControls/MeasureLabel';

class WallMeasuresContainer extends Container {
    labelTop: MeasureLabel;
    labelBottom: MeasureLabel;

    pointA: Point;
    pointB: Point;
    pointC: Point;
    pointD: Point;

    constructor({ a, b, c, d }: { a: Point; b: Point; c: Point; d: Point }) {
        super();
        this.pointA = a;
        this.pointB = b;
        this.pointC = c;
        this.pointD = d;

        this.labelTop = new MeasureLabel(0);
        this.labelBottom = new MeasureLabel(0);

        this.addChild(this.labelTop);
        this.addChild(this.labelBottom);
    }

    public update({ thickness, angle }: { thickness: number; angle: number }) {
        const pointA = this.pointA?.x;
        const pointB = this.pointB?.x;
        const pointC = this.pointC?.x;
        const pointD = this.pointD?.x;

        const topLength = Math.abs(pointD - pointC);
        this.labelTop.update({
            length: topLength,
            angle: angle,
            startX: pointC,
            endX: pointD,
            offsetY: -5,
            thickness: thickness,
        });

        const bottomLength = Math.abs(pointB - pointA);
        this.labelBottom.update({
            thickness: thickness,
            length: bottomLength,
            angle: angle,
            startX: pointA,
            endX: pointB,
            offsetY: thickness + 20,
        });
    }

    public hide() {
        this.labelTop.hide();
        this.labelBottom.hide();
    }

    public show() {
        this.labelTop.show();
        this.labelBottom.show();
    }
}

export default WallMeasuresContainer;
