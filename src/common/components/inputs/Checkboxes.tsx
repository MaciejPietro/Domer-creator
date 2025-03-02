import type { ValidationError } from '@tanstack/react-form';
import { type ReactNode, useState } from 'react';
import clsx from 'clsx';
// import { Tooltip } from "primereact/tooltip";

import { Check, InfoCircle } from 'tabler-icons-react';

interface CheckboxItem {
    name: ReactNode;
    code: string;
    description?: ReactNode;
}

type ComponentProps = {
    onChange?: (value: string) => void;
    errors?: Array<string | ValidationError>;
    items: Array<CheckboxItem>;
    size?: 'sm' | 'md';
};

const Checkboxes = ({ items, size = 'sm' }: ComponentProps) => {
    const handleChange = () => {
        // TODO: implement
    };

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <CheckboxItem key={item.code} item={item} handleChange={handleChange} size={size} />
            ))}
        </div>
    );
};

const CheckboxItem = ({
    item,
    handleChange,
}: {
    item: CheckboxItem;
    handleChange: (key: string, value: boolean) => void;
}) => {
    const [checked, setChecked] = useState(false);

    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                    setChecked(!checked);
                    handleChange(item.code, !checked);
                }}
                className="absolute opacity-0 cursor-pointer"
            />
            <span
                className={clsx(
                    'flex items-center justify-center border border-solid rounded mr-2 size-5 ',
                    checked ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 bg-transparent'
                )}
            >
                {checked && <Check size={16} />}
            </span>
            <span className={clsx('custom-tooltip-btn text-gray-400 text-md')}>{item.name}</span>
            {item.description && (
                <>
                    <div className={clsx('p-1 text-gray-400 ml-2', `tooltip-${item.code}`)}>
                        <InfoCircle className="size-4" />

                        <span className="sr-only">Więcej informacji</span>
                    </div>
                    {/* <Tooltip target={`.tooltip-${item.code}`} className=" rounded-2xl max-w-sm text-sm p-5 ">
                        {item.description}
                    </Tooltip> */}
                </>
            )}
        </label>
    );
};

Checkboxes.CheckboxItem = CheckboxItem;

export default Checkboxes;
