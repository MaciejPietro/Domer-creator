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
    const { mutateAsync, isPending } = useUpdateUser();
    const [formKey, setFormKey] = useState(0);

    const form = useForm({
        defaultValues: {
            currentPassword: '',
            password: '',
            repeatPassword: '',
        },
        onSubmit: async ({ value }) => {
            const formData: UpdateUserPayload = {
                id: user.id.toString(),
            };

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
        <div>
            <form
                key={formKey}
                className="flex flex-col gap-5 max-w-xl mt-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <FormPasswordInput form={form} name="currentPassword" icon={<Lock />} label="Aktualne hasło" />

                <FormPasswordInput form={form} name="password" icon={<Lock />} label="Nowe hasło" />

                <FormPasswordInput form={form} name="repeatPassword" icon={<Lock />} label="Powtórz hasło" />

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
                    <Button size="md" loading={isPending}>
                        Zmień hasło
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserDetailsModal;
