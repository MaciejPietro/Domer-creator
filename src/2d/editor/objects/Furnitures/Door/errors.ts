import { notifications } from '@mantine/notifications';

export const showCannotChangeWidthError = () => {
    notifications.show({
        title: '🚪 Nie można zmienić szerokości',
        message: 'Elementy na ścianie nie mogą nachodzić na siebie',
        color: 'red',
    });
};
