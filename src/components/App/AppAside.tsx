import { AppShell, Tooltip, UnstyledButton, Group, Menu, Divider, Drawer, Modal, AppShellSection } from '@mantine/core';
import { useRef, useState } from 'react';
import { createStyles } from '@mantine/emotion';
import {
    Icon as TablerIcon,
    Armchair,
    BorderLeft,
    BuildingWarehouse,
    GridDots,
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
import ModeMenu from '../Sidebar/ModeMenu';
import PlanMenu from '../Sidebar/PlanMenu';

const AppAside = () => {
    const { activeTool, setTool, activeMode, floor } = useStore();
    const { setSnap, snap } = useStore();

    return (
        <div className="absolute right-0">
            <AppShell.Aside
                className="px-2 py-4 flex flex-col justify-between"
                style={{ backgroundColor: 'transparent' }}
            >
                <ModeMenu />
            </AppShell.Aside>
        </div>
    );
};

export default AppAside;
