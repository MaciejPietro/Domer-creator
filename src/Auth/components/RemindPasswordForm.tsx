import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import useRemindPassword from '@/Auth/hooks/useRemindPassword';

import FormError from '@/Common/components/form/FormError';

import AvatarIcon from '@/Auth/assets/icons/avatar.svg?react';

import FormEmailInput from '@/Common/components/form/fields/FormEmailInput';
import { Button } from '@mantine/core';
import LoginForm from './LoginForm';
import { modals } from '@mantine/modals';

export default function RemindPasswordForm() {
    const { mutateAsync, error, isPending } = useRemindPassword();

    const form = useForm({
        defaultValues: {
            email: '',
        },
        onSubmit: ({ value }) => void mutateAsync(value),
    });

    return (
        <div>
            <h2 className="px-6 text-center text-2xl font-bold">Przypomnij hasło</h2>

            <p className="text-gray-500 text-sm  mt-2 text-center">
                Wpisz adres e-mail swojego konta, <br /> aby otrzymać link do zmiany hasła
            </p>

            <form
                className="flex flex-col gap-7 mt-12 max-w-md mx-auto"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <FormEmailInput form={form} name="email" icon={<AvatarIcon />} label="E-mail" required />

                <div className="relative flex flex-col mt-5">
                    <Button type="submit" className="min-w-full rounded-xl h-11 text-lg" loading={isPending}>
                        Wyślij link
                    </Button>

                    <FormError error={error} className="text-center" />
                </div>
            </form>

            <p className="mt-2 text-center text-sm text-gray-500">
                Znasz swoje hasło?
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
