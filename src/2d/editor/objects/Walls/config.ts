export enum WallType {
    External,
    LoadBearing,
    Partition,
}

export type WallConfig = {
    label: string;
    width: number;
};

export const wallTypeConfig = Object.freeze({
    [WallType.External]: {
        label: 'Zewnętrzna',
        width: 40,
    },
    [WallType.LoadBearing]: {
        label: 'Nośna',
        width: 20,
    },
    [WallType.Partition]: {
        label: 'Działowa',
        width: 10,
    },
});
