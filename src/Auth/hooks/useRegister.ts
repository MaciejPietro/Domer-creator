import type { ApiResponse, RegisterPayload } from '@/Auth/types';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import AuthService from '@/Auth/api/Service';
import { useNavigate } from '@tanstack/react-router';
import type { ApiError } from '@/Common/api/types';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type RegisterResponse = ApiResponse & {
    status: number;
};

const useRegister = () => {
    const navigate = useNavigate();

    return useMutation<RegisterResponse, AxiosError<ApiError, any>, RegisterPayload>({
        mutationKey: ['auth', 'register'],
        mutationFn: AuthService.register,
        onSuccess: () => {
            //   queueMicrotask(() => {
            //     void navigate({ to: "/zarejestrowano" });
            //   });
        },
    });
};

export default useRegister;
