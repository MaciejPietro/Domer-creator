import { useState, useEffect } from 'react';
import { ActionIcon, NumberInput } from '@mantine/core';
import { useStore } from '@/stores/EditorStore';
import { Wall } from '@/2d/editor/objects/Walls/Wall';
import { Trash } from 'tabler-icons-react';
import { showCollisionError, showMinLengthError } from '@/2d/editor/objects/Walls/errors';
import { DEFAULT_WALL_TYPE, MIN_WALL_LENGTH } from '@/2d/editor/objects/Walls/constants';

const WallControls = ({ element }: { element: Wall }) => {
    const { setFocusedElement } = useStore();

    const [details, setDetails] = useState({
        length: parseFloat(element.length.toString()) || 0,
        wallType: DEFAULT_WALL_TYPE,
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
            const wallType = DEFAULT_WALL_TYPE;

            setDetails((prevDetails) => ({ ...prevDetails, length, wallType }));
        }
    }, [element.length]);

    const handleUpdate = (key: 'length' , value: number) => {
        const backupLength = element.length;

        if (key === 'length') {
            if (value < MIN_WALL_LENGTH) return showMinLengthError();

            element.setLength(value);

            if (element.isColliding()) {
                showCollisionError();

                element.setLength(backupLength);
                return;
            }

            setDetails((prevDetails) => ({ ...prevDetails, length: value || 0 }));
        }
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
        </div>
    );
};

export default WallControls;
