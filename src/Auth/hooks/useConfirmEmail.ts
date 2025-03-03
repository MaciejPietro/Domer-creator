import type { ApiResponse, ConfirmEmailPayload } from '@/Auth/types';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import AuthService from '@/Auth/api/Service';
import useAuthStore from '../authStore';

type LoginResponse = ApiResponse & {
    status: number;
};

const useConfirmEmail = () => {
    const { checkAuth } = useAuthStore();

    return useMutation<LoginResponse, AxiosError<string, any>, ConfirmEmailPayload>({
        mutationFn: AuthService.confirmEmail,
        onSuccess: () => {
            return true;
        },
    });
};

export default useConfirmEmail;
