import type { ResetPasswordPayload } from '@/Auth/types';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import AuthService from '@/Auth/api/Service';
import { useNavigate } from '@tanstack/react-router';
import type { ApiError } from '@/Common/api/types';

const useResetPassword = () => {
    //

    const navigate = useNavigate();

    return useMutation<unknown, AxiosError<ApiError, any>, ResetPasswordPayload>({
        mutationKey: ['auth', 'resetpassword'],
        mutationFn: AuthService.resetPassword,
        onSuccess: () => {
            //   toastSuccess("Hasło zostało zmienione. Możesz się zalogować.");
            //   queueMicrotask(() => {
            //     // @ts-expect-error find why
            //     void navigate({ to: "/logowanie" });
            //   });
        },
    });
};

export default useResetPassword;
