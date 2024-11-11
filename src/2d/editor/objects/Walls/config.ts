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
        zIndex: 14,
    },
    [WallType.LoadBearing]: {
        type: WallType.LoadBearing,
        label: 'Nośna',
        thickness: 25,
        icon: BorderHorizontal,
        zIndex: 12,
    },
    [WallType.Partition]: {
        type: WallType.Partition,
        label: 'Działowa',
        thickness: 15,
        icon: BorderInner,
        zIndex: 10,
    },
});
