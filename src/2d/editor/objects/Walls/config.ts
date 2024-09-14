export enum WallType {
    External,
    LoadBearing,
    Partition,
}

const wallTypeConfig = {
    [WallType.External]: {
        width: 40,
    },
    [WallType.LoadBearing]: {
        width: 20,
    },
    [WallType.Partition]: {
        width: 10,
    },
};
