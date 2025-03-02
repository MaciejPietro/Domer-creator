import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import useRegister from '@/Auth/hooks/useRegister';

import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import FormError from '@/Common/components/form/FormError';

import AvatarIcon from '@/Auth/assets/icons/avatar.svg?react';
import LockIcon from '@/Auth/assets/icons/lock.svg?react';

import FormInput from '@/Common/components/form/fields/FormInput';
import FormEmailInput from '@/Common/components/form/fields/FormEmailInput';
import type { RegisterPayload } from '@/Auth/types';
import Oauth2 from '../components/Oauth2';
import PasswordRules from '../components/PasswordRules';
import { modals } from '@mantine/modals';
import LoginForm from './LoginForm';
import { Button } from '@mantine/core';

export default function Register() {
    const { mutateAsync, error, isPending } = useRegister();

    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: ({ value }) => {
            const formData: RegisterPayload = {
                username: value.username,
                email: value.email,
                password: value.password,
            };

            void mutateAsync(formData);
        },
    });

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
                <FormInput form={form} name="username" icon={<AvatarIcon />} label="Nazwa użytkownika" required />

                <FormEmailInput form={form} name="email" icon={<AvatarIcon />} label="E-mail" required />

                <FormPasswordInput form={form} name="password" icon={<LockIcon />} label="Hasło" />

                <FormPasswordInput form={form} name="passwordConfirmation" icon={<LockIcon />} label="Powtórz hasło" />

                <div className="ml-auto w-max">
                    <PasswordRules />
                </div>

                <div className="relative flex flex-col mt-8">
                    <Button type="submit" className="min-w-full rounded-xl h-11 text-lg" loading={isPending}>
                        Zarejestruj się
                    </Button>

                    <FormError error={error} className="text-center" />
                </div>
            </form>

            <Oauth2 />

            <p className="mt-2 text-center text-sm text-gray-500">
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
