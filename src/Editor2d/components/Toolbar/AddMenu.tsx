import { Armchair, BorderLeft, Window, Door, BorderInner, BorderHorizontal } from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';

import { Tool } from '@/Editor2d/editor/constants';
import { NavbarLink } from '@/ui/NavbarLink';
import { WallType, wallTypeConfig } from '@/Editor2d/editor/objects/Walls/config';

const AddMenu = () => {
    const { helpMode, activeTool, setTool, activeToolSettings, setToolSettings } = useStore();

    const addOptions = [
        {
            id: Tool.WallAdd,
            icon: activeToolSettings.wallType
                ? wallTypeConfig[activeToolSettings.wallType as keyof typeof wallTypeConfig].icon
                : BorderLeft,
            title: 'Rysuj ściany',
            active: activeTool === Tool.WallAdd,
            position: 'bottom-start',
            onClick: () => {
                setTool(Tool.WallAdd);

                if (!activeToolSettings?.wallType) {
                    setToolSettings({ ...activeToolSettings, wallType: WallType.Exterior });
                }

                if (helpMode) {
                    cleanNotifications();
                    showNotification({
                        title: '✏️ Rysuj ściany',
                        message:
                            'Kliknij aby zacząć rysować ścianę. Kliknij na ⚫ na istniejącej ścianie aby zacząć rysowanie od niej',
                        color: 'blue',
                    });
                }
            },
            options: [
                {
                    icon: <BorderLeft />,
                    title: 'Zewnętrzna',
                    active: activeToolSettings.wallType === WallType.Exterior,
                    onClick: () => {
                        setTool(Tool.WallAdd);
                        setToolSettings({ ...activeToolSettings, wallType: WallType.Exterior });
                    },
                },
                {
                    icon: <BorderHorizontal />,
                    title: 'Nośna',
                    active: activeToolSettings.wallType === WallType.LoadBearing,
                    onClick: () => {
                        setTool(Tool.WallAdd);
                        setToolSettings({ ...activeToolSettings, wallType: WallType.LoadBearing });
                    },
                },
                {
                    icon: <BorderInner />,
                    title: 'Działowa',
                    active: activeToolSettings.wallType === WallType.Partition,
                    onClick: () => {
                        setTool(Tool.WallAdd);
                        setToolSettings({ ...activeToolSettings, wallType: WallType.Partition });
                    },
                },
            ],
        },
        {
            id: Tool.FurnitureAddDoor,
            icon: Door,
            title: 'Dodaj drzwi',
            active: activeTool === Tool.FurnitureAddDoor,
            position: 'bottom',
            onClick: () => {
                setTool(Tool.FurnitureAddDoor);

                if (helpMode) {
                    cleanNotifications();
                    showNotification({
                        title: '🚪 Drzwi',
                        message: 'Kliknij na ścianę aby dodać drzwi',
                        color: 'blue',
                    });
                }
            },
        },
        {
            id: Tool.FurnitureAddWindow,
            icon: Window,
            title: 'Dodaj okno',
            active: activeTool === Tool.FurnitureAddWindow,
            position: 'bottom',
            onClick: () => {
                setTool(Tool.FurnitureAddWindow);

                if (helpMode) {
                    cleanNotifications();
                    showNotification({
                        title: '🪟 Okno',
                        message: 'Kliknij na ścianę aby dodać okno',
                        color: 'blue',
                    });
                }
            },
        },
        {
            id: Tool.FurnitureAddDoor,
            icon: Armchair,
            title: 'Wkrótce',
            active: activeTool === Tool.FurnitureAdd,
            position: 'bottom',
            disabled: true,
            onClick: () => {},
        },
    ];

    return (
        <>
            {addOptions.map(({ icon, ...opt }) => (
                <NavbarLink
                    key={opt.title}
                    label={opt.title}
                    icon={icon}
                    onClick={opt.onClick}
                    position={opt.position as 'right' | 'left' | undefined}
                    disabled={opt.disabled}
                    active={opt.active}
                    options={opt.options}
                ></NavbarLink>
            ))}
        </>
    );
};

export default AddMenu;
