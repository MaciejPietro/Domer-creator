import {
    AppShell,
    Tooltip,
    UnstyledButton,
    Group,
    Menu,
    Divider,
    Drawer,
    Modal,
    AppShellSection,
    FloatingPosition,
} from '@mantine/core';
import { useRef, useState } from 'react';
import { createStyles } from '@mantine/emotion';
import {
    Icon as TablerIcon,
    Armchair,
    BorderLeft,
    BuildingWarehouse,
    DeviceFloppy,
    Upload,
    Ruler2,
    StairsUp,
    StairsDown,
    Eye,
    Pencil,
    Eraser,
    Window,
    Door,
    Plus,
    Help,
    SquareX,
    Dimensions,
    Shape,
    Shape3,
    BrandWindows,
    Table,
    TableOff,
    Tag,
    LetterI,
    BorderInner,
    BorderHorizontal,
} from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';

import { Tool } from '@/2d/editor/enums';
import { NavbarLink } from '@/ui/NavbarLink';
import { DEFAULT_WALL_TYPE } from '@/2d/editor/objects/Walls/constants';

const AddMenu = () => {
    const { helpMode, activeTool, setTool, activeToolSettings, setToolSettings } = useStore();

    const addOptions = [
        {
            id: Tool.WallAdd,
            icon: BorderLeft,
            title: 'Rysuj ściany',
            active: activeTool === Tool.WallAdd,
            position: 'bottom-start',
            onClick: () => {
                setTool(Tool.WallAdd);
                setToolSettings({ ...activeToolSettings, wallType: DEFAULT_WALL_TYPE });

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
                    active={opt.active}
                ></NavbarLink>
            ))}
        </>
    );
};

export default AddMenu;
