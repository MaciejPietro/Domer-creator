import FormInput from '@/Common/components/form/fields/FormInput';
import FormPasswordInput from '@/Common/components/form/fields/FormPasswordInput';
import FormError from '@/Common/components/form/FormError';
import useUpdateUser from '@/hooks/useUpdateUser';
import useUser from '@/User/hooks/useUser';
import type { UpdateUserPayload } from '@/User/types';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { Mail, Lock } from 'tabler-icons-react';
import Main from '../Common/layouts/Main';

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
            <div className="px-8">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Ustawienia konta</h2>
            </div>

            <div className="md:col-span-2 px-8 my-8">
                <form
                    key={formKey}
                    className="flex flex-col gap-5 max-w-xl"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void form.handleSubmit();
                    }}
                >
                    <FormInput form={form} name="email" icon={<Mail />} label="Email" />

                    <FormPasswordInput form={form} name="password" icon={<Lock />} label="Hasło" />

                    <div className="relative pb-10 flex flex-col mt-4">
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

                        <FormError error={error} />
                    </div>
                </form>
            </div>

            {/* <div className="p-8 border-t border-gray-300">
        <ConfirmEmailField />
      </div>

      <div className="p-8 border-t border-gray-300">
        <DeleteAccount />
      </div> */}
        </Main>
    );
};

export default Account;
