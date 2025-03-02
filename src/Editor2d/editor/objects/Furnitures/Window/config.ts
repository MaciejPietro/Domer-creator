export const enum WindowType {
    Fixed,
    Casement,
    Single,
}

export type WindowTypeObject = {
    type: WindowType;
    label: string;
};

export type WindowWidthObject = {
    width: number;
    label: string;
};

export const windowTypeConfig = Object.freeze({
    [WindowType.Single]: {
        type: WindowType.Single,
        label: 'Jednoskrzydłowe',
    },
    [WindowType.Casement]: {
        type: WindowType.Casement,
        label: 'Dwuskrzydłowe',
    },
    [WindowType.Fixed]: {
        type: WindowType.Fixed,
        label: 'Fix',
    },
});
