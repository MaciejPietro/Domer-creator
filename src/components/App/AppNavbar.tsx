import { AppShell, Group, Menu } from '@mantine/core';
import ModeMenu from '../Sidebar/ModeMenu';
import { DetailsControls } from '@/ui/DetailsControls/DetailsControls';
import AddMenu from '../Navbar/AddMenu';

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
    Wall,
} from 'tabler-icons-react';
import { Tool } from '@/2d/editor/constants';
import { NavbarLink } from '@/ui/NavbarLink';
import SelectMenu from '../Navbar/SelectMenu';

const AppNavbar = () => {
    const modeOptions = [];

    return (
        <AppShell.Header className="flex justify-between pl-20 py-1.5">
            {/* <AppShellSection grow> */}
            {/* <Group className="flex flex-col" align="center"> */}
            <Group>
                <Group gap={4}>
                    <SelectMenu />
                </Group>
                <div className="w-px h-6 bg-black/25"></div>
                <Group gap={4}>
                    <AddMenu />
                </Group>
            </Group>
            <div>
                <ModeMenu />
                <DetailsControls />
            </div>
            {/* </Group> */}
            {/* </AppShellSection> */}
        </AppShell.Header>
    );
};

export default AppNavbar;
