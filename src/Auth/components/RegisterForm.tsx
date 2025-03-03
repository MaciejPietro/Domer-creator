import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import useRegister from '@/Auth/hooks/useRegister';
import { ArrowLeft, CircleCheck, User } from 'tabler-icons-react';

import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import FormError from '@/Common/components/form/FormError';

import { Lock } from 'tabler-icons-react';

import FormInput from '@/Common/components/form/fields/FormInput';
import type { RegisterPayload } from '@/Auth/types';
import Oauth2 from '../components/Oauth2';
import PasswordRules from '../components/PasswordRules';
import { modals } from '@mantine/modals';
import LoginForm from './LoginForm';
import { Button } from '@mantine/core';
import { validateEmail, validatePassword, validatePasswordConfirmation, validateUsername } from '../helpers';

export default function Register() {
    const { isSuccess, mutateAsync, error, isPending } = useRegister();

    const form = useForm({
        defaultValues: {
            // username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validators: {
            onBlur: ({ value }) => ({
                fields: {
                    // username: validateUsername(value.username),
                    email: validateEmail(value.email),
                    password: validatePassword(value.password),
                    passwordConfirmation: validatePasswordConfirmation(value.password, value.passwordConfirmation),
                },
            }),
        },
        onSubmit: async ({ value }) => {
            const formData: RegisterPayload = {
                // username: value.username,
                email: value.email,
                password: value.password,
                clientUri: `${window.location.origin}/auth/emailconfirm`,
            };

            await mutateAsync(formData);
        },
    });

    if (isSuccess) return <RegisterSuccess />;

    return (
        <div>
            <h2 className="px-6 text-center text-2xl font-bold">Rejestracja</h2>

            <form
                className="flex flex-col gap-7 mt-12 max-w-md mx-auto"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                {/* <FormInput form={form} name="username" icon={<AvatarIcon />} label="Nazwa użytkownika" /> */}

                <FormInput form={form} name="email" icon={<User />} label="Adres e-mail" />

                <FormPasswordInput form={form} name="password" icon={<Lock />} label="Hasło" />

                <FormPasswordInput form={form} name="passwordConfirmation" icon={<Lock />} label="Powtórz hasło" />

                {/* <div className="ml-auto w-max">
                    <PasswordRules />
                </div> */}

                <div className="relative flex flex-col mt-8">
                    <Button type="submit" className="min-w-full" size="md" loading={isPending}>
                        Zarejestruj się
                    </Button>

                    <FormError error={error} className="text-center" />
                </div>
            </form>

            <Oauth2 />

            <p className="mt-8 text-center text-sm text-gray-500">
                Masz konto?
                <button
                    onClick={() => {
                        modals.closeAll();
                        modals.open({
                            children: <LoginForm />,
                        });
                    }}
                    className="bg-transparent border-none cursor-pointer text-blue-500 ml-1 underline"
                >
                    Zaloguj się
                </button>
            </p>
        </div>
    );
}

const RegisterSuccess = () => {
    return (
        <div>
            <div className="flex flex-col items-center gap-2 pb-6">
                <CircleCheck size={100} className="text-blue-600" />
                <h1 className="text-4xl font-bold mb-0">Dziękujemy!</h1>
                <p className="text-center mb-6 block">
                    Sprawdź swoją skrzynkę pocztową, <br /> aby potwierdzić adres e-mail.
                </p>

                <Button
                    onClick={() => {
                        modals.closeAll();
                        modals.open({
                            children: <LoginForm />,
                        });
                    }}
                    size="md"
                    leftSection={<ArrowLeft size={16} />}
                >
                    Zaloguj się
                </Button>
            </div>
        </div>
    );
};
