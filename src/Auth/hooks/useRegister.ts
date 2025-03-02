import type { ApiResponse, RegisterPayload } from '@/Auth/types';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import AuthService from '@/Auth/api/Service';
import type { ApiError } from '@/Common/api/types';

type RegisterResponse = ApiResponse & {
    status: number;
};

const useRegister = () => {
    return useMutation<RegisterResponse, AxiosError<ApiError, unknown>, RegisterPayload>({
        mutationKey: ['auth', 'register'],
        mutationFn: AuthService.register,
    });
};

export default useRegister;
