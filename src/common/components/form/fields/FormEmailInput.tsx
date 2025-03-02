import type { FormApi } from '@tanstack/react-form';
import Input from '@/Common/components/inputs/Input';
import { isValidEmail } from '@/Auth/helpers';

type ComponentProps = {
    form: FormApi<any, undefined>;
    name: string;
    label?: string;
    disabled?: boolean;
    type?: string;
    icon?: React.ReactNode;
    required?: boolean;
};

const FormEmailInput = ({
    form,
    name,
    label,
    disabled = false,
    type = 'text',
    icon,
    required = false,
}: ComponentProps) => {
    return (
        <form.Field
            name="email"
            validators={{
                onSubmit: ({ value }: { value: string }) => {
                    if (required && !value) return 'Adres email jest wymagany';
                    if (!isValidEmail(value)) return 'Nieprawidłowy adres email';
                    return undefined;
                },
            }}
        >
            {(field) => (
                <div className="col-span-full">
                    <Input
                        label={label}
                        name={name}
                        errors={field.state.meta.errors}
                        disabled={disabled}
                        type={type}
                        value={field.state.value}
                        onChange={field.handleChange}
                        icon={icon}
                    />
                </div>
            )}
        </form.Field>
    );
};

export default FormEmailInput;
