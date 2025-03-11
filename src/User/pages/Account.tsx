import FormInput from '@/Common/components/form/fields/FormInput';
import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import FormError from '@/Common/components/form/FormError';
import Main from '@/Common/layouts/Main';
import useUpdateUser from '@/hooks/useUpdateUser';
import useUser from '@/User/hooks/useUser';
import type { UpdateUserPayload } from '@/User/types';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPencil } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import ConfirmEmailField from '../components/ConfirmEmailField';
import DeleteAccount from '../components/DeleteAccount';
import UserDetailsModal from '../components/UserDetailsModal';
import UserPasswordModal from '../components/UserPasswordModal';

const Account = () => {
    const user = useUser();
    const { mutateAsync, isPending, error } = useUpdateUser();
    const [formKey, setFormKey] = useState(0);

    const form = useForm({
        defaultValues: {
            email: user.email,
            currentPassword: '',
            password: '',
            repeatPassword: '',
        },
        onSubmit: async ({ value }) => {
            const formData: UpdateUserPayload = {
                id: user.id.toString(),
            };

            if (value.email !== user.email) {
                formData.email = value.email;
            }

            if (value.password && value.repeatPassword && value.currentPassword) {
                formData.currentPassword = value.currentPassword;
                formData.password = value.password;
            }

            await mutateAsync(formData);
            setFormKey((prev) => prev + 1);
            form.reset();
        },
    });

    return (
        <Main>
            <h2 className="text-xl leading-7 text-gray-900">Ustawienia konta</h2>

            <div className="border border-gray-200  bg-white rounded-2xl max-w-2xl mt-8">
                <div className="p-8">
                    <div className="flex justify-between">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Ogólne</h2>

                        <Button
                            variant="light"
                            color="gray"
                            size="sm"
                            leftSection={<IconPencil className="size-4 -mr-1" />}
                            onClick={() => {
                                modals.open({
                                    title: 'Edytuj dane',
                                    children: <UserDetailsModal />,
                                });
                            }}
                        >
                            Edytuj
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 mt-4 text-gray-700">
                        <div>
                            <p className="font-semibold text-sm">Email</p>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-b border-gray-200">
                    <Button
                        variant="light"
                        color="gray"
                        size="sm"
                        leftSection={<IconPencil className="size-4 -mr-1" />}
                        onClick={() => {
                            modals.open({
                                children: <UserPasswordModal />,
                            });
                        }}
                    >
                        Zmień hasło
                    </Button>
                </div>

                <div className="p-8 border-b border-gray-200">
                    <ConfirmEmailField />
                </div>

                <div className="p-8 ">
                    <DeleteAccount />
                </div>
            </div>
        </Main>
    );
};

export default Account;
