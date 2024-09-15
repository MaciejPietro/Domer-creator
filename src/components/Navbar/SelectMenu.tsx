import { AppShell, Tooltip, UnstyledButton, Group, Menu, Divider, Drawer, Modal, AppShellSection } from '@mantine/core';
import { useRef, useState } from 'react';
import { createStyles } from '@mantine/emotion';
import {
    Icon as TablerIcon,
    Armchair,
    BorderLeft,
    BuildingWarehouse,
    // ArrowBottomSquare,
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

import { Tool } from '@/2d/editor/constants';
import { useFurnitureStore } from '@/stores/FurnitureStore';
import AddPlan from '@/ui/PlanControls/AddPlan';
import useTranslation from '@/hooks/useTranslation';
import { NavbarLink } from '@/ui/NavbarLink';

const AddMenu = () => {
    const { activeTool, setTool } = useStore();

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
                    // cleanNotifications();
                    // showNotification({
                    //     title: '📐 Measure tool',
                    //     message: 'Click and drag to measure areas',
                    // });
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
                    position="bottom"
                    active={opt.active}
                ></NavbarLink>
            ))}
        </>
    );
};

export default AddMenu;
