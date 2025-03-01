import { AppShell, Group } from '@mantine/core';
import AddMenu from '@/2d/components/Toolbar/AddMenu';

import { ViewMode } from '@/2d/editor/constants';
import SelectMenu from '@/2d/components/Toolbar/SelectMenu';
import { useStore } from '@/stores/EditorStore';
import ModeMenu from '@/common/components/ModeMenu';
import clsx from 'clsx';
import { HelpDialog } from '@/ui/HelpDialog';

const AppBottomBar = () => {
    const { activeMode } = useStore();

    return (
        <div className="fixed bottom-4 right-4">
            <HelpDialog />
        </div>
    );
};

export default AppBottomBar;
