import { ResetAction } from '@/Editor2d/editor/actions/ResetAction';
import { SaveAction } from '@/Editor2d/editor/actions/SaveAction';
import { SaveInProjectAction } from '@/Editor2d/editor/actions/SaveInProjectAction';
import { ViewMode } from '@/Editor2d/editor/constants';
import { useStore } from '@/stores/EditorStore';
import { Menu } from '@mantine/core';
import { IconDeviceFloppy, IconRotate } from '@tabler/icons-react';
import { useLocation } from '@tanstack/react-router';

const ProjectMenu = () => {
    const { setActiveMode } = useStore();

    const isHomepage = useLocation().pathname === '/';

    if (!isHomepage) return null;

    return (
        <>
            <Menu.Item
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={() => {
                    const action = new SaveInProjectAction();

                    action.execute();
                }}
            >
                <span className="text-sm ">Zapisz w projekcie</span>
            </Menu.Item>
            <Menu.Item
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={() => {
                    const action = new SaveAction();

                    action.execute();
                }}
                rightSection={<span className="text-xs text-gray-300">.json</span>}
            >
                <span className="text-sm ">Zapisz</span>
            </Menu.Item>

            <Menu.Item
                leftSection={<IconRotate size={16} />}
                onClick={() => {
                    setActiveMode(ViewMode.Edit);
                    const action = new ResetAction();

                    action.execute();
                }}
            >
                <span className="text-sm">Zacznij od nowa</span>
            </Menu.Item>
        </>
    );
};

export default ProjectMenu;
