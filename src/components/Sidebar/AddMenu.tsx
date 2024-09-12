import { AppShell, Tooltip, UnstyledButton, Group, Menu, Divider, Drawer, Modal, AppShellSection } from '@mantine/core';
import { useRef, useState } from 'react';
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
} from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';

import { Tool } from '@/editor/editor/constants';
import { useFurnitureStore } from '@/stores/FurnitureStore';
import AddPlan from '@/ui/PlanControls/AddPlan';
import useTranslation from '@/hooks/useTranslation';

const AddMenu = () => {
    const t = useTranslation();
    const { activeTool, setTool } = useStore();
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [planOpened, setPlanOpened] = useState(false);

    const [modalOpened, setModalOpened] = useState(false);
    const { getCategories } = useFurnitureStore();

    const options = [
        // {
        //     icon: <BuildingWarehouse size={18} />,
        //     title: 'Dodaj rzut',
        //     onClick: () => {
        //         setPlanOpened(true);
        //     },
        // },
        {
            id: Tool.WallAdd,
            icon: <BorderLeft size={18} />,
            title: '  Rysuj ściany',
            onClick: () => {
                setTool(Tool.WallAdd);
                cleanNotifications();
                showNotification({
                    title: '✏️ Wall drawing mode',
                    message: 'Click to draw walls. Double click on wall node to end sequence.',
                    color: 'blue',
                });
            },
        },
    ];

    const activeToolIcon = options.find((opt) => opt.id === activeTool)?.icon;

    // const isEnabled = [Tool.Edit, Tool.WallAdd].includes(activeTool);
    const isEnabled = true;

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

            <div className="relative">
                <Menu position="right" trigger="hover" disabled={!isEnabled}>
                    <Menu.Target>
                        <UnstyledButton className={isEnabled ? '' : 'opacity-25'}>
                            <Plus />
                            {activeToolIcon && (
                                <div className="transform scale-75 origin-top-left text-blue-500 absolute -top-1 -left-1 pointer-events-none">
                                    {activeToolIcon}
                                </div>
                            )}
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                        {/* <Menu.Item icon={<Armchair size={18} />} onClick={() => {
          setDrawerOpened(true)
          setter(-1)
        }}>Add furniture</Menu.Item> */}
                        {options.map((opt) => (
                            <Menu.Item key={opt.title} leftSection={opt.icon} onClick={opt.onClick}>
                                {t(opt.title)}
                            </Menu.Item>
                        ))}
                        <Menu.Item
                            leftSection={<Window size={18} />}
                            onClick={() => {
                                setTool(Tool.FurnitureAddWindow);
                                cleanNotifications();

                                showNotification({
                                    title: '🪟 Add window',
                                    message: 'Click on wall to add window',
                                    color: 'blue',
                                });
                            }}
                        >
                            Add window
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Door size={18} />}
                            onClick={() => {
                                setTool(Tool.FurnitureAddDoor);
                                cleanNotifications();

                                showNotification({
                                    title: '🚪 Add door',
                                    message: 'Click on wall to add door. Right click to change orientation',
                                    color: 'blue',
                                });
                            }}
                        >
                            Add door
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </>
    );
};

export default AddMenu;
