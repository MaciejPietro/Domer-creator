import { AppShell, Group, AppShellSection } from '@mantine/core';
import { GridDots, Table, TableOff } from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/2d/editor/constants';
import { NavbarLink } from '@/ui/NavbarLink';
import PlanMenu from '../Sidebar/PlanMenu';
import PlotMenu from '../Sidebar/PlotMenu';
import DropdownMenu from '../Sidebar/DropdownMenu';

const AppSidebar = () => {
    const { activeMode, setSnap, snap } = useStore();

    return (
        <div className="absolute">
            <AppShell.Navbar className="px-2 py-4 flex flex-col justify-between">
                <div>
                    <DropdownMenu />
                </div>
                <AppShellSection>
                    <Group className="flex flex-col" align="center">
                        {activeMode === ViewMode.Edit && (
                            <>
                                <PlanMenu />
                                <PlotMenu />
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
                    </Group>
                </AppShellSection>
            </AppShell.Navbar>
        </div>
    );
};

export default AppSidebar;
