import { useForm } from '@tanstack/react-form';

import useLogin from '@/Auth/hooks/useLogin';

import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import FormError from '@/Common/components/form/FormError';

import FormInput from '@/Common/components/form/fields/FormInput';
import Oauth2 from '../components/Oauth2';
import { Button } from '@mantine/core';
import { User, Lock } from 'tabler-icons-react';
import RemindPasswordForm from './RemindPasswordForm';
import { modals } from '@mantine/modals';
import RegisterForm from './RegisterForm';
import { isValidEmail, validateEmail } from '../helpers';

export default function LoginForm() {
    const { isSuccess, mutateAsync, error, isPending } = useLogin();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onBlur: ({ value }) => ({
                fields: {
                    email: validateEmail(value.email),
                    password: !value.password ? 'Hasło jest wymagane' : undefined,
                },
            }),
        },
        onSubmit: ({ value }) => mutateAsync(value),
    });

    if (isSuccess) {
        modals.closeAll();
    }

    return (
        <div>
            <h2 className="px-6 text-center text-2xl font-bold">Zaloguj się</h2>
            <form
                className="flex flex-col gap-7 mt-12 max-w-md mx-auto px-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <FormInput form={form} name="email" icon={<User />} label="Adres e-mail" />

                <div>
                    <FormPasswordInput form={form} name="password" icon={<Lock />} label="Hasło" />

                    <div className="flex justify-end mt-2">
                        <button
                            type="button"
                            className="bg-transparent border-none cursor-pointer text-gray-300 transition-colors duration-100 hover:text-gray-400 no-underline text-xs"
                            onClick={() => {
                                modals.closeAll();

                                modals.open({
                                    children: <RemindPasswordForm />,
                                });
                            }}
                        >
                            Zapomniałem hasła
                        </button>
                    </div>
                </div>

                <div className="relative flex flex-col mt-8">
                    <Button type="submit" className="min-w-full" size="md" loading={isPending}>
                        Zaloguj się
                    </Button>

                    <FormError error={error} className="text-center" />
                </div>
            </form>

            <Oauth2 />

            <p className="mt-8 text-center text-sm text-gray-500">
                Nie masz konta?
                <button
                    onClick={() => {
                        modals.closeAll();
                        modals.open({
                            children: <RegisterForm />,
                        });
                    }}
                    className="bg-transparent border-none cursor-pointer text-blue-500 ml-1 underline"
                >
                    Zarejestruj się
                </button>
            </p>
        </div>
    );
}
