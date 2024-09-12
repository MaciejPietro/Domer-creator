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

const AppSidebar = () => {
    const { activeTool, setTool, activeMode, floor } = useStore();
    const { setSnap, snap } = useStore();

    return (
        <div className="absolute">
            <AppShell.Navbar className="px-2 py-4 flex flex-col justify-between">
                <AppShellSection grow>
                    <Group className="flex flex-col" align="center">
                        {activeMode === ViewMode.Edit && (
                            <>
                                <PlanMenu />
                                <AddMenu />
                            </>
                        )}
                    </Group>
                </AppShellSection>

                <AppShellSection>
                    <Group className="flex flex-col" align="center">
                        <NavbarLink
                            icon={Ruler2}
                            active={activeTool === Tool.Measure}
                            label="Narzędzie miara"
                            onClick={() => {
                                if (activeTool === Tool.Measure) {
                                    setTool(Tool.Edit);
                                } else {
                                    setTool(Tool.Measure);
                                    cleanNotifications();
                                    showNotification({
                                        title: '📐 Measure tool',
                                        message: 'Click and drag to measure areas',
                                    });
                                }
                            }}
                        />

                        <NavbarLink
                            icon={GridDots}
                            label="Przyciągaj do siatki (ctrl)"
                            active={snap}
                            onClick={() => {
                                setSnap(!snap);
                                cleanNotifications();
                                showNotification({
                                    message: 'Snap to grid now ' + (snap ? 'Off' : 'On'),
                                    icon: snap ? <Table /> : <TableOff />,
                                });
                            }}
                        />
                        <NavbarLink
                            icon={Dimensions}
                            label="Toggle size labels"
                            onClick={() => {
                                let action = new ToggleLabelAction();
                                action.execute();
                                cleanNotifications();
                                showNotification({
                                    message: 'Toggled size labels',
                                    icon: <Tag />,
                                });
                            }}
                        />

                        <div className="h-px w-full bg-black/15"></div>

                        <Group className="flex flex-col" align="center">
                            <Tooltip label={'Current floor'} position="right" withArrow>
                                <div>{floor}</div>
                            </Tooltip>

                            <NavbarLink
                                icon={StairsUp}
                                label="Go to next floor"
                                onClick={() => {
                                    let action = new ChangeFloorAction(1);
                                    action.execute();
                                }}
                            />
                            <NavbarLink
                                icon={StairsDown}
                                label="Go to previous floor"
                                onClick={() => {
                                    let action = new ChangeFloorAction(-1);
                                    action.execute();
                                }}
                            />
                            <NavbarLink
                                icon={SquareX}
                                label="Delete floor"
                                onClick={() => {
                                    let action = new DeleteFloorAction();
                                    action.execute();
                                }}
                            />
                        </Group>
                        <div className="h-px w-full bg-black/15"></div>

                        <HelpDialog />

                        <Group className="flex flex-col" align="center">
                            <NavbarLink
                                icon={Printer}
                                label="Print"
                                onClick={() => {
                                    let action = new PrintAction();
                                    action.execute();
                                }}
                            />
                            <NavbarLink
                                icon={DeviceFloppy}
                                label="Save plan"
                                onClick={() => {
                                    let action = new SaveAction();
                                    action.execute();
                                }}
                            />
                        </Group>
                    </Group>
                </AppShellSection>
            </AppShell.Navbar>
        </div>
    );
};

export default AppSidebar;
