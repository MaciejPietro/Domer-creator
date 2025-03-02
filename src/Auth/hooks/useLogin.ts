import type { LoginPayload } from '@/Auth/types';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import Service from '@/Auth/api/Service';
import useAuthStore from '@/Auth/authStore';
import type { ApiError, ApiResponse } from '@/Common/api/types';
import { showNotification } from '@mantine/notifications';
import { User } from '@/User/types';

type LoginResponse = ApiResponse & {
    status: number;
    data: User;
};

const useLogin = () => {
    const { setAuth, setUser } = useAuthStore();

    return useMutation<LoginResponse, AxiosError<ApiError, any>, LoginPayload>({
        mutationKey: ['auth', 'login'],
        mutationFn: Service.login,
        onSuccess: (response) => {
            showNotification({
                title: 'Zalogowano pomyślnie',
                message: '',
                color: 'green',
            });

            setAuth(true);
            setUser(response.data);
        },
    });
};

export default useLogin;
