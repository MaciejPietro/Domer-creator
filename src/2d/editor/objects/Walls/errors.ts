import { notifications } from '@mantine/notifications';
import { MIN_WALL_LENGTH } from './constants';

export const showMinLengthError = () => {
    notifications.show({
        id: 'wall-min-length',
        message: `Minimalna długość ściany to ${MIN_WALL_LENGTH} cm.`,
        color: 'red',
    });
};

export const showCollisionError = () => {
    notifications.show({
        id: 'wall-collision',
        title: 'Nie można zmienić długości ściany',
        message: `Niektóre elementy są zbyt blisko krawędzi ściany.`,
        color: 'red',
    });
};

export const showCannotDivideWallError = () => {
    notifications.show({
        id: 'wall-cannot-divide',
        // title: 'Nie można podzielić ściany',
        message: 'Nie można podzielić ściany na której znajdują się inne elementy.',
        color: 'red',
    });
};

export const showAngleError = () => {
    notifications.show({
        id: 'wall-angle',
        message: 'Kąt między ścianami jest mniejszy niż 30 stopni.',
        color: 'red',
    });
};
