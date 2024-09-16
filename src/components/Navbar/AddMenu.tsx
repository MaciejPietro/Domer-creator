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
    LetterI,
    BorderInner,
    BorderHorizontal,
} from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';

import { Tool } from '@/2d/editor/constants';
import { useFurnitureStore } from '@/stores/FurnitureStore';
import AddPlan from '@/ui/PlanControls/AddPlan';
import useTranslation from '@/hooks/useTranslation';
import { NavbarLink } from '@/ui/NavbarLink';
import { WallType, wallTypeConfig } from '@/2d/editor/objects/Walls/config';

const AddMenu = () => {
    const { activeTool, setTool, activeToolSettings, setToolSettings } = useStore();

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

                // cleanNotifications();
                // showNotification({
                //     title: '✏️ Wall drawing mode',
                //     message: 'Click to draw walls. Double click on wall node to end sequence.',
                //     color: 'blue',
                // });
            },
            options: [
                {
                    icon: <BorderLeft />,
                    title: 'Zewnętrzna',
                    active: activeToolSettings.wallType === WallType.Exterior,
                    // disabled: !plan,
                    onClick: () => {
                        setTool(Tool.WallAdd);
                        setToolSettings({ ...activeToolSettings, wallType: WallType.Exterior });
                    },
                },
                {
                    icon: <BorderHorizontal />,
                    title: 'Nośna',
                    // disabled: !plan,
                    active: activeToolSettings.wallType === WallType.LoadBearing,
                    onClick: () => {
                        setTool(Tool.WallAdd);
                        setToolSettings({ ...activeToolSettings, wallType: WallType.LoadBearing });
                    },
                },
                {
                    icon: <BorderInner />,
                    title: 'Działowa',
                    // disabled: !plan,
                    active: activeToolSettings.wallType === WallType.Partition,
                    onClick: () => {
                        setTool(Tool.WallAdd);
                        setToolSettings({ ...activeToolSettings, wallType: WallType.Partition });
                    },
                },
            ],
        },
        {
            id: Tool.FurnitureAddWindow,
            icon: Window, // Assuming Window is a valid component
            title: 'Dodaj okno',
            active: activeTool === Tool.FurnitureAddWindow,
            position: 'bottom',
            onClick: () => {
                setTool(Tool.FurnitureAddWindow);
                // cleanNotifications();
                // showNotification({
                //     title: '🪟 Add window',
                //     message: 'Click on wall to add window',
                //     color: 'blue',
                // });
            },
        },
        {
            id: Tool.FurnitureAddDoor,
            icon: Door, // Assuming Door is a valid component
            title: 'Dodaj drzwi',
            active: activeTool === Tool.FurnitureAddDoor,
            position: 'bottom',
            onClick: () => {
                setTool(Tool.FurnitureAddDoor);
                // cleanNotifications();
                // showNotification({
                //     title: '🚪 Add door',
                //     message: 'Click on wall to add door. Right click to change orientation',
                //     color: 'blue',
                // });
            },
        },
        {
            id: Tool.FurnitureAddDoor,
            icon: Armchair, // Assuming Door is a valid component
            title: 'Dodaj meble',
            active: activeTool === Tool.FurnitureAdd,
            position: 'bottom',
            onClick: () => {
                // setTool(Tool.FurnitureAdd);
                // cleanNotifications();
                // showNotification({
                //     title: '🚪 Add door',
                //     message: 'Click on wall to add door. Right click to change orientation',
                //     color: 'blue',
                // });
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
                    position={opt.position as FloatingPosition}
                    active={opt.active}
                    options={opt.options}
                ></NavbarLink>
            ))}
        </>
    );
};

export default AddMenu;
