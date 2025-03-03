import { useForm } from '@tanstack/react-form';
import { useSearch } from '@tanstack/react-router';

import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import FormError from '@/Common/components/form/FormError';

import LeafPicture from '@/Auth/assets/pictures/leaf.svg?react';
import LockIcon from '@/Auth/assets/icons/lock.svg?react';

import type { ResetPasswordSearchParams } from '@/routes/auth/resetpassword';
import useResetPassword from '../hooks/useResetPassword';
import type { ResetPasswordPayload } from '../types';

import { ArrowLeft, CircleCheck, Lock } from 'tabler-icons-react';
import { Button } from '@mantine/core';
import { validatePassword, validatePasswordConfirmation } from '../helpers';
import { modals } from '@mantine/modals';
import LoginForm from '../components/LoginForm';

export default function Register() {
    // @ts-expect-error fix me
    const search: Required<ResetPasswordSearchParams> = useSearch({
        strict: true,
    });

    const { mutateAsync, isPending, error, isSuccess } = useResetPassword();

    const form = useForm({
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        },
        validators: {
            onBlur: ({ value }) => ({
                fields: {
                    password: validatePassword(value.password),
                    passwordConfirmation: validatePasswordConfirmation(value.password, value.passwordConfirmation),
                },
            }),
        },
        onSubmit: async ({ value }) => {
            const formData: ResetPasswordPayload = {
                email: search.email,
                password: value.password,
                token: search.token,
            };

            await mutateAsync(formData);
        },
    });

    if (isSuccess) {
        return <ResetPasswordSuccess />;
    }

    return (
        <div>
            <h2 className="px-6 text-center text-2xl font-bold">Ustaw nowe hasło</h2>
            <form
                className="flex flex-col gap-7 mt-12 max-w-md mx-auto px-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <FormPasswordInput form={form} name="password" icon={<Lock />} label="Hasło" />

                <FormPasswordInput form={form} name="passwordConfirmation" icon={<Lock />} label="Powtórz hasło" />

                <div className="relative flex flex-col my-8">
                    <Button type="submit" className="min-w-full" size="md" loading={isPending}>
                        Zmien hasło
                    </Button>

                    <FormError error={error} className="text-center" />
                </div>
            </form>
        </div>
    );
}

const ResetPasswordSuccess = () => {
    return (
        <div>
            <div className="flex flex-col items-center gap-2 pb-6">
                <CircleCheck size={100} className="text-blue-600" />
                <h1 className="text-3xl font-bold mb-0">Hasło zmienione!</h1>
                <p className="text-center mb-6 block">Możesz się teraz zalogować.</p>

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
