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
    Badge3d,
} from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';
import { ChangeFloorAction } from '@/2d/editor/actions/ChangeFloorAction';
import { LoadAction } from '@/2d/editor/actions/LoadAction';
import { SaveAction } from '@/2d/editor/actions/SaveAction';
import { Tool, ViewMode } from '@/2d/editor/constants';
import { PrintAction } from '@/2d/editor/actions/PrintAction';
import { ToggleLabelAction } from '@/2d/editor/actions/ToggleLabelAction';
import { NavbarLink } from '@/ui/NavbarLink';
import { HelpDialog } from '@/ui/HelpDialog';
import { DeleteFloorAction } from '@/2d/editor/actions/DeleteFloorAction';
import AddMenu from '@/components/Sidebar/AddMenu';
import useTranslation from '@/hooks/useTranslation';

const modes = [
    { icon: Pencil, label: 'Tryb edycji', mode: ViewMode.Edit },
    { icon: Eye, label: 'Tryb podglądu 2D', mode: ViewMode.View2d },
    { icon: Badge3d, label: 'Tryb podglądu 3D', mode: ViewMode.View3d },
];

const ModeMenu = () => {
    const t = useTranslation();
    // const [active, setActive] = useState(0);

    const { activeMode, setActiveMode } = useStore();
    // const { setSnap, snap } = useStore();

    // const Icon = modes[active].icon;

    return (
        <>
            <AppShellSection grow>
                <Group className="flex justify-center py-2" align="center">
                    {modes.map((mode) => (
                        <NavbarLink
                            key={mode.label}
                            icon={mode.icon}
                            active={activeMode === mode.mode}
                            label={mode.label}
                            onClick={() => {
                                setActiveMode(mode.mode);
                                // if (activeTool === Tool.Measure) {
                                //     setTool(Tool.View);
                                // } else {
                                //     setTool(Tool.Measure);
                                //     cleanNotifications();
                                //     showNotification({
                                //         title: '📐 Measure tool',
                                //         message: 'Click and drag to measure areas',
                                //     });
                                // }
                            }}
                        />
                    ))}

                    <Divider />
                </Group>
            </AppShellSection>
        </>
    );
};

export default ModeMenu;
