import { useStore } from '@/stores/EditorStore';
import { DEFAULT_WALL_TYPE } from './Wall';
import { wallTypeConfig } from './config';

export const getDefaultSettings = () => {
    const state = useStore.getState();

    const type = state.activeToolSettings?.wallType || DEFAULT_WALL_TYPE;

    // @ts-expect-error type store properly
    const thickness = wallTypeConfig[type].thickness;

    return {
        type,
        thickness,
    };
};

export const normalizeAngle = (angle: number) => (angle >= 180 ? angle - 180 : angle);
