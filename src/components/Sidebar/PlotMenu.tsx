import { Menu, UnstyledButton } from '@mantine/core';
import { Polygon, Pencil, Eraser, Eye, EyeOff } from 'tabler-icons-react';

import { useStore } from '@/stores/EditorStore';
import { Tool } from '@/2d/editor/constants';
import { PlotPlan } from '@/2d/editor/objects/Plan/PlotPlan';
import { useState } from 'react';

const PlotMenu = () => {
    const { setTool, activeTool } = useStore();
    const [plotVisible, setPlotVisible] = useState(true);

    const isPlotToolActive = activeTool === Tool.PlotAdd;

    const togglePlotVisibility = () => {
        const plot = PlotPlan.Instance.getPlot();
        if (plot) {
            plot.visible = !plot.visible;
            setPlotVisible(plot.visible);
        }
    };

    const clearPlot = () => {
        const plot = PlotPlan.Instance.getPlot();
        if (plot) {
            plot.reset();
        }
    };

    const options = [
        {
            icon: <Pencil size={18} />,
            title: 'Wyznacz dzialke',
            onClick: () => {
                setTool(Tool.PlotAdd);
            },
            active: isPlotToolActive,
        },
        {
            icon: plotVisible ? <EyeOff size={18} /> : <Eye size={18} />,
            title: plotVisible ? 'Ukryj dzialke' : 'Pokaz dzialke',
            onClick: togglePlotVisibility,
        },
        {
            icon: <Eraser size={18} />,
            title: 'Wyczysc dzialke',
            onClick: clearPlot,
        },
    ];

    return (
        <Menu position="right" trigger="hover">
            <Menu.Target>
                <UnstyledButton>
                    <Polygon />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                {options.map((opt) => (
                    <Menu.Item
                        key={opt.title}
                        leftSection={opt.icon}
                        onClick={opt.onClick}
                        style={opt.active ? { backgroundColor: 'rgba(28, 126, 214, 0.1)' } : undefined}
                    >
                        {opt.title}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default PlotMenu;
