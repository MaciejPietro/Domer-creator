import React, { useState, useEffect } from 'react';
import { ActionIcon, NumberInput, Select } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '@/Editor2d/editor/objects/Walls/Wall';
import { Trash } from 'tabler-icons-react';
import { WallConfig, WallType, wallTypeConfig } from '@/Editor2d/editor/objects/Walls/config';
import { showCollisionError } from '@/Editor2d/editor/objects/Walls/errors';

const WallControls = ({ element }: { element: Wall }) => {
    const { setFocusedElement } = useStore();

    const [details, setDetails] = useState({
        length: parseFloat(element.length.toString()) || 0,
        wallType: element.type || WallType.Exterior,
    });

    const handleRemove = () => {
        element.delete();

        setFocusedElement(null);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Delete') handleRemove();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [element]);

    useEffect(() => {
        if (element) {
            const length = element.length || 0;
            const wallType = element?.type || WallType.Exterior;

            setDetails((prevDetails) => ({ ...prevDetails, length, wallType }));
        }
    }, [element.length]);

    const handleUpdate = (key: 'length' | 'depth', value: number) => {
        const backupLength = element.length;

        if (key === 'length') {
            element.setLength(value);

            if (element.isColliding()) {
                showCollisionError();

                element.setLength(backupLength);
                return;
            }

            setDetails((prevDetails) => ({ ...prevDetails, length: value || 0 }));
        }

        if (key === 'depth') {
            setDetails((prevDetails) => ({ ...prevDetails, depth: value || 0 }));
        }
    };

    const wallTypeOptions = Object.values(wallTypeConfig).map((wall: WallConfig) => ({
        label: `${wall.label} (${wall.thickness}cm)`,
        value: wall.type.toString(),
    }));

    const handleChangeWallType = (val: WallType) => {
        element?.setType(val);
        setDetails((prevDetails) => ({ ...prevDetails, wallType: val }));
    };

    return (
        <div>
            <h2 className="text-base font-medium my-0 -mt-2">Sciana</h2>

            <div className="mt-4">
                <NumberInput
                    label="Długość"
                    description="Długość ściany (cm)"
                    value={element.length}
                    onChange={(value) => handleUpdate('length', +value)}
                />
            </div>

            <div className="mt-4">
                <Select
                    label="Typ"
                    description="Typ ściany"
                    data={wallTypeOptions}
                    value={details.wallType.toString()}
                    onChange={(val) => val && handleChangeWallType(+val)}
                />
            </div>

            <div className="mt-4">
                <p>Kąt: {element.angle}</p>
            </div>

            <div className="mt-4">
                <div className="flex gap-2 items-center">
                    <ActionIcon onClick={handleRemove} size={32} variant="default" aria-label="ActionIcon with delete">
                        <Trash className="w-5 h-5 text-red-600" />
                    </ActionIcon>
                    <span className="text-xs text-gray-600">(delete)</span>
                </div>
            </div>

            {/* <div className="mt-4">
                <NumberInput
                    label="Grubość"
                    description="Grubość ściany (cm)"
                    value={details.depth}
                    onChange={(value) => handleUpdate('depth', +value)}
                />
            </div> */}
        </div>
    );
};

export default WallControls;
