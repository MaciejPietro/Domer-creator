import { useEffect, useState } from 'react';
import { Dialog } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import WallControls from '@/ui/DetailsControls/Elements/WallControls';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import DoorControls from './Elements/DoorControls';
import { Door } from '@/2d/editor/objects/Furnitures/Door/Door';
import { WindowElement } from '@/2d/editor/objects/Furnitures/Window/Window';
import WindowControls from './Elements/WindowControls';
import PlanControls from './Elements/PlanControls';
import { PlanSprite } from '@/2d/editor/objects/Plan/PlanSprite';


export function DetailsControls() {
    const [opened, setOpened] = useState(true);

    const { focusedElement, setFocusedElement } = useStore();

    const handleClose = () => {
        setFocusedElement(null);
        setOpened(false);
    };

    useEffect(() => {
        setOpened(Boolean(focusedElement));
    }, [focusedElement]);

    return (
        <Dialog
            opened={opened}
            withCloseButton
            onClose={handleClose}
            size="md"
            radius="md"
            position={{ top: 64, right: 10 }}
        >
            {focusedElement instanceof Wall ? <WallControls element={focusedElement} /> : null}
            {focusedElement instanceof Door ? <DoorControls /> : null}
            {focusedElement instanceof WindowElement ? <WindowControls /> : null}
            {focusedElement instanceof PlanSprite ? <PlanControls element={focusedElement} /> : null}
        </Dialog>
);
}
