import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import useAuthStore from '@/Auth/authStore';
import type { DeleteAccountPayload } from '@/User/types';
import Service from '@/User/api/Service';
import { useNavigate } from '@tanstack/react-router';
import { ApiResponse } from '@/Common/api/types';

const useDeleteAccount = () => {
    const { setUser, setAuth } = useAuthStore();
    const navigate = useNavigate();

    return useMutation<ApiResponse, AxiosError<string, any>, DeleteAccountPayload>({
        mutationKey: ['user', 'delete'],
        mutationFn: Service.delete,
        onSuccess: () => {
            setUser(null);
            setAuth(false);

            queueMicrotask(() => {
                void navigate({ to: '/' });
            });
        },
    });
};

export default useDeleteAccount;
