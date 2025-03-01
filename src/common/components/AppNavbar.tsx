import { AppShell, Group } from '@mantine/core';
import { DetailsControls } from '@/ui/DetailsControls/DetailsControls';
import AddMenu from '@/2d/components/Toolbar/AddMenu';

import { ViewMode } from '@/2d/editor/constants';
import SelectMenu from '@/2d/components/Toolbar/SelectMenu';
import { useStore } from '@/stores/EditorStore';
import ModeMenu from './ModeMenu';

const AppNavbar = () => {
    const { activeMode } = useStore();

    return (
        <AppShell.Header className="flex justify-between pl-20 py-1.5">
            <Group>
                {activeMode === ViewMode.Edit ? (
                    <>
                        <Group gap={4}>
                            <SelectMenu />
                        </Group>
                        <div className="w-px h-6 bg-black/25"></div>
                        <Group gap={4}>
                            <AddMenu />
                        </Group>
                    </>
                ) : null}
            </Group>
            <div>
                <ModeMenu />
                <DetailsControls />
            </div>
        </AppShell.Header>
    );
};

export default AppNavbar;
