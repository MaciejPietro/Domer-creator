import type { FormApi, ReactFormExtendedApi } from '@tanstack/react-form';
import Input from '@/Common/components/inputs/Input';
import { forwardRef } from 'react';

type ComponentProps = {
    form: any;
    name: string;
    label?: string;
    disabled?: boolean;
    type?: string;
    icon?: React.ReactNode;
    required?: boolean;
    maxLength?: number;
};

const FormInput = forwardRef<HTMLInputElement, ComponentProps>(
    (
        { form, name, label, disabled = false, type = 'text', icon, required = false, maxLength }: ComponentProps,
        ref: React.Ref<HTMLInputElement>
    ) => {
        return (
            <form.Field
                name={name}
                children={(field: any) => (
                    <Input
                        {...field}
                        ref={ref}
                        label={label}
                        name={field.name}
                        errors={field.state.meta.errors}
                        disabled={disabled}
                        type={type}
                        value={field.state.value}
                        onChange={(e) => {
                            field.handleChange(e);
                        }}
                        onBlur={() => {
                            field.handleBlur();
                        }}
                        icon={icon}
                        maxLength={maxLength}
                    />
                )}
            ></form.Field>
        );
    }
);

export default FormInput;
