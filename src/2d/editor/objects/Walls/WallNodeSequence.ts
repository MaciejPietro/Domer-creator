import { showNotification } from '@mantine/notifications';
import { Container } from 'pixi.js';
import { INodeSerializable } from '../../persistence/INodeSerializable';
import { Wall, WallSettings } from './Wall';
import { WallNode } from './WallNode';
import { WallType } from './config';
import { BuildingElement } from '../Furnitures/BuildingElement';

export type NodeLinksWithWall = [
    number,
    Array<{
        id: number;
        wallUuid: string;
    }>,
];
export class WallNodeSequence extends Container {
    private wallNodes: Map<number, WallNode>;
    private wallNodeLinks: Map<number, number[]>;
    private walls: Wall[];
    private static wallNodeId = 0;
    constructor() {
        super();
        this.sortableChildren = true;
        this.walls = [];
        this.wallNodes = new Map<number, WallNode>();
        this.wallNodeLinks = new Map<number, number[]>();
        this.drawWalls();

        this.on('mousemove', this.drawWalls);
    }

    public setId(id: number) {
        WallNodeSequence.wallNodeId = id;
    }

    public getWallNodeId() {
        return WallNodeSequence.wallNodeId;
    }
    public contains(id: number) {
        return this.wallNodes.has(id);
    }

    public getWalls() {
        return this.walls;
    }

    public getWallNodes() {
        return this.wallNodes;
    }

    public getWallNodeLinks() {
        return this.wallNodeLinks;
    }

    public getWallNodeLinksWithUuid() {
        const walls = this.getWalls();

        const lll = Array.from(this.getWallNodeLinks().entries());

        const my = lll.reduce((acc, [aNodeId, nodes]) => {
            const nodesWithWalls = nodes.map((bNodeId) => {
                const foundWall = walls.find(({ leftNode, rightNode }) => {
                    const leftMatch = leftNode.getId() === aNodeId || rightNode.getId() === aNodeId;
                    const rightMatch = leftNode.getId() === bNodeId || rightNode.getId() === bNodeId;

                    return leftMatch && rightMatch;
                });

                if (!foundWall) throw new Error('Wall not found');

                return {
                    id: bNodeId,
                    wallUuid: foundWall.uuid || null,
                    thickness: foundWall.thickness || null,
                };
            });

            acc.push([aNodeId, nodesWithWalls]);

            return acc;
        }, [] as any);

        return my;
    }

    public load(nodes: INodeSerializable[], nodeLinks: NodeLinksWithWall[]) {
        const nodesIds = [];

        for (const node of nodes) {
            this.addNode(node.x, node.y, node.id);
        }

        for (const [src, dests] of nodeLinks) {
            for (const dest of dests) {
                // @ts-expect-error find why
                const { id, wallUuid, thickness } = dest;
                this.addWall(id, src, { uuid: wallUuid, thickness });
                nodesIds.push(id);
                nodesIds.push(src);
            }
        }

        WallNodeSequence.wallNodeId = nodesIds.length ? Math.max(...nodesIds) : 0;
    }

    public reset() {
        for (const key of Array.from(this.wallNodes.keys())) {
            this.wallNodes.get(key)?.destroy(true);
        }
        this.wallNodes.clear();
        for (const wall of this.walls) {
            // TODO wall is not fully destroyed, so I have to check if (this.context) in Wall class
            wall.destroy(true);
        }
        this.walls = [];
        this.wallNodeLinks.clear();
        WallNodeSequence.wallNodeId = 0;
    }

    public removeNode(id: number) {
        // TODO only remove if connected to 2 points.
        let isolated = true;
        const links = this.wallNodeLinks.get(id);

        if (links && links.length > 0) {
            isolated = false;
        } else {
            for (const src of Array.from(this.wallNodeLinks.keys())) {
                for (const dest of this.wallNodeLinks.get(src)!) {
                    if (dest == id) {
                        isolated = false;
                    }
                }
            }
        }
        if (isolated) {
            // remove node
            this.wallNodes.get(id)!.destroy(true);
            this.wallNodes.delete(id);
            // remove links containing node TODO if implementing undo. remember these
            // this.wallNodeLinks[id].length = 0;
        }
    }

    public getNewNodeId() {
        WallNodeSequence.wallNodeId += 1;

        return WallNodeSequence.wallNodeId;
    }

    public addNode(x: number, y: number, id?: number) {
        const nodeId = id || this.getNewNodeId();

        this.wallNodes.set(nodeId, new WallNode(x, y, nodeId));
        this.wallNodeLinks.set(nodeId, []);
        this.addChild(this.wallNodes.get(nodeId)!);

        return this.wallNodes.get(nodeId);
    }

    public addWall(leftNodeId: number, rightNodeId: number, settings?: WallSettings) {
        if (leftNodeId === rightNodeId) return;

        if (this.wallNodeLinks.has(leftNodeId) && this.wallNodeLinks.get(leftNodeId)?.includes(rightNodeId)) {
            return;
        }
        this.wallNodeLinks.get(leftNodeId)?.push(rightNodeId);
        const leftNode = this.wallNodes.get(leftNodeId);
        const rightNode = this.wallNodes.get(rightNodeId);

        const wall = new Wall(leftNode!, rightNode!, settings);

        this.walls.push(wall);

        this.addChild(wall as unknown as Container);
        this.drawWalls();

        return wall;
    }

    public removeWall(leftNode: number, rightNode: number) {
        const rightNodeIndex = this.wallNodeLinks.get(leftNode)?.indexOf(rightNode);

        if (rightNodeIndex != -1) {
            // @ts-expect-error find why
            this.wallNodeLinks.get(leftNode).splice(rightNodeIndex, 1);
            // this.drawWalls();
        }

        let toBeRemoved = -1;

        console.log('xdx', toBeRemoved);

        for (let i = 0; i < this.walls.length; i++) {
            const wall = this.walls[i];

            if (wall.leftNode.getId() == leftNode && wall.rightNode.getId() == rightNode) {
                toBeRemoved = i;
                break;
            }
        }
        if (toBeRemoved != -1) {
            this.removeChild(this.walls[toBeRemoved]);
            this.walls.splice(toBeRemoved, 1);
        }
    }

    public getWall(leftNodeId: number, rightNodeId: number) {
        if (!this.wallNodeLinks.get(leftNodeId) || !this.wallNodeLinks.get(leftNodeId)!.includes(rightNodeId)) {
            return null;
        }

        for (const wall of this.walls) {
            if (wall.leftNode.getId() === leftNodeId && wall.rightNode.getId() === rightNodeId) {
                return wall;
            }
        }

        return null;
    }

    public getWallsByNodesIds(wallNodeIds: number[]) {
        const connectedWalls: Wall[] = [];

        for (const wallNodeId of wallNodeIds) {
            for (const wall of this.walls) {
                if (wall.leftNode.getId() === wallNodeId || wall.rightNode.getId() === wallNodeId) {
                    connectedWalls.push(wall);
                }
            }
        }

        return connectedWalls;
    }

    public getWallByUuid(uuid: string) {
        return this.walls.find((wall) => wall.uuid === uuid);
    }

    public findAllNeighbors(currentWallUuid: string, nodeId: number) {
        return this.getWallsByNodesIds([nodeId]).filter((wall) => wall.uuid !== currentWallUuid);
    }

    public findFirstNeighbor(currentWall: Wall, nodeId: number, clockwise: boolean = true) {
        const walls = this.getWallsByNodesIds([nodeId]);
        const currentWallUuid = currentWall.uuid;

        if (!currentWall) return null;

        // Determine if nodeId is the left or right node of current wall
        const isLeftNode = currentWall.leftNode.getId() === nodeId;

        const neighborWalls = walls
            .filter((wall) => wall.uuid !== currentWallUuid)
            .map((wall) => {
                // Determine how the neighbor wall is connected
                const neighborIsLeftNode = wall.leftNode.getId() === nodeId;

                // Get base angles
                let currentAngle = isLeftNode ? currentWall.angle : (currentWall.angle + 180) % 360;
                let neighborAngle = neighborIsLeftNode ? wall.angle : (wall.angle + 180) % 360;

                // Calculate relative angle
                let angle = neighborAngle - currentAngle;

                // Normalize to 0-360 range
                if (angle < 0) angle += 360;

                return { wall, angle };
            })
            .sort((a, b) => (clockwise ? a.angle - b.angle : b.angle - a.angle));

        return neighborWalls[0]?.wall || null;
    }

    public drawWalls() {
        this.walls.forEach((wall) => {
            wall.drawWall();
        });
    }

    public blurAllElements(exceptUuid?: string) {
        this.walls.forEach((wall) => {
            if (wall.uuid !== exceptUuid) {
                wall.blur();
            }

            wall.children.forEach((child) => {
                if (child instanceof BuildingElement) {
                    child.blur();
                }
            });
        });
    }
}
