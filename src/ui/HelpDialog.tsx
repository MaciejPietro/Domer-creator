import { ReactNode, useState } from 'react';
import { Dialog, Group, Button, TextInput, Text, Image } from '@mantine/core';
import { useStore } from '../stores/EditorStore';
import { NavbarLink } from './NavbarLink';
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
    ArrowAutofitWidth,
} from 'tabler-icons-react';
import { Tool } from '../2d/editor/constants';

import { cleanNotifications, showNotification } from '@mantine/notifications';
interface IHelpBody {
    title: string;
    body?: ReactNode;
}

const staticHelp = {
    title: 'Pomoc jest nie dostępna na tym etapie',
};

export function HelpDialog() {
    // const [isOpen, setIsOpen] = useState(false);

    const { helpMode, setHelpMode } = useStore();
    // const helpBody: IHelpBody[] = [];

    const handleClick = () => {
        setHelpMode(!helpMode);

        cleanNotifications();
        showNotification({
            title: `💡 ${!helpMode ? 'Tryb pomocy został aktywowany' : 'Tryb pomocy został wyłączony'}`,
            message: '',
            color: 'yellow',
        });
    };

    return (
        <>
            <Group>
                <NavbarLink active={helpMode} onClick={handleClick} icon={Help} label="Tryb pomocy" />
            </Group>

            {/* <Dialog
                opened={isOpen}
                withCloseButton
                onClose={() => setIsOpen(false)}
                size="lg"
                radius="md"
                position={{ bottom: 16, left: 80 }}
            >
                <Text size="sm">
                    <b>{helpBody[activeTool].title}</b>
                    {helpBody[activeTool].body}
                </Text>
            </Dialog> */}
        </>
    );
}

//   helpBody[ViewMode.View2d] = {
//     title: "View Mode",
//     body: <>
//       <Group>
//         <Click /> <p>Right click and drag to move around the map </p>
//       </Group>
//       <Group>
//         <ZoomIn /> <p>Use scroll wheel to zoom in or out</p>
//       </Group>
//     </>
//   }

// helpBody[Tool.None] = staticHelp || {
//     title: 'Pointer Mode',
//     body: <>...</>,
// };

// helpBody[Tool.Remove] = staticHelp || {
//     title: 'Erase Mode',
//     body: (
//         <>
//             <Image src={helpDelete}></Image>
//             <Group>
//                 <Click /> <ArrowNarrowRight /> <Trash /> <p> Click on object to remove from plan</p>
//             </Group>
//             <Group>
//                 <Vector /> <p>Wall nodes may only be removed if disconnected</p>
//             </Group>
//         </>
//     ),
// };
// helpBody[Tool.Edit] = staticHelp || {
//     title: 'Edit Mode',
//     body: (
//         <>
//             <Image src={helpEditFurniture}></Image>
//             <Group spacing="xs">
//                 <Click /> <ArrowNarrowRight /> <Edit /> <p> Click on furniture to enable edit controls</p>
//             </Group>
//             <Image src={helpEditWall}></Image>
//             <Group noWrap={true}>
//                 <Vector /> <p>Click and drag wall nodes to edit walls</p>
//             </Group>
//         </>
//     ),
// };
// helpBody[Tool.WallAdd] = staticHelp || {
//     title: 'Add Wall',
//     body: (
//         <>
//             <Image src={helpAddWall}></Image>
//             <Group noWrap={true}>
//                 <Click /> <p>Click to add connected wall chain</p>
//             </Group>
//             <Group noWrap={true}>
//                 <Multiplier2x /> <p>Double click on wall node to end chain</p>
//             </Group>
//             <Group noWrap={true}>
//                 <GitFork /> <p>Click on existing walls to connect</p>
//             </Group>
//         </>
//     ),
// };

// helpBody[Tool.FurnitureAddWindow] = staticHelp || {
//     title: 'Add Window',
//     body: (
//         <>
//             <Image src={helpAddWindow}></Image>
//             <Group noWrap={true}>
//                 <Click /> <p>Click on wall to add window</p>
//             </Group>
//         </>
//     ),
// };
// helpBody[Tool.FurnitureAddDoor] = staticHelp || {
//     title: 'Add Door',
//     body: (
//         <>
//             <Image src={helpAddDoor}></Image>
//             <Group noWrap={true}>
//                 <Click /> <p>Click on wall to add door</p>
//             </Group>
//             <Group noWrap={true}>
//                 <LayoutAlignMiddle /> <p>Middle click to change door orientation</p>
//             </Group>
//         </>
//     ),
// };
// helpBody[Tool.Measure] = staticHelp || {
//     title: 'Measure tool',
//     body: (
//         <>
//             <Image src={helpMeasure}></Image>
//             <Group noWrap={true}>
//                 <Click /> <p>Click and drag to measure distances</p>
//             </Group>
//         </>
//     ),
// };
