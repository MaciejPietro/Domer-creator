export type ApiResponse<T> = {
    data: T;
};

export type ApiError = {
    error: string;
    message: string;
    errors?: Array<{ property: string; message: string }>;
};
