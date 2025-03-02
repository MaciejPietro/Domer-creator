import type { DeleteAccountPayload, UpdateUserPayload } from '@/User/types';
import axiosClient from '@/Common/api/Client';

export default {
    resendEmailConfirmation: (email: string) =>
        axiosClient.post(`/user/resend-emailconfirmation`, {
            email,
            clientUri: `${window.location.origin}/auth/emailconfirm`,
        }),
    update: async (values: UpdateUserPayload) => {
        return axiosClient.patch(`/user`, values);
    },
    delete: async (values: DeleteAccountPayload) => axiosClient.delete(`/user`, { data: values }),
    info: () => axiosClient.get(`/user`),
};
