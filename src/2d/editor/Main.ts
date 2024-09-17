import { IViewportOptions, PluginManager, Viewport } from 'pixi-viewport';

import {
    Application,
    Assets,
    Container,
    FederatedPointerEvent,
    isMobile,
    Loader,
    Point,
    TilingSprite,
    SCALE_MODES,
} from 'pixi.js';
import { FloorPlan } from './objects/FloorPlan';
import { TransformLayer } from './objects/TransformControls/TransformLayer';
import { useStore } from '../../stores/EditorStore';
import { AddNodeAction } from './actions/AddNodeAction';
import { AddWallManager } from './actions/AddWallManager';
import { viewportX, viewportY } from '../../helpers/ViewportCoordinates';
import { Tool, ToolMode, ViewMode } from './constants';
import { Pointer } from './Pointer';
import { Preview } from './actions/MeasureToolManager';
import { showNotification } from '@mantine/notifications';
import { DeviceFloppy } from 'tabler-icons-react';
import backgroundPattern from '../../assets/pattern.svg';

import 'pixi.js/events';
import { LoadAction } from './actions/LoadAction';

export class Main extends Viewport {
    private floorPlan: FloorPlan;
    public static viewportPluginManager: PluginManager;
    public static app: Application;
    transformLayer: TransformLayer;
    addWallManager: AddWallManager;
    bkgPattern: TilingSprite;
    public pointer: Pointer;
    public preview: Preview;
    constructor(options: IViewportOptions) {
        super(options);

        // connect the events
        // Loader.shared.onComplete.once(this.setup, this);
        // // Start loading!
        // Loader.shared.load();
        this.loadAssets().then(() => {
            this.setup.call(this);
        });
        this.preview = new Preview({});
        this.addChild(this.preview.getReference());

        // this.cursor = 'none';
    }

    private async loadAssets() {
        const backgroundPatternTexture = await Assets.load(backgroundPattern);
        // backgroundPatternTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        this.bkgPattern = new TilingSprite({
            texture: backgroundPatternTexture,
            width: this.worldWidth ?? 0,
            height: this.worldHeight ?? 0,
        });
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

        this.addChild(this.bkgPattern);

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

        // if (ev.button === 2) {
        //     this.pointer.setCursor('grab');

        //     return;
        // }

        this.checkTools(ev);
    }
    private onPointerUp(ev: FederatedPointerEvent) {
        // if (ev.button === 2) {
        //     this.pointer.setCursor('default');

        //     return;
        // }

        this.updateEnd(ev);
    }

    private updatePreview(ev: FederatedPointerEvent) {
        this.addWallManager.updatePreview(ev);
        this.preview.updatePreview(ev);
        this.pointer.update(ev);
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
        const action = new LoadAction(`
                     {"floors":[{"furnitureArray":[],"wallNodes":[{"id":1,"x":2327.4000237816417,"y":2164.4000091552734},{"id":2,"x":2327,"y":2743}],"wallNodeLinks":[[1,[2]],[2,[]],[3,[]],[4,[]],[5,[]]]}],"furnitureId":0,"wallNodeId":5}`);

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

document.onkeyup = (e) => {
    const setSnap = useStore.getState().setSnap;

    if (e.key === 'Control') {
        setSnap(true);
    }
};
