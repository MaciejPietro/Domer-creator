import { Container } from 'pixi.js';
import { euclideanDistance } from '@/helpers/EuclideanDistance';
import { Point } from '@/helpers/Point';

import { METER } from '../constants';
import { FloorSerializable } from '../persistence/FloorSerializable';
import { Wall } from './Walls/Wall';
import { WallNodeSequence } from './Walls/WallNodeSequence';
import { Door } from './Furnitures/Door/Door';
import { WindowElement } from './Furnitures/Window/Window';
import { WallNode } from './Walls/WallNode';

type Furniture = WindowElement | Door;

export class Floor extends Container {
    public furnitureMap: Map<string, Furniture>;
    private wallNodeSequence: WallNodeSequence;
    constructor(floorData?: FloorSerializable, previousFloor?: Floor) {
        super();

        this.furnitureMap = new Map<string, Furniture>();
        this.wallNodeSequence = new WallNodeSequence();
        this.addChild(this.wallNodeSequence);
        // this.wallNodeSequence.zIndex = 1002;
        this.sortableChildren = true;
        if (floorData) {
            this.applyFloorData(floorData);
            return;
        }

        // if (previousFloor) {
        //     const nodeCloneMap = new Map<number, number>();

        //     // first iteration, map previous node ids to new node ids as we're simply cloning them
        //     for (const wall of previousFloor.getExteriorWalls()) {
        //         [wall.leftNode, wall.rightNode].map((node) => {
        //             const oldId = node.getId();

        //             if (!nodeCloneMap.has(oldId)) {
        //                 nodeCloneMap.set(oldId, this.wallNodeSequence.getNewNodeId());
        //                 this.addNode(node.x, node.y, nodeCloneMap.get(oldId));
        //             }
        //         });
        //     }

        //     // now copy walls with respect to the node mapping
        //     previousFloor.getExteriorWalls().map((wall) => {
        //         const newLeftId = nodeCloneMap.get(wall.leftNode.getId());
        //         const newRightId = nodeCloneMap.get(wall.rightNode.getId());

        //         if (!newLeftId || !newRightId) return;

        //         const newWall = this.wallNodeSequence.addWall(newLeftId, newRightId);

        //         if (newWall) {
        //             newWall.setIsExterior(true);
        //         }
        //     });
        // }
    }

    public applyFloorData(floorData: FloorSerializable) {
        this.wallNodeSequence.load(floorData.wallNodes, floorData.wallNodeLinks);

        for (const item of floorData.furnitureMap) {
            if (item.element === 'door') {
                const parent = this.wallNodeSequence.getWalls().find((wall) => wall.uuid === item.wallUuid);

                if (!parent) throw Error('Parent wall for furniture not found, but should.');

                const doorInstance = new Door({
                    uuid: item.uuid,
                    position: {
                        x: item.x,
                        y: item.y,
                    },
                    parent,
                    length: item.length,
                    type: item.type,
                    orientation: item.orientation,
                });

                this.furnitureMap.set(item.uuid, doorInstance);

                parent.addChild(doorInstance);
            }

            if (item.element === 'window') {
                const parent = this.wallNodeSequence.getWalls().find((wall) => wall.uuid === item.wallUuid);

                if (!parent) throw Error('Parent wall for furniture not found, but should.');

                const windowInstance = new WindowElement({
                    uuid: item.uuid,
                    position: {
                        x: item.x,
                        y: item.y,
                    },
                    parent,
                    length: item.length,
                    height: item.height,
                    bottom: item.bottom,
                });

                this.furnitureMap.set(item.uuid, windowInstance);

                parent.addChild(windowInstance);
            }

            // const furnitureData: FurnitureData = {
            //     width: fur.width,
            //     height: fur.height,
            //     imagePath: fur.texturePath,
            // };

            // if (fur.zIndex) {
            //     furnitureData.zIndex = fur.zIndex;
            // }
            // const attachedTo = this.wallNodeSequence.getWall(fur.attachedToLeft, fur.attachedToRight);
            // const object = new Furniture(
            //     furnitureData,
            //     fur.id,
            //     attachedTo,
            //     fur.attachedToLeft,
            //     fur.attachedToRight,
            //     fur.orientation
            // );

            // this.furnitureMap.set(fur.id, object);

            // if (attachedTo != undefined) {
            //     attachedTo.addChild(object);
            // } else {
            //     this.addChild(object);
            // }
            // object.position.set(fur.x, fur.y);
            // object.rotation = fur.rotation;
        }
    }

    public setLabelVisibility(value = true) {
        // for (const wall of this.wallNodeSequence.getWalls()) {
        //     wall.label.visible = value;
        // }
    }

    public getFurniture() {
        // return this.furnitureMap;
    }

    public reset() {
        for (const id of this.furnitureMap.keys()) {
            this.removeFurniture(id);
        }
        this.wallNodeSequence.reset();
        this.furnitureMap = new Map();
    }

    public getWallNodeSequence() {
        return this.wallNodeSequence;
    }

    // public clearScreen() {
    //     for (const child of this.children) {
    //         child.visible = false;
    //     }
    // }

    private shiftCoordinatesToOrigin(lines: any) {
        if (!lines[0]) return [];
        const shiftX = lines[0].a.x;
        const shiftY = lines[0].a.y;
        // Shift all coordinates
        lines.forEach((line: any) => {
            line.a.x = line.a.x - shiftX;
            line.a.y = line.a.y - shiftY;
            line.b.x = line.b.x - shiftX;
            line.b.y = line.b.y - shiftY;
        });
        const minX = Math.min(...lines.map((line: any) => Math.min(line.a.x, line.b.x)));
        const minY = Math.min(...lines.map((line: any) => Math.min(line.a.y, line.b.y)));
        if (minX < 0 || minY < 0) {
            const offsetX = Math.abs(minX);
            const offsetY = Math.abs(minY);
            lines.forEach((line: any) => {
                line.a.x += offsetX;
                line.a.y += offsetY;
                line.b.x += offsetX;
                line.b.y += offsetY;
            });
        }
        return lines;
    }

    public getPlan(for3D = false) {
        const plan = new FloorSerializable();
        const wallNodes = this.wallNodeSequence.getWalls();
        const planNodes = [];

        // FURNITURES
        const serializedFurniture = [];
        for (const furniture of this.furnitureMap.values()) {
            serializedFurniture.push(furniture.serialize());
        }
        plan.furnitureMap = serializedFurniture;

        //    WALLS
        for (const wallNode of wallNodes.values()) {
            const { leftNode, rightNode } = wallNode;

            const planNode: any = {
                a: {
                    x: leftNode.x / 100,
                    y: leftNode.y / 100,
                },
                b: {
                    x: rightNode.x / 100,
                    y: rightNode.y / 100,
                },
                thickness: wallNode.thickness,
            };

            if (for3D) {
                planNode.furnitures = plan.furnitureMap.filter((furniture) => {
                    return furniture.wallUuid === wallNode.uuid;
                }, []);

                planNode.length = wallNode.length;
            }

            planNodes.push(planNode);
        }

        // wall node links
        // @ts-expect-error find why
        plan.wallNodeLinks = Array.from(this.wallNodeSequence.getWallNodeLinks().entries());

        const res = {
            wallNodes: this.shiftCoordinatesToOrigin(planNodes),
        };

        if (for3D) {
        }

        return res;
    }

    public serialize(): FloorSerializable {
        const plan = new FloorSerializable();

        // WALL NODES
        const wallNodes = this.wallNodeSequence.getWallNodes();
        for (const node of wallNodes.values()) {
            plan.wallNodes.push(node.serialize());
        }
        plan.wallNodeLinks = this.wallNodeSequence.getWallNodeLinksWithUuid();

        // plan.wallNodeLinks = Array.from(this.wallNodeSequence.getWallNodeLinks().entries());

        // FURNITURES
        const serializedFurniture = [];

        for (const furniture of this.furnitureMap.values()) {
            serializedFurniture.push(furniture.serialize());
        }
        plan.furnitureMap = serializedFurniture;

        return plan;
    }

    public setFurniturePosition(id: number, x: number, y: number, angle?: number) {
        // this.furnitureMap.get(id.toString())?.position.set(x, y);
        // if (angle) {
        //     this.furnitureMap.get(id).angle = angle;
        // }
    }

    public addFurniture({
        object,
        attachedTo,
        position,
    }: {
        object: Door | WindowElement;
        attachedTo: Wall;
        position: Point;
    }) {
        let elementInstance = null;

        if (object instanceof Door) {
            elementInstance = new Door({
                uuid: object.uuid,
                position,
                parent: attachedTo,
            });
        }

        if (object instanceof WindowElement) {
            elementInstance = new WindowElement({
                uuid: object.uuid,
                position,
                parent: attachedTo,
            });
        }

        if (!elementInstance) throw Error('Element is not Door, nor Window');

        this.furnitureMap.set(object.uuid, elementInstance as unknown as Furniture);

        attachedTo.addChild(elementInstance);
    }

    public removeFurniture(uuid: string) {
        const furniture = this.furnitureMap.get(uuid);

        if (furniture) {
            furniture.parent.removeChild(furniture);
            this.furnitureMap.delete(uuid);
        }
    }

    public getObject(id: number) {
        // return this.furnitureMap.get(id);
    }

    public redrawWalls() {
        this.wallNodeSequence.drawWalls();
    }

    public removeWallNode(nodeId: number) {
        const wallNode = this.wallNodeSequence.getWallNodeById(nodeId);

        if (this.wallNodeSequence.contains(nodeId)) {
            const connectedWalls = this.wallNodeSequence.getWallsByNodesIds([nodeId]);

            if (connectedWalls.length === 2) {
                const [firstWall, secondWall] = connectedWalls;

                // Remove the existing walls
                this.wallNodeSequence.removeWall(firstWall.leftNode.getId(), firstWall.rightNode.getId());
                this.wallNodeSequence.removeWall(secondWall.leftNode.getId(), secondWall.rightNode.getId());

                const leftNodeId =
                    firstWall.rightNode.getId() !== nodeId ? firstWall.rightNode.getId() : firstWall.leftNode.getId();
                const rightNodeId =
                    secondWall.leftNode.getId() !== nodeId ? secondWall.leftNode.getId() : secondWall.rightNode.getId();

                this.wallNodeSequence.addWall(leftNodeId, rightNodeId, { type: firstWall.type });
                wallNode?.parent.removeChild(wallNode);
                return;
            }

            if (!connectedWalls.length) {
                this.wallNodeSequence.removeNode(nodeId);
                wallNode?.parent.removeChild(wallNode);
                return;
            }

            WallNode.showDeleteError();
        }
    }

    public removeWall(wall: Wall) {
        const leftNode = wall.leftNode.getId();
        const rightNode = wall.rightNode.getId();

        for (const child of wall.children) {
            if (child instanceof Door || child instanceof WindowElement) {
                this.removeFurniture(child.uuid);
            }
        }

        if (this.wallNodeSequence.contains(leftNode)) {
            this.wallNodeSequence.removeWall(leftNode, rightNode);
        }
    }

    public addNode(x: number, y: number, id?: number) {
        return this.wallNodeSequence.addNode(x, y, id);
    }

    public addNodeToWall(wall: Wall, coords: Point) {
        const leftNode = wall.leftNode.getId();
        const rightNode = wall.rightNode.getId();

        if (Math.abs(euclideanDistance(coords.x, wall.leftNode.x, coords.y, wall.leftNode.y)) < 0.2 * METER) {
            return;
        }
        if (Math.abs(euclideanDistance(coords.x, wall.rightNode.x, coords.y, wall.rightNode.y)) < 0.2 * METER) {
            return;
        }

        const removedWallSettings = { type: wall.type };

        // delete wall between left and right node
        this.removeWall(wall);

        // add node and connect walls to it
        const newNode = this.wallNodeSequence.addNode(coords.x, coords.y);

        if (!newNode) return newNode;

        const newNodeId = newNode.getId();

        this.wallNodeSequence.addWall(leftNode, newNodeId, removedWallSettings);
        this.wallNodeSequence.addWall(newNodeId, rightNode, removedWallSettings);

        return newNode;
    }
}
