import { ReactNode, useEffect, useState } from 'react';
import { Dialog, Group } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { NavbarLink } from '@/ui/NavbarLink';
import {
    ArrowNarrowRight,
    ArrowRight,
    Click,
    Edit,
    Eye,
    GitFork,
    GitPullRequest,
    Help,
    Icon,
    LayoutAlignMiddle,
    Multiplier2x,
    Trash,
    Vector,
    ZoomIn,
} from 'tabler-icons-react';

import WallControls from '@/ui/DetailsControls/Elements/WallControls';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import DoorControls from './Elements/DoorControls';
import { Door } from '@/2d/editor/objects/Furnitures/Door/Door';
interface IHelpBody {
    title: string;
    body: ReactNode;
}

export function DetailsControls() {
    const [opened, setOpened] = useState(true);
    const [details, setDetails] = useState({ width: 0 });

    const { focusedElement, setFocusedElement } = useStore();

    const handleClose = () => {
        setFocusedElement(null);
        setOpened(false);
    };

    useEffect(() => {
        if (focusedElement) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }, [focusedElement]);

    return (
        <>
            {/* <Group>
                <NavbarLink onClick={() => setOpened((o) => !o)} icon={Help} label="Help" />
            </Group> */}

            <Dialog
                opened={opened}
                withCloseButton
                onClose={handleClose}
                size="md"
                radius="md"
                position={{ top: 64, right: 10 }}
            >
                {focusedElement instanceof Wall ? <WallControls /> : null}
                {focusedElement instanceof Door ? <DoorControls /> : null}
            </Dialog>
        </>
    );
}
