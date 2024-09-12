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
import { ChangeFloorAction } from '@/editor/editor/actions/ChangeFloorAction';
import { LoadAction } from '@/editor/editor/actions/LoadAction';
import { SaveAction } from '@/editor/editor/actions/SaveAction';
import { Tool, ViewMode } from '@/editor/editor/constants';
import { PrintAction } from '@/editor/editor/actions/PrintAction';
import { ToggleLabelAction } from '@/editor/editor/actions/ToggleLabelAction';
import { NavbarLink } from '@/ui/NavbarLink';
import { HelpDialog } from '@/ui/HelpDialog';
import { DeleteFloorAction } from '@/editor/editor/actions/DeleteFloorAction';
import AddMenu from '@/components/Sidebar/AddMenu';
import ModeMenu from '../Sidebar/ModeMenu';
import PlanMenu from '../Sidebar/PlanMenu';

const AppNavbar = () => {
    return (
        <AppShell.Header>
            {/* <AppShellSection grow> */}
            {/* <Group className="flex flex-col" align="center"> */}
            <ModeMenu />
            {/* </Group> */}
            {/* </AppShellSection> */}
        </AppShell.Header>
    );
};

export default AppNavbar;
