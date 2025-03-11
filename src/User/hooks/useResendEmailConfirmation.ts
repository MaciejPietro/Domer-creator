import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import UserService from '@/User/api/Service';
import useUser from '@/User/hooks/useUser';
import { ApiResponse } from '@/Auth/types';

const useResendEmailConfirmation = () => {
    const user = useUser();

    if (!user?.email) {
        throw new Error('User email should be available on this stage');
    }

    return useMutation<ApiResponse, AxiosError<string, any>>({
        mutationKey: ['auth', 'resendEmailConfirmation'],
        mutationFn: () => UserService.resendEmailConfirmation(user?.email),
        onSuccess: () => {
            // toastSuccess('Email został wysłany ponownie.');
        },
    });
};

export default useResendEmailConfirmation;
