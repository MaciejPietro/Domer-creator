import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { Point } from '@/helpers/Point';
import { Tool } from '@/2d/editor/constants';
import { FocusedElement, useStore } from '@/stores/EditorStore';
import { DeleteFurnitureAction } from '@/2d/editor/actions/DeleteFurnitureAction';
import { v4 as uuidv4 } from 'uuid';
import { WindowElement } from './Window/Window';
import { Door } from './Door/Door';
import { Wall } from '../Walls/Wall';

export type BuildingElementProps = {
    position?: Point;
    uuid?: string;
    parent?: Wall;
};

export const DISTANCE_FROM_WALL = 20;

export abstract class BuildingElement extends Container {
    uuid = uuidv4();
    background: Graphics;
    clickStartTime: number;
    customParent: Wall | undefined;
    length = 0;
    dragStartPosition: Point = { x: 0, y: 0 };
    public isTemporary = false;
    public isValid = false;
    public isFocused = false;
    private isDragging = false;

    constructor(config?: BuildingElementProps) {
        super();

        this.eventMode = 'none';

        if (config?.uuid) this.uuid = config.uuid;
        if (config?.parent) this.customParent = config.parent;

        this.background = new Graphics();

        this.on('pointerover', this.onElementMouseOver);
        this.on('pointerleave', this.onElementMouseLeave);

        this.on('pointerdown', this.onElementMouseDown);
        this.on('pointerup', this.onElementMouseUp);
        this.on('globalpointermove', this.onGlobalMouseMove);

        this.clickStartTime = 0;
    }

    public isCollide() {
        const endX = this.customParent?.length || Infinity;

        const occupiedSpots: Array<{
            start: number;
            end: number;
        }> = [
            { start: DISTANCE_FROM_WALL, end: DISTANCE_FROM_WALL },
            { start: endX - DISTANCE_FROM_WALL, end: endX - DISTANCE_FROM_WALL },
        ];

        for (const child of this.parent.children) {
            if (child instanceof BuildingElement) {
                occupiedSpots.push({ start: child.position.x, end: child.position.x + child.length });
            }
        }

        occupiedSpots.sort((a, b) => a.start - b.start);

        for (const key in occupiedSpots) {
            const current = occupiedSpots[key];
            const next = occupiedSpots[+key + 1];

            if (current.end > next?.start) {
                return true;
            }
        }

        return false;
    }

    private onElementMouseOver(ev: FederatedPointerEvent) {
        if (!this.isDragging) document.body.style.cursor = 'pointer';
    }

    private onElementMouseLeave(ev: FederatedPointerEvent) {
        if (!this.isDragging) document.body.style.cursor = 'default';
    }

    private onElementMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();
        this.isDragging = true;

        this.dragStartPosition = this.toLocal({ x: ev.x, y: ev.y });

        this.dragStartPosition = { x: Math.abs(this.dragStartPosition.x), y: this.dragStartPosition.y };

        this.clickStartTime = Date.now();
    }

    private onElementMouseUp(ev: FederatedPointerEvent) {
        ev.stopPropagation();
        this.isDragging = false;
        this.dragStartPosition = this.toLocal({ x: 0, y: 0 });
        document.body.style.cursor = 'pointer';

        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200) {
            this.onMouseClick();
        }

        return;
    }

    private onGlobalMouseMove(ev: FederatedPointerEvent) {
        if (ev.buttons !== 1 || !this.isFocused || !this.isDragging || this.isTemporary || !this.customParent) return;

        const state = useStore.getState();

        if (state.activeTool !== Tool.Edit) return;

        document.body.style.cursor = 'grabbing';

        const newPos = this.parent.toLocal(ev.global);

        const newX = newPos.x - this.dragStartPosition.x;

        const boundedX = Math.max(0, Math.min(newX, this.customParent.length - this.length));

        const updatedPosition = {
            x: boundedX,
            y: this.position.y,
        };

        const previousPosition = { x: this.position.x, y: this.position.y };

        this.setPosition(updatedPosition);

        if (this.isCollide()) this.setPosition(previousPosition);
    }

    public setPosition({ x, y }: Nullable<Point>) {}

    private onMouseClick() {
        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.Edit:
                state.setFocusedElement(this as any);

                break;

            case Tool.Remove:
                this.delete();
                break;
        }
    }

    public show() {
        this.visible = true;
    }

    public setTemporality(temporary: boolean) {
        if (temporary) {
            this.alpha = 0.5;
        } else {
            this.alpha = 1;
        }
        this.isTemporary = temporary;
        this.eventMode = temporary ? 'none' : 'static';
    }

    public hide() {
        this.visible = false;
    }

    public delete() {
        const action = new DeleteFurnitureAction(this.uuid);

        action.execute();
    }
}
