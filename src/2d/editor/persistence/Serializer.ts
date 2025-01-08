import { Floor } from '../objects/Floor';
import { FloorPlanSerializable } from './FloorPlanSerializable';

export class Serializer {
    public serialize(floors: Floor[], furnitureId: number) {
        const floorPlanSerializable = new FloorPlanSerializable();

        for (const floor of floors) {
            const floorSerializable = floor.serialize();

            floorPlanSerializable.floors.push(floorSerializable);
        }

        // floorPlanSerializable.furnitureId = furnitureId;
        // floorPlanSerializable.wallNodeId = floors[0].getWallNodeSequence().getWallNodeId();
        const resultString = floorPlanSerializable;

        return resultString;
    }

    public serializePlanForExport(floors: Floor[]) {
        const floorPlanSerializable = new FloorPlanSerializable();

        for (const floor of floors) {
            const floorSerializable = floor.getPlan();

            // @ts-expect-error find why
            floorPlanSerializable.floors.push(floorSerializable);
        }

        return floorPlanSerializable.floors[0];
    }

    public serializePlanForModel(floors: Floor[]) {
        const floorPlanSerializable = new FloorPlanSerializable();

        for (const floor of floors) {
            const floorSerializable = floor.getPlan(true);

            // @ts-expect-error find why
            floorPlanSerializable.floors.push(floorSerializable);
        }

        return floorPlanSerializable.floors[0];
    }
}
