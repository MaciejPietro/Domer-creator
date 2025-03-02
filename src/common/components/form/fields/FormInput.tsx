import type { FormApi } from '@tanstack/react-form';
import Input from '@/Common/components/inputs/Input';
import { forwardRef } from 'react';

type ComponentProps = {
    form: FormApi<any, undefined>;
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
        ref: React.Ref<HTMLInputElement>,
    ) => {
        return (
            <form.Field
                name={name}
                validators={{
                    onSubmit: ({ value }: { value: string }) => {
                        if (required && !value) return 'To pole jest wymagane';
                        return undefined;
                    },
                }}>
                {(field) => (
                    <div className='col-span-full mt-2 relative'>
                        <Input
                            ref={ref}
                            label={label}
                            name={name}
                            errors={field.state.meta.errors}
                            disabled={disabled}
                            type={type}
                            value={field.state.value}
                            onChange={(e) => {
                                field.handleChange(e);
                            }}
                            icon={icon}
                            maxLength={maxLength}
                        />
                    </div>
                )}
            </form.Field>
        );
    },
);

export default FormInput;
