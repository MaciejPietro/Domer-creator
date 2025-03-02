import type { LoginPayload, RegisterPayload, RemindPasswordPayload, ResetPasswordPayload } from '@/Auth/types';

import axiosClient, { publicAxiosClient } from '@/Common/api/Client';

export default {
    login: async (values: LoginPayload) => {
        return axiosClient.post(`/login`, values);
    },
    register: async (values: RegisterPayload) =>
        publicAxiosClient.post(`/register`, {
            ...values,
        }),
    logout: () => axiosClient.post(`/logout`),
    // confirmEmail: (token: string, email: string) =>
    //   axiosClient.get(`/auth/emailconfirmation?token=${token}&email=${email}`),
    remindPassword: (values: RemindPasswordPayload) =>
        publicAxiosClient.post(`/reset-password/request`, {
            ...values,
        }),
    resetPassword: (values: ResetPasswordPayload) => axiosClient.post(`/reset-password/reset`, values),
};
