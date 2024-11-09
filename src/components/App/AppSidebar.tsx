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

const AppSidebar = () => {
    const { activeTool, setTool, activeMode, floor, setSnap, snap } = useStore();

    const [active, setActive] = useState(0);

    const fileRef = useRef<HTMLInputElement>();

    const handleChange = async (e: any) => {
        const resultText = await e.target.files.item(0).text();

        const action = new LoadAction(resultText);

        action.execute();
    };

    const setterAction = (val) => {
        setActive(val);
    };

    return (
        <div className="absolute">
            <AppShell.Navbar className="px-2 py-4 flex flex-col justify-between">
                <div></div>
                <AppShellSection>
                    <Group className="flex flex-col" align="center">
                        {activeMode === ViewMode.Edit && (
                            <>
                                <PlanMenu />
                            </>
                        )}

                        <div className="h-px w-full bg-black/15"></div>

                        <NavbarLink
                            icon={GridDots}
                            label="Przyciągaj do siatki"
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
                        {/* <NavbarLink
                            icon={Dimensions}
                            label="Toggle size labels"
                            onClick={() => {
                                const action = new ToggleLabelAction();

                                action.execute();
                                cleanNotifications();
                                showNotification({
                                    message: 'Toggled size labels',
                                    icon: <Tag />,
                                });
                            }}
                        /> */}

                        <div className="h-px w-full bg-black/15"></div>

                        {/* <Group className="flex flex-col" align="center">
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
                        <div className="h-px w-full bg-black/15"></div> */}

                        <Group className="flex flex-col" align="center">
                            <NavbarLink
                                icon={DeviceFloppy}
                                label="Save plan"
                                onClick={() => {
                                    const action = new SaveAction();

                                    action.execute();
                                }}
                            />

                            <NavbarLink onClick={() => fileRef.current?.click()} icon={Upload} label="Load plan" />
                            <input ref={fileRef as any} onChange={handleChange} multiple={false} type="file" hidden />
                        </Group>

                        <HelpDialog />
                    </Group>
                </AppShellSection>
            </AppShell.Navbar>
        </div>
    );
};

export default AppSidebar;
