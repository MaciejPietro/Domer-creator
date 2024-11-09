import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { Point } from '@/helpers/Point';
import { Tool } from '@/2d/editor/constants';
import { useStore } from '@/stores/EditorStore';
import { DeleteFurnitureAction } from '@/2d/editor/actions/DeleteFurnitureAction';
import { v4 as uuidv4 } from 'uuid';
import { Door } from './Door/Door';
import { Wall } from '../Walls/Wall';

export type BuildingElementProps = {
    position?: Point;
    uuid?: string;
    parent?: Wall;
};

export class BuildingElement extends Container {
    uuid = uuidv4();
    background: Graphics;
    clickStartTime: number;
    customParent: Wall | undefined;
    public isTemporary = false;
    public isValid = false;

    constructor(config?: BuildingElementProps) {
        super();

        this.eventMode = 'none';

        if (config?.uuid) this.uuid = config.uuid;
        if (config?.parent) this.customParent = config.parent;

        this.background = new Graphics();

        this.watchStoreChanges();

        this.on('pointerdown', this.onElementMouseDown);
        this.on('pointerup', this.onElementMouseUp);

        this.clickStartTime = 0;
    }

    private watchStoreChanges() {
        useStore.subscribe(() => {
            this.onStoreChange();
        });
    }

    protected onStoreChange() {}

    protected isCollide() {
        const occupiedSpots: Array<{
            start: number;
            end: number;
        }> = [];

        for (const child of this.parent.children) {
            if (child instanceof Door) {
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

    private onElementMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        this.clickStartTime = Date.now();
    }

    private onElementMouseUp(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        const clickDuration = Date.now() - this.clickStartTime;

        if (clickDuration < 200) {
            this.onMouseClick();
        }

        return;
    }

    private onMouseClick() {
        const state = useStore.getState();

        switch (state.activeTool) {
            case Tool.Edit:
                state.setFocusedElement(this as any);

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
