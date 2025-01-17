import { create } from 'zustand';
import { AddWallManager } from '../2d/editor/actions/AddWallManager';
import { Tool, ViewMode } from '../2d/editor/constants';
import { WallNode } from '@/2d/editor/objects/Walls/WallNode';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import { Door } from '@/2d/editor/objects/Furnitures/Door/Door';
import { WindowElement } from '@/2d/editor/objects/Furnitures/Window/Window';

export enum ToolMode {
    FurnitureMode,
    WallMode,
    ViewMode,
}

export type FocusedElement = null | WallNode | Wall | Door | WindowElement;

export interface EditorStore {
    // mode: ToolMode;
    floor: number;
    activeMode: ViewMode;
    activeTool: Tool;
    activeToolSettings: any;
    helpMode: boolean;
    snap: boolean;
    plan: any;
    app: any;
    focusedElement: FocusedElement;
    setHelpMode: (isActive: boolean) => void;
    setActiveMode: (mode: ViewMode) => void;
    setTool: (tool: Tool) => void;
    setToolSettings: (settings: any) => void;
    setFloor: (floor: number) => void;
    setSnap: (snap: boolean) => void;
    setPlan: (snap: any) => void;
    setApp: (snap: any) => void;
    setFocusedElement: (element: FocusedElement) => void;
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
        set(() => ({
            activeTool: tool,
            focusedElement: null,
        }));
        AddWallManager.Instance.resetTools();
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
