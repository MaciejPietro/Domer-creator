import { AppShell, Group } from '@mantine/core';
import AddMenu from '@/Editor2d/components/Toolbar/AddMenu';

import { ViewMode } from '@/Editor2d/editor/constants';
import SelectMenu from '@/Editor2d/components/Toolbar/SelectMenu';
import { useStore } from '@/stores/EditorStore';
import clsx from 'clsx';
import ModeMenu from '@/Common/components/app/ModeMenu';

const Separator = () => {
    return <div className="w-px h-6 bg-black/10 mx-1"></div>;
};

const EditorToolbar = () => {
    const { activeMode } = useStore();

    return (
        <AppShell.Header className="flex gap-2 items-center h-12 py-0 px-1 mt-3 rounded-lg shadow w-max mx-auto">
            <div
                className={clsx('flex gap-2 items-center', {
                    'opacity-20 pointer-events-none': activeMode !== ViewMode.Edit,
                })}
            >
                <Group gap={4}>
                    <SelectMenu />
                </Group>
                <Separator />
                <Group gap={4}>
                    <AddMenu />
                </Group>
                <Separator />
            </div>
            <ModeMenu />
            {/* <DetailsControls /> */}
        </AppShell.Header>
    );
};

export default EditorToolbar;
