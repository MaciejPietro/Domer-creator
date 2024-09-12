/** handling current tool state, mainly */
import create from 'zustand';
import { AddWallManager } from '../editor/editor/actions/AddWallManager';
import { Tool, ViewMode } from '../editor/editor/constants';

export enum ToolMode {
    FurnitureMode,
    WallMode,
    ViewMode,
}

export interface EditorStore {
    // mode: ToolMode;
    floor: number;
    activeMode: ViewMode;
    activeTool: Tool;
    snap: boolean;
    plan: any;
    app: any;
    setActiveMode: (mode: ViewMode) => void;
    setTool: (tool: Tool) => void;
    setFloor: (floor: number) => void;
    setSnap: (snap: boolean) => void;
    setPlan: (snap: any) => void;
    setApp: (snap: any) => void;
}

export const useStore = create<EditorStore>((set, getState) => ({
    // mode: ToolMode.FurnitureMode,
    activeMode: ViewMode.Edit,
    activeTool: Tool.WallAdd,
    floor: 0,
    snap: false,
    plan: null,
    app: null,
    setActiveMode: (mode: ViewMode) => {
        const shouldResetTool = [ViewMode.View2d, ViewMode.View3d].includes(mode);

        const { activeTool } = getState();

        set(() => ({
            activeMode: mode,
            // activeTool: shouldResetTool ? Tool.None : activeTool,
        }));
    },

    setFloor: (floor: number) => {
        set(() => ({
            floor: floor,
        }));
    },
    setTool: (tool: Tool) => {
        set(() => ({
            activeTool: tool,
        }));
        AddWallManager.Instance.resetTools();
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
