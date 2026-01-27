import { AppShell, Tooltip, UnstyledButton, Group, Menu, Divider, Drawer, Modal, AppShellSection } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { createStyles } from '@mantine/emotion';
import {
    Icon as TablerIcon,
    Armchair,
    BorderLeft,
    BuildingWarehouse,
    // ArrowBottomSquare,
    DeviceFloppy,
    Upload,
    Ruler2,
    StairsUp,
    StairsDown,
    Eye,
    Pencil,
    Eraser,
    Window,
    Door,
    Plus,
    Help,
    SquareX,
    Dimensions,
    Printer,
    Shape,
    Shape3,
    BrandWindows,
    Table,
    TableOff,
    Tag,
    EyeOff,
} from 'tabler-icons-react';

import { useStore } from '@/stores/EditorStore';

import AddPlan from '@/ui/PlanControls/AddPlan';

const PlanMenu = () => {
    const { plan } = useStore();
    const [planOpened, setPlanOpened] = useState(false);

    const options = [
        {
            icon: <Plus size={18} />,
            title: 'Dodaj rzut',
            onClick: () => {
                setPlanOpened(true);
            },
        },
        {
            icon: plan?.visible ? <EyeOff size={18} /> : <Eye size={18} />,
            title: `${plan?.visible ? 'Ukryj' : 'Pokaż'} rzut`,
            disabled: !plan,
            onClick: () => {
                plan.visible = !plan?.visible;
            },
        },
    ];

    return (
        <>
            <Modal
                opened={planOpened}
                onClose={() => {
                    setPlanOpened(false);
                }}
                title="Dodaj rzut"
                size="xl"
                centered
            >
                <AddPlan
                    onClose={() => {
                        setPlanOpened(false);
                    }}
                />
            </Modal>

            <Menu position="right" trigger="hover">
                <Menu.Target>
                    <UnstyledButton>
                        <BuildingWarehouse />
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    {options.map((opt) => (
                        <Menu.Item key={opt.title} leftSection={opt.icon} onClick={opt.onClick} disabled={opt.disabled}>
                            {opt.title}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

export default PlanMenu;
