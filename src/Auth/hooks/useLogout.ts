import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import AuthService from '@/Auth/api/Service';
import { useNavigate } from '@tanstack/react-router';
import useAuthStore from '@/Auth/authStore';
import { ApiResponse } from '@/Common/api/types';
import { showNotification } from '@mantine/notifications';

const useLogout = () => {
    const { setAuth, setUser } = useAuthStore();

    const navigate = useNavigate();

    return useMutation<ApiResponse, AxiosError<string, any>, void>({
        mutationKey: ['auth', 'logout'],
        mutationFn: AuthService.logout,
        onSuccess: () => {
            showNotification({
                title: 'Zostałeś wylogowany',
                message: '',
                color: 'green',
            });

            setAuth(false);
            setUser(null);
        },
    });
};

export default useLogout;
