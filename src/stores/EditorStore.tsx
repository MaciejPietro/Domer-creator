import { create } from 'zustand';
import { AddWallManager } from '../2d/editor/actions/AddWallManager';
import { Tool, ViewMode } from '../2d/editor/constants';
import { WallNode } from '@/2d/editor/objects/Walls/WallNode';

export enum ToolMode {
    FurnitureMode,
    WallMode,
    ViewMode,
}

type FocusedElement = null | WallNode;

export interface EditorStore {
    // mode: ToolMode;
    floor: number;
    activeMode: ViewMode;
    activeTool: Tool;
    snap: boolean;
    plan: any;
    app: any;
    focusedElement: FocusedElement;
    setActiveMode: (mode: ViewMode) => void;
    setTool: (tool: Tool) => void;
    setFloor: (floor: number) => void;
    setSnap: (snap: boolean) => void;
    setPlan: (snap: any) => void;
    setApp: (snap: any) => void;
    setFocusedElement: (element: FocusedElement) => void;
}

export const useStore = create<EditorStore>((set, getState) => ({
    // mode: ToolMode.FurnitureMode,
    activeMode: ViewMode.Edit,
    activeTool: Tool.WallAdd,
    floor: 0,
    snap: false,
    plan: null,
    app: null,
    focusedElement: null,
    setFocusedElement: (element: FocusedElement) => {
        set(() => ({
            focusedElement: element,
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
