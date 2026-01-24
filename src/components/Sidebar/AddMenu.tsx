import { Modal } from '@mantine/core';
import { useState } from 'react';
import { BorderLeft } from 'tabler-icons-react';

import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useStore } from '@/stores/EditorStore';

import { Tool } from '@/2d/editor/constants';
import AddPlan from '@/ui/PlanControls/AddPlan';
import useTranslation from '@/hooks/useTranslation';

const AddMenu = () => {
    const t = useTranslation();
    const { activeTool, setTool } = useStore();
    const [planOpened, setPlanOpened] = useState(false);


    const options = [
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

    return (
            <Modal
                opened={planOpened}
                onClose={() => {
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
    );
};

export default AddMenu;
