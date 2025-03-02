import { Group, AppShellSection } from '@mantine/core';
import { Pencil, Badge3d } from 'tabler-icons-react';

import { useStore } from '@/stores/EditorStore';
import { ViewMode } from '@/Editor2d/editor/constants';
import { NavbarLink } from '@/ui/NavbarLink';

const modes = [
    { icon: Pencil, label: 'Tryb edycji', mode: ViewMode.Edit },
    { icon: Badge3d, label: 'Tryb podglądu 3D', mode: ViewMode.View3d },
];

const ModeMenu = () => {
    const { activeMode, setActiveMode } = useStore();

    return (
        <>
            <AppShellSection grow>
                <Group className="flex gap-2" align="center">
                    {modes.map((mode) => (
                        <NavbarLink
                            key={mode.label}
                            icon={mode.icon}
                            active={activeMode === mode.mode}
                            label={mode.label}
                            // @ts-expect-error ??
                            position="bottom"
                            onClick={() => {
                                setActiveMode(mode.mode);
                            }}
                        />
                    ))}
                </Group>
            </AppShellSection>
        </>
    );
};

export default ModeMenu;
