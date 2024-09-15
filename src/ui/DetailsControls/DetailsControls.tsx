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
                <WallControls />
            </Dialog>
        </>
    );
}
