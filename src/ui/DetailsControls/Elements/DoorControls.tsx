import React, { useState, useEffect } from 'react';
import { ActionIcon, NumberInput, Select } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import { Trash } from 'tabler-icons-react';
import { WallConfig, WallType, wallTypeConfig } from '@/2d/editor/objects/Walls/config';
import {
    doorOrientationConfig,
    DoorOrientationObject,
    doorTypeConfig,
    DoorTypeObject,
} from '@/2d/editor/objects/Furnitures/Door/config';

const doorTypeOptions = Object.values(doorTypeConfig).map((door: DoorTypeObject) => ({
    label: door.label,
    value: door.type.toString(),
}));

const doorOrientationOptions = Object.values(doorOrientationConfig).map((door: DoorOrientationObject) => ({
    label: door.label,
    value: door.type.toString(),
}));

const DoorControls = ({}: any) => {
    const { focusedElement, setFocusedElement } = useStore();

    const [details, setDetails] = useState({
        length: (focusedElement as any)?.length?.toFixed(2) || '0',
        wallType: (focusedElement as any)?.type || WallType.Exterior,
    });

    const handleRemove = () => {
        focusedElement?.delete();

        console.log(focusedElement?.parent.children);

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
    }, [focusedElement]);

    useEffect(() => {
        if (focusedElement) {
            const element = focusedElement as Wall;

            const length = element.length?.toFixed(2) || '0';
            const wallType = element?.type || WallType.Exterior;

            setDetails((prevDetails) => ({ ...prevDetails, length: parseFloat(length), wallType }));
        }
    }, [focusedElement]);

    const handleUpdate = (key: 'length' | 'depth', value: number) => {
        setDetails((prevDetails) => ({ ...prevDetails, [key]: value || 0 }));

        if (key === 'length' && focusedElement instanceof Wall) {
            focusedElement?.setLength(value);
        }
    };

    const handleChangeWallType = (val: WallType) => {
        const element = focusedElement as Wall;

        element?.setType(val);
        setDetails((prevDetails) => ({ ...prevDetails, wallType: val }));
    };

    return (
        <div>
            <h2 className="text-base font-medium my-0 -mt-2">Drzwi</h2>

            {/* <div className="mt-4">
                <NumberInput
                    label="Długość"
                    description="Długość ściany (cm)"
                    value={details.length}
                    onChange={(value) => handleUpdate('length', +value)}
                />
            </div> */}

            <div className="mt-4 grid grid-cols-2 gap-2">
                <Select
                    label="Typ"
                    description="Lewe/Prawe"
                    data={doorTypeOptions}
                    // onChange={(val) => val && handleChangeWallType(+val)}
                />

                <Select
                    label="Pozycja"
                    description="Pozycja na ścianie"
                    data={doorOrientationOptions}
                    // onChange={(val) => val && handleChangeWallType(+val)}
                />
            </div>

            <div className="mt-4">
                <div className="flex gap-2 items-center">
                    <ActionIcon onClick={handleRemove} size={32} variant="default" aria-label="ActionIcon with delete">
                        <Trash className="w-5 h-5 text-red-600" />
                    </ActionIcon>
                    <span className="text-xs text-gray-600">(delete)</span>
                </div>
            </div>
        </div>
    );
};

export default DoorControls;
