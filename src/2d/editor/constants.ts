// how many pixels is a meter
export const METER = 100;
export const WALL_INSULATION_THICKNESS = 0.2 * METER;
export const WALL_BLOCK_THICKNESS = 0.2 * METER;

export const WALL_THICKNESS = WALL_INSULATION_THICKNESS + WALL_BLOCK_THICKNESS;
export const INTERIOR_WALL_THICKNESS = 0.16 * METER;

export const WALL_NODE_THICKNESS = 0.15 * METER;

export const LABEL_OFFSET = 10;

export enum Modes {
    Idle,
    Dragging,
    Editing,
}

export enum Coord {
    NE,
    E,
    SE,
    S,
    C,
    Horizontal,
    Vertical,
}

export enum LabelAxis {
    Horizontal,
    Vertical,
}

export enum ToolMode {
    WallMode,
    FurnitureMode,
    ViewMode,
}

export enum Tool {
    None,
    WallAdd,
    FurnitureAdd,
    Edit,
    Remove,
    Measure,
    FurnitureAddWindow,
    FurnitureAddDoor,
}

export enum ViewMode {
    Edit,
    View2d,
    View3d,
}
