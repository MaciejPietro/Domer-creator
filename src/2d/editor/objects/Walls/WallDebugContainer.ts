import { Container, Graphics } from 'pixi.js';
import { Point } from '@/common/types/point';

class WallDebugContainer extends Container {
    dotHelperA = new Graphics();
    dotHelperB = new Graphics();
    dotHelperC = new Graphics();
    dotHelperD = new Graphics();

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

        this.addChild(this.dotHelperA);
        this.addChild(this.dotHelperB);
        this.addChild(this.dotHelperC);
        this.addChild(this.dotHelperD);
    }

    public update() {
        this.dotHelperA.clear();
        this.dotHelperA.zIndex = 1001;
        this.dotHelperA.circle(this.pointA.x, this.pointA.y, 3);
        this.dotHelperA.stroke({ width: 1, color: 'red' });

        this.dotHelperB.clear();
        this.dotHelperB.zIndex = 1001;
        this.dotHelperB.circle(this.pointB.x, this.pointB.y, 3);
        this.dotHelperB.stroke({ width: 1, color: 'green' });

        this.dotHelperC.clear();
        this.dotHelperC.zIndex = 1001;
        this.dotHelperC.circle(this.pointC.x, this.pointC.y, 3);
        this.dotHelperC.stroke({ width: 1, color: 'blue' });

        this.dotHelperD.clear();
        this.dotHelperD.zIndex = 1001;
        this.dotHelperD.circle(this.pointD.x, this.pointD.y, 3);
        this.dotHelperD.stroke({ width: 1, color: 'purple' });
    }
}

export default WallDebugContainer;
