import { AxiosError } from 'axios';

export const handleApiError = (err: unknown, defaultMsg = 'Coś poszło nie tak') => {
    let msg = defaultMsg;

    if (err instanceof AxiosError) {
        if (err.response?.data.message) {
            msg = err.response?.data.message;
        }
    }

    throw new Error(msg);
};
