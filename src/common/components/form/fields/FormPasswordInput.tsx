import Input from '@/Common/components/inputs/Input';
import clsx from 'clsx';
import { Eye, EyeOff } from 'tabler-icons-react';
import { useState } from 'react';

type ComponentProps = {
    form: any;
    name: string;
    label: string;
    icon?: React.ReactNode;
};

const FormPasswordInput = ({ form, name, label, icon }: ComponentProps) => {
    const [type, setType] = useState<'password' | 'text'>('password');

    return (
        <form.Field
            name={name}
            // validators={{
            //     onSubmit: ({ value }: { value: string }) => {
            //         if (value?.length < 8) return 'Hasło musi mieć conajmniej 8 znaków';

            //         if (name === 'passwordConfirmation' && value !== form.getFieldValue('password'))
            //             return 'Hasła nie są takie same';

            //         return undefined;
            //     },
            // }}
            children={(field: any) => (
                <div className="relative">
                    <Input
                        type={type}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        name={name}
                        errors={field.state.meta.errors}
                        icon={icon}
                        label={label}
                    />
                    <button
                        className={clsx(
                            'bg-transparent border-none text-gray-400 flex cursor-pointer items-center justify-center absolute p-1.5 right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity duration-100',
                            field.state.value ? 'text-gray-300' : 'text-gray-400'
                        )}
                        type="button"
                        onClick={() => {
                            setType((prev) => (prev === 'password' ? 'text' : 'password'));
                        }}
                    >
                        {type === 'password' ? <Eye className="size-4 " /> : <EyeOff className="size-4 " />}
                    </button>
                </div>
            )}
        />
    );
};

export default FormPasswordInput;
