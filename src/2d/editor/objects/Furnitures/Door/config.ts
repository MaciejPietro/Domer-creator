export enum DoorType {
    Left,
    Right,
}

export type DoorTypeObject = {
    type: DoorType;
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
        label: 'Normalne',
    },
    [DoorOrientation.East]: {
        type: DoorOrientation.East,
        label: 'Odbite',
    },
});
