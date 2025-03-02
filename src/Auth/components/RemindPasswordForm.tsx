import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import useRemindPassword from '@/Auth/hooks/useRemindPassword';

import FormError from '@/Common/components/form/FormError';

import AvatarIcon from '@/Auth/assets/icons/avatar.svg?react';

import { Button } from '@mantine/core';
import LoginForm from './LoginForm';
import { modals } from '@mantine/modals';
import { ArrowLeft, CircleCheck, User } from 'tabler-icons-react';
import { validateEmail } from '../helpers';
import FormInput from '@/Common/components/form/fields/FormInput';

export default function RemindPasswordForm() {
    const { mutateAsync, error, isPending, isSuccess } = useRemindPassword();

    const form = useForm({
        defaultValues: {
            email: '',
        },
        validators: {
            onBlur: ({ value }) => ({
                fields: {
                    email: validateEmail(value.email),
                },
            }),
        },
        onSubmit: ({ value }) => void mutateAsync(value),
    });

    if (isSuccess) {
        return <EmailSentSuccess />;
    }

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
                <FormInput form={form} name="email" icon={<User />} label="Adres e-mail" />

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

const EmailSentSuccess = () => {
    return (
        <div>
            <div className="flex flex-col items-center gap-2 pb-6">
                <CircleCheck size={100} className="text-blue-600" />
                <h1 className="text-3xl font-bold mb-0">Wysłano link do zmiany hasła!</h1>
                <p className="text-center mb-6 block">
                    Sprawdź swoją skrzynkę pocztową, <br /> i kliknij w link wysłany na podany adres e-mail.
                </p>
            </div>
        </div>
    );
};
