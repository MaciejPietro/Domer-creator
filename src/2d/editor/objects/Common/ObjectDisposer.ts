import { DeleteWallAction } from '../../actions/DeleteWallAction';
import { DeleteWallNodeAction } from '../../actions/DeleteWallNodeAction';
import { Door } from '../Furnitures/Door/Door';
import { WindowElement } from '../Furnitures/Window/Window';
import { Wall } from '../Walls/Wall';

export class ObjectDisposer {
    private object: any;
    children: any;

    constructor(object: any) {
        this.object = object;
    }

    public removeObject() {
        this.object.destroy();

        return this;
    }

    public removeAllChildren() {
        for (const child of this.object.children) {
            if (child instanceof Door || child instanceof WindowElement) {
                child.destroy();
            }
        }

        return this;
    }

    public deleteAction() {
        switch (true) {
            case this.object instanceof Wall:
                const action = new DeleteWallAction(this.object);

                action.execute();

                new DeleteWallNodeAction(this.object.leftNode.getId()).execute();
                new DeleteWallNodeAction(this.object.rightNode.getId()).execute();
                return this;
            default:
                throw Error('Object type not supported');
        }
    }
}
