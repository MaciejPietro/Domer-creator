import { AppShell, Group, AppShellSection } from '@mantine/core';
import { GridDots, Table, TableOff } from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/Editor2d/editor/constants';
import { NavbarLink } from '@/ui/NavbarLink';
import { HelpDialog } from '@/ui/HelpDialog';
import PlanMenu from '@/Editor2d/components/Toolbar/PlanMenu';
import DropdownMenu from './DropdownMenu';

const AppSidebar = () => {
    const { activeMode, setSnap, snap } = useStore();

    return (
        <AppShell.Navbar className="bg-transparent">
            <div className="absolute top-4 left-4">
                <DropdownMenu />
            </div>
        </AppShell.Navbar>
    );

    return (
        <div className="absolute">
            <AppShell.Navbar className="bg-transparent">
                <div>
                    <DropdownMenu />
                </div>
                <AppShellSection>
                    <Group className="flex flex-col" align="center">
                        {activeMode === ViewMode.Edit && (
                            <>
                                <PlanMenu />
                                <NavbarLink
                                    icon={GridDots}
                                    label="Przyciągaj do siatki"
                                    active={snap}
                                    onClick={() => {
                                        setSnap(!snap);
                                        cleanNotifications();
                                        showNotification({
                                            message:
                                                'Tryb przyciągania do siatki został ' +
                                                (snap ? 'wyłączony' : 'aktywowany'),
                                            icon: snap ? <Table /> : <TableOff />,
                                        });
                                    }}
                                />
                            </>
                        )}

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
                    </Group>
                </AppShellSection>
            </AppShell.Navbar>
        </div>
    );
};

export default AppSidebar;
