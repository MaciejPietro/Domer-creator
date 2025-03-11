import { Button } from '@mantine/core';
import FormError from '@/Common/components/form/FormError';
import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import useDeleteAccount from '@/hooks/useDeleteAccount';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import useUser from '../hooks/useUser';

const DeleteAccountModal = () => {
    const user = useUser();
    const [active, setActive] = useState(false);
    const { mutateAsync, isPending, error } = useDeleteAccount();

    const handleDelete = () => {
        // void mutateAsync();
        setActive(true);
    };

    const form = useForm<any>({
        defaultValues: {
            password: '',
        },
        onSubmit: async ({ value }) => {
            await mutateAsync({
                id: user.id,
                password: value.password,
            });
        },
    });

    return (
        <div>
            <p className="text-sm text-gray-500">Aby usunąć swoje konto, musisz podać swoje hasło.</p>

            <form
                className="flex flex-col gap-1 max-w-xl mt-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <FormPasswordInput form={form} name={'password'} label={'Hasło'} />

                <div className="relative flex flex-col mt-3">
                    <FormError error={error} />

                    <div className="space-x-4">
                        <Button type="submit" color="red" loading={isPending}>
                            Usuń konto
                        </Button>
                        <Button
                            type="button"
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                                setActive(false);
                            }}
                        >
                            Anuluj
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DeleteAccountModal;
