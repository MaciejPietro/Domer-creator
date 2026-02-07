import { Container, Graphics } from 'pixi.js';
import { PlotNode } from './PlotNode';
import { PlotEdge } from './PlotEdge';
import { PLOT_FILL_COLOR, PLOT_FILL_ALPHA, PLOT_Z_INDEX } from './constants';

export interface PlotNodeSerializable {
    id: number;
    x: number;
    y: number;
}

export interface PlotSerializable {
    nodes: PlotNodeSerializable[];
    edges: Array<{ leftNodeId: number; rightNodeId: number }>;
}

export class Plot extends Container {
    private nodes: Map<number, PlotNode> = new Map();
    private edges: PlotEdge[] = [];
    private nodeLinks: Map<number, number[]> = new Map();
    private static nodeId = 0;
    private fillGraphics: Graphics;

    constructor() {
        super();
        this.sortableChildren = true;
        this.zIndex = PLOT_Z_INDEX;
        this.eventMode = 'passive'; // Allow events to pass through to children but don't block

        this.fillGraphics = new Graphics();
        this.fillGraphics.zIndex = 0;
        this.fillGraphics.eventMode = 'none'; // Don't block interactions with elements underneath
        this.addChild(this.fillGraphics);
    }

    public getNewNodeId() {
        Plot.nodeId += 1;
        return Plot.nodeId;
    }

    public getNodes() {
        return this.nodes;
    }

    public getEdges() {
        return this.edges;
    }

    public addNode(x: number, y: number, id?: number) {
        const nodeId = id || this.getNewNodeId();

        const node = new PlotNode(x, y, nodeId);
        this.nodes.set(nodeId, node);
        this.nodeLinks.set(nodeId, []);
        this.addChild(node);

        return node;
    }

    public removeNode(nodeId: number) {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        // Remove all edges connected to this node
        const edgesToRemove = this.edges.filter(
            (edge) => edge.leftNode.getId() === nodeId || edge.rightNode.getId() === nodeId
        );

        for (const edge of edgesToRemove) {
            this.removeEdgeObject(edge);
        }

        // Remove the node
        this.removeChild(node);
        node.destroy();
        this.nodes.delete(nodeId);
        this.nodeLinks.delete(nodeId);

        this.drawFill();
    }

    public addEdge(leftNodeId: number, rightNodeId: number) {
        if (leftNodeId === rightNodeId) return;

        // Check if edge already exists
        const existingEdge = this.edges.find(
            (edge) =>
                (edge.leftNode.getId() === leftNodeId && edge.rightNode.getId() === rightNodeId) ||
                (edge.leftNode.getId() === rightNodeId && edge.rightNode.getId() === leftNodeId)
        );

        if (existingEdge) return;

        const leftNode = this.nodes.get(leftNodeId);
        const rightNode = this.nodes.get(rightNodeId);

        if (!leftNode || !rightNode) return;

        const edge = new PlotEdge(leftNode, rightNode);
        this.edges.push(edge);
        this.addChild(edge);

        // Update links
        if (!this.nodeLinks.get(leftNodeId)?.includes(rightNodeId)) {
            this.nodeLinks.get(leftNodeId)?.push(rightNodeId);
        }
        if (!this.nodeLinks.get(rightNodeId)?.includes(leftNodeId)) {
            this.nodeLinks.get(rightNodeId)?.push(leftNodeId);
        }

        this.drawFill();

        return edge;
    }

    public removeEdge(leftNodeId: number, rightNodeId: number) {
        const edgeIndex = this.edges.findIndex(
            (edge) =>
                (edge.leftNode.getId() === leftNodeId && edge.rightNode.getId() === rightNodeId) ||
                (edge.leftNode.getId() === rightNodeId && edge.rightNode.getId() === leftNodeId)
        );

        if (edgeIndex === -1) return;

        const edge = this.edges[edgeIndex];
        this.removeEdgeObject(edge);

        // Update links
        const leftLinks = this.nodeLinks.get(leftNodeId);
        if (leftLinks) {
            const idx = leftLinks.indexOf(rightNodeId);
            if (idx !== -1) leftLinks.splice(idx, 1);
        }

        const rightLinks = this.nodeLinks.get(rightNodeId);
        if (rightLinks) {
            const idx = rightLinks.indexOf(leftNodeId);
            if (idx !== -1) rightLinks.splice(idx, 1);
        }

        this.drawFill();
    }

    private removeEdgeObject(edge: PlotEdge) {
        const index = this.edges.indexOf(edge);
        if (index !== -1) {
            this.edges.splice(index, 1);
        }
        this.removeChild(edge);
        edge.destroy();
    }

    public drawEdges() {
        for (const edge of this.edges) {
            edge.draw();
        }
        this.drawFill();
    }

    private drawFill() {
        this.fillGraphics.clear();

        // Only draw fill if we have a closed polygon (at least 3 nodes forming a cycle)
        if (this.nodes.size < 3) return;

        const orderedNodes = this.getOrderedPolygonNodes();
        if (orderedNodes.length < 3) return;

        const points: number[] = [];
        for (const node of orderedNodes) {
            points.push(node.x, node.y);
        }

        this.fillGraphics.poly(points);
        this.fillGraphics.fill({ color: PLOT_FILL_COLOR, alpha: PLOT_FILL_ALPHA });
    }

    private getOrderedPolygonNodes(): PlotNode[] {
        if (this.nodes.size < 3) return [];

        // Find nodes that form a closed polygon by following edges
        const visited = new Set<number>();
        const ordered: PlotNode[] = [];

        // Start from the first node
        const firstNode = this.nodes.values().next().value;
        if (!firstNode) return [];

        let currentNode = firstNode;
        visited.add(currentNode.getId());
        ordered.push(currentNode);

        while (true) {
            const links = this.nodeLinks.get(currentNode.getId()) || [];
            let nextNodeId: number | null = null;

            for (const linkedId of links) {
                if (!visited.has(linkedId)) {
                    nextNodeId = linkedId;
                    break;
                }
            }

            if (nextNodeId === null) {
                // Check if we can close the polygon
                if (links.includes(firstNode.getId()) && ordered.length >= 3) {
                    break; // Closed polygon
                }
                break;
            }

            const nextNode = this.nodes.get(nextNodeId);
            if (!nextNode) break;

            visited.add(nextNodeId);
            ordered.push(nextNode);
            currentNode = nextNode;
        }

        return ordered;
    }

    public reset() {
        for (const node of this.nodes.values()) {
            this.removeChild(node);
            node.destroy();
        }
        this.nodes.clear();

        for (const edge of this.edges) {
            this.removeChild(edge);
            edge.destroy();
        }
        this.edges = [];

        this.nodeLinks.clear();
        this.fillGraphics.clear();

        Plot.nodeId = 0;
    }

    public load(data: PlotSerializable) {
        this.reset();

        const maxId = Math.max(...data.nodes.map((n) => n.id), 0);

        for (const nodeData of data.nodes) {
            this.addNode(nodeData.x, nodeData.y, nodeData.id);
        }

        for (const edgeData of data.edges) {
            this.addEdge(edgeData.leftNodeId, edgeData.rightNodeId);
        }

        Plot.nodeId = maxId;
    }

    public serialize(): PlotSerializable {
        const nodes: PlotNodeSerializable[] = [];
        for (const node of this.nodes.values()) {
            nodes.push(node.serialize());
        }

        const edges: Array<{ leftNodeId: number; rightNodeId: number }> = [];
        for (const edge of this.edges) {
            edges.push(edge.serialize());
        }

        return { nodes, edges };
    }

    public isEmpty() {
        return this.nodes.size === 0;
    }
}
