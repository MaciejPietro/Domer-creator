import { FloorPlan } from '../objects/FloorPlan';
import { Wall } from '../objects/Walls/Wall';
import { WallNode } from '../objects/Walls/WallNode';
import { Action } from './Action';
import { AddWallManager } from './AddWallManager';
import { useStore } from '../../../stores/EditorStore';
import { snap } from '../../../helpers/ViewportCoordinates';
import { Point } from '../../../helpers/Point';

export class AddNodeAction implements Action {
    private wall: Wall;
    private coords: Point;
    private receiver: FloorPlan;

    constructor(wall?: Wall, coords?: Point) {
        if (wall) {
            this.wall = wall;
        }
        if (coords) {
            this.coords = coords;
        }
        this.receiver = FloorPlan.Instance;
    }

    public execute() {
        let newNode: WallNode;

        if (useStore.getState().snap == true) {
            this.coords.x = snap(this.coords.x);
            this.coords.y = snap(this.coords.y);
        }

        if (this.wall) {
            newNode = this.receiver.addNodeToWall(this.wall, this.coords)!;

            if (!newNode) return;
        } else {
            if (!AddWallManager.Instance.checkStep(this.coords)) {
                return;
            }

            newNode = this.receiver.addNode(this.coords.x, this.coords.y)!;
        }

        AddWallManager.Instance.step(newNode);
        this.receiver.actions.push(this);
    }
}
