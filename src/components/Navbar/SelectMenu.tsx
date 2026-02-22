import { AppShell, Tooltip, UnstyledButton, Group, Menu, Divider, Drawer, Modal, AppShellSection } from '@mantine/core';
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
    Printer,
    Shape,
    Shape3,
    BrandWindows,
    Table,
    TableOff,
    Tag,
    Pointer,
} from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';

import { Tool } from '@/2d/editor/enums';
import { NavbarLink } from '@/ui/NavbarLink';

const AddMenu = () => {
    const { activeTool, setTool, helpMode } = useStore();

    const addOptions = [
        {
            id: Tool.Edit,
            icon: Pointer,
            title: 'Wybierz',
            active: activeTool === Tool.Edit,
            onClick: () => {
                setTool(Tool.Edit);
                // cleanNotifications();
                // showNotification({
                //     title: '✏️ Wall drawing mode',
                //     message: 'Click to draw walls. Double click on wall node to end sequence.',
                //     color: 'blue',
                // });
            },
        },
        {
            id: Tool.Remove,
            icon: Eraser,
            title: 'Wymaż',
            active: activeTool === Tool.Remove,
            onClick: () => {
                setTool(Tool.Remove);

                if (activeTool === Tool.Remove) {
                    setTool(Tool.Edit);
                } else {
                    if (helpMode) {
                        cleanNotifications();
                        showNotification({
                            title: '🗑️ Tryb usuwania',
                            message: 'Kliknij na element aby go usunąć. ⚠️ Tej akcji nie będzie można cofnąć;',
                            color: 'blue',
                        });
                    }
                }

                // setTool(Tool.WallAdd);
                // cleanNotifications();
                // showNotification({
                //     title: '✏️ Wall drawing mode',
                //     message: 'Click to draw walls. Double click on wall node to end sequence.',
                //     color: 'blue',
                // });
            },
        },
        {
            id: Tool.Measure,
            icon: Ruler2,
            title: 'Narzędzie miara',
            active: activeTool === Tool.Measure,
            onClick: () => {
                if (activeTool === Tool.Measure) {
                    setTool(Tool.Edit);
                } else {
                    setTool(Tool.Measure);

                    if (helpMode) {
                        cleanNotifications();
                        showNotification({
                            title: '📐 Tryb miarki',
                            message: 'Kliknij na obszar roboczy aby zaznaczyć punkt początkowy miarki',
                            color: 'blue',
                        });
                    }
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
                    // @ts-expect-error find why
                    position="bottom"
                    active={opt.active}
                ></NavbarLink>
            ))}
        </>
    );
};

export default AddMenu;
