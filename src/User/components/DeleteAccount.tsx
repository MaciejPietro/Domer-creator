import { useState } from 'react';
import { Button, Modal } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import useUser from '@/User/hooks/useUser';
import FormError from '@/Common/components/form/FormError';
import useDeleteAccount from '@/hooks/useDeleteAccount';
import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import LogoutModal from '@/Auth/components/LogoutModal';
import { modals } from '@mantine/modals';
import DeleteAccountModal from './DeleteAccountModal';

const DeleteAccount = () => {
    return (
        <>
            <div>
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Usuń konto</h2>
                    <p className="mt-1 text-xs  text-gray-400 max-w-md">
                        To działanie jest nieodwracalne. Wszystkie informacje związane z tym kontem zostaną trwale
                        usunięte.
                    </p>
                </div>

                <div className="flex items-start md:col-span-2 mt-4">
                    <Button
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => {
                            modals.open({
                                children: <DeleteAccountModal />,
                            });
                        }}
                    >
                        Tak, usuń moje konto
                    </Button>
                </div>
            </div>
        </>
    );
};

export default DeleteAccount;
