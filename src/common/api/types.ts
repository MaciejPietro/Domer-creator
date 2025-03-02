import type { HttpStatusCode } from 'axios';

export type ApiResponse = {
    data: string;
};

export type ApiResponseCommand = {
    data: {
        isSuccess: boolean;
    };
    status: HttpStatusCode;
};

export type ApiResultResponse<T> = {
    data: {
        result: T;
    };
};

export type ApiError = {
    title: string;
    status: HttpStatusCode;
};

export type ApiErrors = {
    title: string;
    status: HttpStatusCode;
    errors: Array<{
        errorMessage: string;
    }>;
};
