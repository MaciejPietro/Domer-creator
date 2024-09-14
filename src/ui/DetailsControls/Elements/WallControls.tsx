import React, { useState, useEffect } from 'react';
import { ActionIcon, NumberInput, Select } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import { Trash } from 'tabler-icons-react';

const WallControls = ({}: any) => {
    const { focusedElement, setFocusedElement } = useStore();

    const [details, setDetails] = useState({
        length: (focusedElement as any)?.length?.toFixed(2) || 0,
        depth: 50,
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

    useEffect(() => {
        if (focusedElement) {
            const newLength = (focusedElement as any)?.length?.toFixed(2) || 0;

            setDetails((prevDetails) => ({ ...prevDetails, length: parseFloat(newLength) }));
        }
    }, [(focusedElement as any)?.length]);

    const handleUpdate = (key: 'length' | 'depth', value: number) => {
        setDetails((prevDetails) => ({ ...prevDetails, [key]: value || 0 }));

        if (key === 'length' && focusedElement instanceof Wall) {
            focusedElement?.setLength(value);
        }
    };

    return (
        <div>
            <h2 className="text-base font-medium my-0 -mt-2">Sciana</h2>

            <div className="mt-4">
                <NumberInput
                    label="Długość"
                    description="Długość ściany (cm)"
                    value={details.length}
                    onChange={(value) => handleUpdate('length', +value)}
                />
            </div>

            <div className="mt-4">
                <Select label="Typ" description="Typ ściany" data={['React', 'Angular', 'Vue', 'Svelte']} />
            </div>

            <div className="mt-4">
                <ActionIcon
                    onClick={handleRemove}
                    size={32}
                    variant="default"
                    aria-label="ActionIcon with size as a number"
                >
                    <Trash className="w-5 h-5 text-red-600" />
                </ActionIcon>
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
