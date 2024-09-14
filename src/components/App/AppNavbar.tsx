import { AppShell } from '@mantine/core';
import ModeMenu from '../Sidebar/ModeMenu';
import { DetailsControls } from '@/ui/DetailsControls/DetailsControls';

const AppNavbar = () => {
    return (
        <AppShell.Header className="flex justify-between">
            {/* <AppShellSection grow> */}
            {/* <Group className="flex flex-col" align="center"> */}
            <ModeMenu />
            <DetailsControls />
            {/* </Group> */}
            {/* </AppShellSection> */}
        </AppShell.Header>
    );
};

export default AppNavbar;
