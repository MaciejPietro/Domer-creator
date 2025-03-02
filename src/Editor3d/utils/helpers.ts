import { INodeSerializable } from '@/Editor2d/editor/persistence/INodeSerializable';
import { Vector3 } from 'three';

export const calculateCenterPoint = (wallNodes: INodeSerializable[]) => {
    let sumX = 0;
    let sumY = 0;
    const sumZ = 0;

    wallNodes.forEach((node: any) => {
        const midX = (node.a.x + node.b.x) / 2;
        const midY = (node.a.y + node.b.y) / 2;

        sumX += midX;
        sumY += midY;
    });

    const avgX = sumX / wallNodes.length;
    const avgY = sumY / wallNodes.length;
    const avgZ = sumZ / wallNodes.length;

    return new Vector3(avgX, 0, avgY);
};

export function createRandomColor(length = 6) {
    let color = '';
    for (let i = 0; i < length; i += 2) {
        // Generate a random value between 128 and 192 (inclusive) for each RGB channel
        const randomValue = Math.floor(Math.random() * 65) + 128;
        const hexValue = randomValue.toString(16).padStart(2, '0');
        color += hexValue;
    }
    return '#' + color;
}
