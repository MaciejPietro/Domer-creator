export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    user: string;
};

export type RegisterPayload = {
    email: string;
    password: string;
    clientUri: string;
};

export type RemindPasswordPayload = {
    email: string;
};

export type ApiResponse = any;

export type ResetPasswordPayload = {
    password: string;
    token: string;
};

export type ConfirmEmailPayload = {
    token: string;
    email: string;
};
