import type { LoginPayload, LoginResponse } from '@/Auth/types';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import Service from '@/Auth/api/Service';
import useAuthStore, { type User } from '@/Auth/authStore';
import type { ApiError, ApiResponse } from '@/Common/api/types';
import { useNavigate } from '@tanstack/react-router';
// import { toastSuccess } from '@/Common/lib/toast';

const useLogin = () => {
    const { setAuth, setUser, checkAuth } = useAuthStore();

    // const navigate = useNavigate();

    return useMutation<ApiResponse<LoginResponse>, AxiosError<ApiError, any>, LoginPayload>({
        mutationKey: ['auth', 'login'],
        mutationFn: Service.login,
        onSuccess: (response) => {
            // toastSuccess('Zalogowano pomyślnie');
            // setToken(response.data.token);

            setAuth(true);
            setUser({
                email: response.data.user,
                username: response.data.user,
            } as User);
            checkAuth();
            // navigate({ to: '/' });
        },
    });
};

export default useLogin;
