import { Container, FederatedPointerEvent, Graphics, Sprite, Texture } from 'pixi.js';
import { useStore } from '@/stores/EditorStore';
import { Tool } from '@/2d/editor/enums';

const FOCUS_BORDER_COLOR = '#1C7ED6';
const FOCUS_BORDER_WIDTH = 3;
const SCALE_REFERENCE_WIDTH = 729;

export class PlanSprite extends Container {
    private sprite: Sprite;
    private border: Graphics;
    private isDragging = false;
    private dragOffset = { x: 0, y: 0 };
    private unsubscribe: () => void;
    public isFocused = false;

    private scaleRealPx = 0;
    private scalePlanCm = 0;
    private naturalWidth = 0;
    private naturalHeight = 0;

    constructor(texture: Texture) {
        super();

        this.sprite = new Sprite(texture);
        this.addChild(this.sprite);

        this.border = new Graphics();
        this.addChild(this.border);

        this.eventMode = 'static';

        this.on('pointerdown', this.onPointerDown);
        this.on('globalpointermove', this.onPointerMove);
        this.on('pointerup', this.onPointerUp);
        this.on('pointerupoutside', this.onPointerUp);

        this.unsubscribe = this.watchStoreChanges();
    }

    public get spriteRef(): Sprite {
        return this.sprite;
    }

    public setDimensions(width: number, height: number) {
        this.sprite.width = width;
        this.sprite.height = height;
    }

    public setScaleParams(realPx: number, planCm: number, natWidth: number, natHeight: number) {
        this.scaleRealPx = realPx;
        this.scalePlanCm = planCm;
        this.naturalWidth = natWidth;
        this.naturalHeight = natHeight;
    }

    public getScalePlanCm(): number {
        return this.scalePlanCm;
    }

    public updateScaleFromPlanCm(planCm: number) {
        if (this.scaleRealPx <= 0) return;
        this.scalePlanCm = planCm;
        const displayW = (SCALE_REFERENCE_WIDTH * planCm) / this.scaleRealPx;
        const displayH = displayW * (this.naturalHeight / this.naturalWidth);
        this.setDimensions(displayW, displayH);
        this.drawBorder();
    }

    private watchStoreChanges(): () => void {
        return useStore.subscribe((state) => {
            if (state.focusedElement !== this && this.isFocused) {
                this.blur();
            }
        });
    }

    private drawBorder() {
        this.border.clear();

        if (!this.isFocused) return;

        const w = this.sprite.width;
        const h = this.sprite.height;

        this.border.rect(0, 0, w, h).stroke({ width: FOCUS_BORDER_WIDTH, color: FOCUS_BORDER_COLOR });
    }

    private onPointerDown(ev: FederatedPointerEvent) {
        const state = useStore.getState();

        // Let events pass through for tools that need to work through the plan
        if (state.activeTool === Tool.WallAdd || state.activeTool === Tool.Measure) {
            return;
        }

        if (!this.isFocused) {
            ev.stopPropagation();
            return;
        }

        if (state.activeTool !== Tool.Edit) return;

        ev.stopPropagation();

        this.isDragging = true;

        const localPos = this.parent.toLocal(ev.global);
        this.dragOffset.x = localPos.x - this.x;
        this.dragOffset.y = localPos.y - this.y;

        document.body.style.cursor = 'grabbing';
    }

    private onPointerMove(ev: FederatedPointerEvent) {
        if (!this.isDragging || !this.isFocused) return;

        const newPos = this.parent.toLocal(ev.global);

        this.x = newPos.x - this.dragOffset.x;
        this.y = newPos.y - this.dragOffset.y;
    }

    private onPointerUp() {
        if (!this.isDragging) return;

        this.isDragging = false;
        document.body.style.cursor = this.isFocused ? 'grab' : 'default';
    }

    public focus() {
        this.isFocused = true;
        this.cursor = 'grab';
        this.drawBorder();
    }

    public blur() {
        this.isFocused = false;
        this.isDragging = false;
        this.cursor = 'default';
        this.drawBorder();
    }

    public override destroy(options?: any): void {
        this.unsubscribe();
        super.destroy(options);
    }
}
