import { Floor } from '../objects/Floor';
import { FloorPlanSerializable } from './FloorPlanSerializable';

export class Serializer {
    public serialize(floors: Floor[], furnitureId: number) {
        const floorPlanSerializable = new FloorPlanSerializable();

        for (const floor of floors) {
            const floorSerializable = floor.serialize();

            floorPlanSerializable.floors.push(floorSerializable);
        }
        floorPlanSerializable.furnitureId = furnitureId;
        floorPlanSerializable.wallNodeId = floors[0].getWallNodeSequence().getWallNodeId();
        const resultString = JSON.stringify(floorPlanSerializable);

        return resultString;
    }

    public serializePlan(floors: Floor[]) {
        const floorPlanSerializable = new FloorPlanSerializable();

        for (const floor of floors) {
            const floorSerializable = floor.getPlan();

            floorPlanSerializable.floors.push(floorSerializable);
        }
        // floorPlanSerializable.wallNodeId = floors[0].getWallNodeSequence().getWallNodeId();

        return floorPlanSerializable.floors[0];
    }
}
