export const enum DoorType {
    Left,
    Right,
}

export type DoorWidth = 70 | 80 | 90 | 100 | 120;

export type DoorTypeObject = {
    type: DoorType;
    label: string;
};

export type DoorWidthObject = {
    width: number;
    label: string;
};

export const doorTypeConfig = Object.freeze({
    [DoorType.Left]: {
        type: DoorType.Left,
        label: 'Lewe',
    },
    [DoorType.Right]: {
        type: DoorType.Right,
        label: 'Prawe',
    },
});

export const doorWidthConfig: Record<DoorWidth, DoorWidthObject> = Object.freeze({
    70: {
        width: 70,
        label: '70cm',
    },
    80: {
        width: 80,
        label: '80cm',
    },
    90: {
        width: 90,
        label: '90cm',
    },
    100: {
        width: 100,
        label: '100cm',
    },
    120: {
        width: 120,
        label: '120cm',
    },
});

export enum DoorOrientation {
    West,
    East,
}

export type DoorOrientationObject = {
    type: DoorOrientation;
    label: string;
};

export const doorOrientationConfig = Object.freeze({
    [DoorOrientation.West]: {
        type: DoorOrientation.West,
        label: 'Na zewnątrz',
    },
    [DoorOrientation.East]: {
        type: DoorOrientation.East,
        label: 'Do wewnątrz',
    },
});
