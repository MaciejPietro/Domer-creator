import { INodeSerializable } from '@/2d/editor/persistence/INodeSerializable';
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
