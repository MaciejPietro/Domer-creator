import type { RemindPasswordPayload } from '@/Auth/types';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/Common/api/types';
import Service from '@/Auth/api/Service';
import { useNavigate } from '@tanstack/react-router';

const useRemindPassword = () => {
    const navigate = useNavigate();

    return useMutation<unknown, AxiosError<ApiError, any>, RemindPasswordPayload>({
        mutationKey: ['auth', 'remindpassword'],
        mutationFn: Service.remindPassword,
        onSuccess: () => {
            // void navigate({ to: "/zresetuj-haslo-wyslano" });
        },
    });
};

export default useRemindPassword;
