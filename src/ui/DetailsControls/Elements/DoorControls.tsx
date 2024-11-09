import React, { useState, useEffect } from 'react';
import { ActionIcon, NumberInput, Select } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import { Trash } from 'tabler-icons-react';
import { WallConfig, WallType, wallTypeConfig } from '@/2d/editor/objects/Walls/config';
import {
    DoorOrientation,
    doorOrientationConfig,
    DoorOrientationObject,
    DoorType,
    doorTypeConfig,
    DoorTypeObject,
    doorWidthConfig,
    DoorWidthObject,
} from '@/2d/editor/objects/Furnitures/Door/config';
import { Door } from '@/2d/editor/objects/Furnitures/Door/Door';

const doorTypeOptions = Object.values(doorTypeConfig).map((door: DoorTypeObject) => ({
    label: door.label,
    value: door.type.toString(),
}));

const doorOrientationOptions = Object.values(doorOrientationConfig).map((door: DoorOrientationObject) => ({
    label: door.label,
    value: door.type.toString(),
}));

const doorWidthOptions = Object.values(doorWidthConfig).map((door: DoorWidthObject) => ({
    label: door.label,
    value: door.width.toString(),
}));

const DoorControls = ({}: any) => {
    const { focusedElement, setFocusedElement } = useStore();

    const element = focusedElement as Door;

    const [details, setDetails] = useState({
        type: element.type,
        orientation: element.orientation,
        width: element.length,
    });

    const handleRemove = () => {
        focusedElement?.delete();
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

    // useEffect(() => {
    //     if (focusedElement) {
    //         const element = focusedElement as Wall;

    //         const length = element.length?.toFixed(2) || '0';
    //         const wallType = element?.type || WallType.Exterior;

    //         setDetails((prevDetails) => ({ ...prevDetails, length: parseFloat(length), wallType }));
    //     }
    // }, [focusedElement]);

    const handleChangeDoorType = (type: DoorType) => {
        element.setType(type);

        setDetails((prevDetails) => ({ ...prevDetails, type }));
    };

    const handleChangeDoorOrientation = (orientation: DoorOrientation) => {
        element.setOrientation(orientation);

        setDetails((prevDetails) => ({ ...prevDetails, orientation }));
    };

    const handleChangeDoorWidth = (width: number) => {
        element.setLength(width);

        setDetails((prevDetails) => ({ ...prevDetails, width }));
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

            <div className="mt-4 ">
                <Select
                    label="Typ"
                    data={doorTypeOptions}
                    value={element.type.toString()}
                    onChange={(val) => val && handleChangeDoorType(+val)}
                />
            </div>

            <div className="mt-3">
                <Select
                    label="Pozycja"
                    data={doorOrientationOptions}
                    value={element.orientation.toString()}
                    onChange={(val) => val && handleChangeDoorOrientation(+val)}
                />
            </div>

            <div className="mt-4 ">
                <Select
                    label="Szerokość"
                    data={doorWidthOptions}
                    value={element.length.toString()}
                    onChange={(val) => val && handleChangeDoorWidth(+val)}
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
