import { IViewportOptions, PluginManager, Viewport } from 'pixi-viewport';

import { Application, Container, FederatedPointerEvent, Point } from 'pixi.js';
import { FloorPlan } from './objects/FloorPlan';
import { TransformLayer } from './objects/TransformControls/TransformLayer';
import { useStore } from '../../stores/EditorStore';
import { AddNodeAction } from './actions/AddNodeAction';
import { AddWallManager } from './actions/AddWallManager';
import { viewportX, viewportY } from '../../helpers/ViewportCoordinates';
import { Tool, ViewMode } from './constants';
import { Pointer } from './Pointer';
import { Preview } from './actions/MeasureToolManager';

import 'pixi.js/events';
import { LoadAction } from './actions/LoadAction';
import { Grid } from './basic/Grid';
import plan from './plan.json';
// import plan from './plan-empty.json';
import { WallNodeSequence } from './objects/Walls/WallNodeSequence';

export class Main extends Viewport {
    private floorPlan: FloorPlan;
    public static viewportPluginManager: PluginManager;
    public static app: Application;
    transformLayer: TransformLayer;
    addWallManager: AddWallManager;
    grid: Container;
    public pointer: Pointer;
    public preview: Preview;
    constructor(options: IViewportOptions) {
        super(options);

        this.setup();

        this.preview = new Preview({});
        this.addChild(this.preview.getReference());

        // this.cursor = 'none';
    }

    private async setup() {
        Main.viewportPluginManager = this.plugins;
        this.drag({ mouseButtons: 'right' })
            .clamp({ direction: 'all' })
            .pinch()
            .wheel()
            .decelerate()
            .clampZoom({ minScale: 0.5, maxScale: 6 });

        this.center = new Point(this.worldWidth / 2, this.worldHeight / 2);

        const planContainer = new Container();

        this.addChildAt(planContainer, 0);

        this.grid = new Grid(this.worldWidth, this.worldHeight);
        this.addChild(this.grid);

        this.floorPlan = FloorPlan.Instance;
        this.addChild(this.floorPlan);

        this.transformLayer = TransformLayer.Instance;
        this.addChild(this.transformLayer);

        this.addWallManager = AddWallManager.Instance;
        const wallManagerReference = this.addWallManager.preview.getReference();

        this.addChild(wallManagerReference);

        this.pointer = new Pointer();

        this.addChild(this.pointer);

        this.on('pointerdown', this.onMouseDown);
        this.on('pointermove', this.updatePreview);
        this.on('pointerup', this.onPointerUp);

        this.loadMockupPlan();
    }
    private onMouseDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        const isLeftMouseButton = ev.button === 0;

        if (isLeftMouseButton && ev.target === this) {
            const state = useStore.getState();

            this.floorPlan.children.forEach((floorPlan) => {
                floorPlan.children.forEach((child) => {
                    if (child instanceof WallNodeSequence) {
                        child.blurAllElements();
                    }
                });
            });

            state.setFocusedElement(null);
        }

        this.checkTools(ev);
    }
    private onPointerUp(ev: FederatedPointerEvent) {
        document.body.style.cursor = 'default';

        this.updateEnd(ev);
    }

    private updatePreview(ev: FederatedPointerEvent) {
        this.addWallManager.updatePreview(ev);
        this.preview.updatePreview(ev);
        this.pointer.update(ev);

        switch (useStore.getState().activeTool) {
            case Tool.WallAdd:
                this.pointer.alpha = 1;
                break;

            default:
                this.pointer.alpha = 0;
        }
    }
    private updateEnd(ev: FederatedPointerEvent) {
        switch (useStore.getState().activeTool) {
            case Tool.Measure:
                this.preview.setA(undefined);
                // this.pause = false;
                break;
            case Tool.WallAdd:
                // if (!isMobile) {
                //     this.pause = false;
                // }

                break;
            case Tool.Edit:
                // this.pause = false;
                break;
        }
    }

    private checkTools(ev: FederatedPointerEvent) {
        if (ev.button === 2) return;

        const point = {
            x: viewportX(ev.global.x),
            y: viewportY(ev.global.y),
        };

        switch (useStore.getState().activeTool) {
            case Tool.WallAdd:
                // const activeMode = useStore.getState().activeMode;

                // if (activeMode !== ViewMode.Edit) return;
                // this.pause = true;

                const action = new AddNodeAction(undefined, point);

                action.execute();
                break;
            case Tool.Edit:
                // if (!isMobile) {
                //     this.pause = true;
                // }
                break;
            case Tool.Measure:
                // this.pause = true;

                this.preview.setA(point);
                break;
        }
    }

    private loadMockupPlan() {
        const action = new LoadAction(JSON.stringify(plan));

        action.execute();
    }
}

const save = () => {
    // let data = FloorPlan.Instance.save();
    // localStorage.setItem('autosave', data);
};
// setInterval(autosave, 60000)

const setSnap = useStore.getState().setSnap;

document.onkeydown = (e) => {
    // if (e.code == 'KeyS' && e.ctrlKey) {
    //     e.preventDefault();
    //     save();
    //     showNotification({
    //         message: 'Saved to Local Storage!',
    //         color: 'green',
    //         icon: DeviceFloppy as any,
    //     });
    // }

    if (e.key === 'Control') {
        setSnap(false);
    }

    if (e.key === 'Escape') {
        const { activeMode, setTool, activeTool } = useStore.getState();

        if (activeMode === ViewMode.Edit) {
            setTool(Tool.None);
            setTool(activeTool);
        }
    }
};
