import type { ValidationError } from '@tanstack/react-form';
import FieldError from '../form/FieldError';
import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import MaxLengthCount from '../form/MaxLengthCount';

type ComponentProps = {
    name: string;
    label?: string;
    disabled?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    type?: string;
    errors?: Array<string | ValidationError>;
    icon?: React.ReactNode;
    inputClassName?: string;
    maxLength?: number;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const Input = forwardRef<HTMLInputElement, ComponentProps>(
    (
        {
            name,
            label,
            disabled = false,
            value = '',
            onChange,
            onBlur,
            type = 'text',
            icon,
            errors,
            inputClassName = '',
            maxLength,
            onKeyDown,
        }: ComponentProps,
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className="flex flex-col relative">
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    value={value}
                    onChange={(e) => {
                        if (maxLength && e.target.value.length > maxLength) return;

                        onChange?.(e.target.value);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    onKeyDown={onKeyDown}
                    className={clsx(
                        'bg-slate-50 h-12 px-3 flex items-center border border-solid rounded-xl focus:outline-1 focus:outline-blue-500/10 focus:border-none',
                        errors?.length ? ' border-red-500/50' : 'border-transparent',
                        label && icon ? 'pl-12' : 'pl-4',
                        disabled && 'bg-gray-200 text-gray-400 opacity-80 pointer-events-none',
                        inputClassName
                    )}
                    disabled={disabled}
                />
                <MaxLengthCount maxLength={maxLength} value={value} />

                {errors && <FieldError errors={errors} />}
                {icon && (
                    <div
                        className={clsx(
                            'absolute flex items-center justify-center left-4 top-1/2 -translate-y-1/2 transition-colors duration-100',
                            icon ? 'left-12' : 'left-4',
                            isFocused || value ? 'text-gray-400' : 'text-gray-300'
                        )}
                    >
                        {icon}
                    </div>
                )}
                {label && !isFocused && !value && (
                    <label
                        className={clsx(
                            'absolute top-1/2 mt-px leading-tight -translate-y-1/2 left-12 text-gray-300 font-normal pointer-events-none',
                            icon ? 'left-12' : 'left-5'
                        )}
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

export default Input;
