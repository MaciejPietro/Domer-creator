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
    Replace,
    ArrowLeftSquare,
    EyeOff,
} from 'tabler-icons-react';

import { useStore } from '@/stores/EditorStore';
import { Tool } from '@/2d/editor/enums';

import AddPlan from '@/ui/PlanControls/AddPlan';

const PlanMenu = () => {
    const { plan, setTool, setFocusedElement } = useStore();
    const [planOpened, setPlanOpened] = useState(false);

    const options = [
        {
            icon: plan ? <Replace size={18} /> : <Plus size={18} />,
            title: plan ? 'Zmien rzut' : 'Dodaj rzut',
            onClick: () => {
                setPlanOpened(true);
            },
        },
        plan
            ? {
                  icon: <ArrowLeftSquare size={18} />,
                  title: 'Przesuń rzut',
                  disabled: !plan,
                  onClick: () => {
                      if (!plan) return;
                      setTool(Tool.Edit);
                      plan.focus();
                      setFocusedElement(plan);
                  },
              }
            : null,
        plan
            ? {
                  icon: plan?.visible ? <EyeOff size={18} /> : <Eye size={18} />,
                  title: `${plan?.visible ? 'Ukryj' : 'Pokaż'} rzut`,
                  disabled: !plan,
                  onClick: () => {
                      if (!plan) return;
                      plan.visible = !plan.visible;
                  },
              }
            : null,
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
                    {options
                        .filter((opt) => opt !== null)
                        .map((opt) => (
                            <Menu.Item
                                key={opt.title}
                                leftSection={opt.icon}
                                onClick={opt.onClick}
                                disabled={opt.disabled}
                            >
                                {opt.title}
                            </Menu.Item>
                        ))}
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

export default PlanMenu;
