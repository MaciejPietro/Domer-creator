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

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';

import { Tool } from '@/editor/editor/constants';
import { useFurnitureStore } from '@/stores/FurnitureStore';
import AddPlan from '@/ui/PlanControls/AddPlan';
import useTranslation from '@/hooks/useTranslation';

const PlanMenu = () => {
    const t = useTranslation();
    const { activeTool, plan } = useStore();

    const [drawerOpened, setDrawerOpened] = useState(false);
    const [planOpened, setPlanOpened] = useState(false);
    const [planVisibility, setPlanVisibility] = useState(!!plan?.visible);

    const [modalOpened, setModalOpened] = useState(false);
    const { getCategories } = useFurnitureStore();

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
                setPlanVisibility(!plan?.visible);

                // setPlanOpened(true);
            },
        },
    ];

    useEffect(() => {}, [plan?.visible]);

    const activeToolIcon = options.find((opt) => opt.id === activeTool)?.icon;

    const isEnabled = [Tool.Edit, Tool.WallAdd].includes(activeTool);

    return (
        <>
            {/* <Drawer
      opened={drawerOpened}
      position='right'
      onClose={() => {getCategories(); setDrawerOpened(false)}}
      title="Dodaj meble"
      padding="xl"
      size="lg"
      overlayOpacity={0}
    >
      <FurnitureAddPanel />
    </Drawer> */}

            <Modal
                opened={planOpened}
                onClose={() => {
                    getCategories();
                    setPlanOpened(false);
                }}
                title={t('Dodaj rzut')}
                padding="xl"
                size="lg"
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
                        <BuildingWarehouse size={20} />
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    {/* <Menu.Item icon={<Armchair size={18} />} onClick={() => {
          setDrawerOpened(true)
          setter(-1)
        }}>Add furniture</Menu.Item> */}

                    {options.map((opt) => (
                        <Menu.Item key={opt.title} leftSection={opt.icon} onClick={opt.onClick} disabled={opt.disabled}>
                            {t(opt.title)}
                        </Menu.Item>
                    ))}

                    {/* <Divider /> */}

                    {/* <Menu.Item leftSection={<Window size={18} />} onClick={() => {
          setTool(Tool.FurnitureAddWindow)
          cleanNotifications();

          showNotification({
            title: '🪟 Add window',
            message: 'Click on wall to add window',
            color: 'blue',

          })
        }}>Add window</Menu.Item>
        <Menu.Item leftSection={<Door size={18} />} onClick={() => {
          setTool(Tool.FurnitureAddDoor)
          cleanNotifications();

          showNotification({
            title: '🚪 Add door',
            message: 'Click on wall to add door. Right click to change orientation',
            color: 'blue',

          })
        }}>Add door</Menu.Item> */}
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

export default PlanMenu;
