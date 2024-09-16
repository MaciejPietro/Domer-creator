import { BorderHorizontal, BorderInner, BorderLeft } from 'tabler-icons-react';

export enum WallType {
    Exterior,
    LoadBearing,
    Partition,
}

export type WallConfig = {
    label: string;
    thickness: number;
    type: WallType;
};

export const wallTypeConfig = Object.freeze({
    [WallType.Exterior]: {
        type: WallType.Exterior,
        label: 'Zewnętrzna',
        thickness: 40,
        icon: BorderLeft,
    },
    [WallType.LoadBearing]: {
        type: WallType.LoadBearing,
        label: 'Nośna',
        thickness: 20,
        icon: BorderHorizontal,
    },
    [WallType.Partition]: {
        type: WallType.Partition,
        label: 'Działowa',
        thickness: 10,
        icon: BorderInner,
    },
});
