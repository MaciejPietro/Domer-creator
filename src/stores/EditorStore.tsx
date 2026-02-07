import { create } from 'zustand';
import { AddWallManager } from '../2d/editor/actions/AddWallManager';
import { AddPlotManager } from '../2d/editor/actions/AddPlotManager';
import { Tool, ViewMode } from '../2d/editor/constants';
import { WallNode } from '@/2d/editor/objects/Walls/WallNode';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import { Door } from '@/2d/editor/objects/Furnitures/Door/Door';
import { WindowElement } from '@/2d/editor/objects/Furnitures/Window/Window';
import { PlanSprite } from '@/2d/editor/objects/Plan/PlanSprite';

export enum ToolMode {
    FurnitureMode,
    WallMode,
    ViewMode,
}

export type FocusedElement = null | WallNode | Wall | Door | WindowElement | PlanSprite;

export interface EditorStore {
    // mode: ToolMode;
    floor: number;
    activeMode: ViewMode;
    activeTool: Tool;
    activeToolSettings: any;
    helpMode: boolean;
    snap: boolean;
    plan: PlanSprite | null;
    app: any;
    focusedElement: FocusedElement;
    setHelpMode: (isActive: boolean) => void;
    setActiveMode: (mode: ViewMode) => void;
    setTool: (tool: Tool) => void;
    setToolSettings: (settings: any) => void;
    setSnap: (snap: boolean) => void;
    setPlan: (plan: PlanSprite | null) => void;
    setApp: (app: any) => void;
    setFocusedElement: (element: FocusedElement) => void;
    refreshFocusedElement: () => void;
}

export const useStore = create<EditorStore>((set, getState) => ({
    // mode: ToolMode.FurnitureMode,
    activeMode: ViewMode.Edit,
    activeTool: Tool.Edit,
    activeToolSettings: {},
    helpMode: false,
    floor: 0,
    snap: false,
    plan: null,
    app: null,
    focusedElement: null,
    refreshFocusedElement: () => {
        set(({ focusedElement }) => ({
            focusedElement,
        }));
    },
    setFocusedElement: (element: FocusedElement) => {
        set(() => {
            return {
                focusedElement: element,
            };
        });
    },
    setHelpMode: (isActive: boolean) => {
        set(() => ({
            helpMode: isActive,
        }));
    },
    setFloor: (floor: number) => {
        set(() => ({
            floor,
        }));
    },
    setActiveMode: (mode: ViewMode) => {
        set(() => ({
            activeMode: mode,
        }));
    },
    setTool: (tool: Tool) => {
        set((state) => {
            if (state.focusedElement instanceof Wall) {
                state.focusedElement.blur();
            }

            if (state.focusedElement instanceof PlanSprite) {
                state.focusedElement.blur();
            }

            return {
                activeTool: tool,
                focusedElement: null,
            };
        });
        AddWallManager.Instance.resetTools();
        AddPlotManager.Instance.resetTools();
    },
    setToolSettings: (settings: any) => {
        set(() => ({
            activeToolSettings: settings,
        }));
    },
    setSnap: (snap: boolean) => {
        set(() => ({
            snap: snap,
        }));
    },
    setPlan: (plan: any) => {
        set(() => ({
            plan,
        }));
    },
    setApp: (app: any) => {
        set(() => ({
            app,
        }));
    },
}));
