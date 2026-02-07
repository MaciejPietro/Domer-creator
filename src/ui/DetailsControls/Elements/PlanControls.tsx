import { useState, useEffect } from 'react';
import { NumberInput } from '@mantine/core';
import { PlanSprite } from '@/2d/editor/objects/Plan/PlanSprite';

interface PlanControlsProps {
    element: PlanSprite;
}

const PlanControls = ({ element }: PlanControlsProps) => {
    const [segmentCm, setSegmentCm] = useState(element.getScalePlanCm() || 0);

    useEffect(() => {
        setSegmentCm(element.getScalePlanCm() || 0);
    }, [element]);

    const handleSegmentChange = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
        if (num <= 0) return;
        setSegmentCm(num);
        element.updateScaleFromPlanCm(num);
    };

    return (
        <div>
            <h2 className="text-base font-medium my-0 -mt-2">Rzut</h2>

            <div className="mt-4">
                <NumberInput
                    label="Zaznaczony odcinek ma"
                    description="Długość zaznaczonego odcinka w cm – zmiana skaluje rzut"
                    value={segmentCm}
                    min={0.1}
                    step={1}
                    onChange={handleSegmentChange}
                />
            </div>
        </div>
    );
};

export default PlanControls;
