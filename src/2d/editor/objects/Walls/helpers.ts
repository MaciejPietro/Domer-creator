import { DEFAULT_WALL_TYPE, WALL_THICKNESS } from './constants';
import { WallType } from './types';

export const getDefaultSettings = () => {
    const type: WallType = DEFAULT_WALL_TYPE;
    const thickness = WALL_THICKNESS;

    return {
        type,
        thickness,
    };
};

export const normalizeAngle = (angle: number) => (angle >= 180 ? angle - 180 : angle);
