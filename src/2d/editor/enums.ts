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
    PlotAdd,
}

export enum ViewMode {
    Edit,
    View2d,
    View3d,
}
