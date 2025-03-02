import { useForm } from "@tanstack/react-form";
import { useSearch } from "@tanstack/react-router";

import FormPasswordInput from "@/Common/components/form/fields/FormPasswordInput";
import FormError from "@/Common/components/form/FormError";

import LeafPicture from "@/Auth/assets/pictures/leaf.svg?react";
import LockIcon from "@/Auth/assets/icons/lock.svg?react";

import Button from "@/Common/components/ui/Button";
import BackButton from "@/Common/components/ui/BackButton";
import type { ResetPasswordSearchParams } from "@/routes/reset-password";
import useResetPassword from "../hooks/useResetPassword";
import type { ResetPasswordPayload } from "../types";

export default function Register() {
  const search: Required<ResetPasswordSearchParams> = useSearch({
    strict: false,
  });

  const { mutateAsync, isPending, error } = useResetPassword();

  const form = useForm<{
    password: string;
    repeatPassword: string;
  }>({
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
    onSubmit: async ({ value }) => {
      const formData: ResetPasswordPayload = {
        password: value.password,
        token: search.token,
      };

      await mutateAsync(formData);
    },
  });

  return (
    <div className="px-4">
      <div className="relative">
        <div className="h-24 flex items-center">
          <BackButton to="/logowanie" />
        </div>

        <LeafPicture className="absolute bottom-0 -right-4 w-28 transform translate-y-1/2" />
      </div>

      <div className="mt-12">
        <h1 className="text-green-500 text-4xl font-semibold text-center">
          Zmień hasło
        </h1>
        <p className="text-gray-500 text-lg mt-2 text-center">
          Podaj nowe hasło
        </p>

        <form.Provider>
          <form
            className="flex flex-col gap-7 mt-12 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <FormPasswordInput
              form={form}
              name="password"
              icon={<LockIcon className="size-5" />}
              label="Nowe Hasło"
            />

            <FormPasswordInput
              form={form}
              name="passwordConfirmation"
              icon={<LockIcon className="size-5" />}
              label="Powtórz nowe hasło"
            />

            <div className="relative flex flex-col mt-8">
              <Button type="submit" className="min-w-full" loading={isPending}>
                Zmień hasło
              </Button>

              <FormError error={error} className="text-center" />
            </div>
          </form>
        </form.Provider>
      </div>
    </div>
  );
}
