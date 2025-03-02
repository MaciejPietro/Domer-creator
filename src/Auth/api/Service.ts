import type {
    ConfirmEmailPayload,
    LoginPayload,
    RegisterPayload,
    RemindPasswordPayload,
    ResetPasswordPayload,
} from '@/Auth/types';

import axiosClient, { publicAxiosClient } from '@/Common/api/Client';

export default {
    login: (values: LoginPayload) => axiosClient.post(`/auth/login`, values),
    register: (values: RegisterPayload) => axiosClient.post(`/auth/register`, values),
    logout: () => axiosClient.post(`/auth/logout`, {}),
    confirmEmail: (values: ConfirmEmailPayload) => axiosClient.post(`/auth/confirmemail`, values),
    remindPassword: (values: RemindPasswordPayload) => axiosClient.post(`/auth/remindpassword`, values),
    resetPassword: (values: ResetPasswordPayload) => axiosClient.post(`/auth/resetpassword`, values),
};
