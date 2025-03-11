import FormInput from '@/Common/components/form/fields/FormInput';
import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import useUpdateUser from '@/hooks/useUpdateUser';
import useUser from '@/User/hooks/useUser';
import type { UpdateUserPayload } from '@/User/types';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'tabler-icons-react';

const UserDetailsModal = () => {
    const user = useUser();
    const { mutateAsync, isPending, error } = useUpdateUser();
    const [formKey, setFormKey] = useState(0);
    const [canSave, setCanSave] = useState(false);

    const form = useForm({
        defaultValues: {
            email: user.email,
        },
        onChange() {},
        onSubmit: async ({ value }) => {
            const formData: UpdateUserPayload = {
                id: user.id.toString(),
            };

            if (value.email !== user.email) {
                formData.email = value.email;
            }

            await mutateAsync(formData);
            setFormKey((prev) => prev + 1);
            form.reset();
        },
    });

    return (
        <div className="-mt-4">
            <form
                key={formKey}
                className="flex flex-col gap-5 max-w-xl mt-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <FormInput form={form} name="email" icon={<Mail />} label="Email" />

                <div className="relative flex flex-col">
                    <div>
                        {/* <form.Subscribe
                                selector={(state) => {
                                    const hasDifferentEmail = state.values.email !== user.email;

                                    const hasPasswordChange =
                                        state.values.currentPassword &&
                                        state.values.password &&
                                        state.values.repeatPassword;

                                    return hasDifferentEmail || hasPasswordChange;
                                }}
                                children={(canSubmit) => (
                                    <Button type="submit" className="w-max" disabled={!canSubmit} loading={isPending}>
                                        Zapisz
                                    </Button>
                                )}
                            /> */}
                    </div>

                    {/* <FormError error={error} /> */}
                </div>

                <div className="mt-8 flex justify-between   ">
                    <Button
                        size="md"
                        variant="subtle"
                        color="gray"
                        leftSection={<ArrowLeft size={16} />}
                        onClick={() => {
                            modals.closeAll();
                        }}
                    >
                        Anuluj
                    </Button>
                    <Button size="md" loading={isPending} disabled={!canSave}>
                        Zapisz
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserDetailsModal;
