import type { ApiError } from '@/Common/api/types';
import type { AxiosError } from 'axios';
import clsx from 'clsx';

type ComponentProps = {
    error: AxiosError<ApiError, any> | null;
    className?: string;
};

const FormError = ({ error, className }: ComponentProps) => {
    if (!error) return <div className='my-2 h-5' aria-hidden></div>;

    let errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message;

    const singleErrorMessage = error.response?.data?.errors?.[0]?.message;

    if (singleErrorMessage) {
        errorMessage = singleErrorMessage;
    }

    return errorMessage ? (
        <div className={clsx('h-5 text-sm my-2  text-red-500 block', className)}>{errorMessage}</div>
    ) : null;
};

export default FormError;
