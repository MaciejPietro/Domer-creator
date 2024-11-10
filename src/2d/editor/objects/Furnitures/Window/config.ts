export const enum WindowType {
    Fixed,
    Casement,
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
    [WindowType.Casement]: {
        type: WindowType.Casement,
        label: 'Dwuskrzydłowe',
    },
    [WindowType.Fixed]: {
        type: WindowType.Fixed,
        label: 'Fix',
    },
});
