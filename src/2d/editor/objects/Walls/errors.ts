import { notifications } from '@mantine/notifications';
import { MIN_WALL_LENGTH } from './Wall';

export const showMinLengthError = () => {
    notifications.show({
        id: 'wall-min-length',
        title: 'Długość ściany',
        message: `Minimalna długość ściany to ${MIN_WALL_LENGTH} cm.`,
        color: 'red',
    });
};

export const showCollisionError = () => {
    notifications.show({
        id: 'wall-collision',
        title: 'Długość ściany',
        message: `Nie można zmienić długości ściany, ponieważ elementy zajmują miejsce.`,
        color: 'red',
    });
};
