import { publicRoute } from '@/Common/lib/router/helpers';
import { isValidEmail } from '@/Auth/helpers';
import { redirect } from '@tanstack/react-router';
import ResetPassword from '@/pages/ResetPassword';
// import { withAuth } from '@/Common/lib/router/helpers';

export type ResetPasswordSearchParams = {
    token?: string;
    email?: string;
};

export const Route = publicRoute({
    path: '/auth/resetpassword',
    component: ResetPassword,
    beforeLoad: ({ search }: { search: ResetPasswordSearchParams }) => {
        if (!search.token || !search.email || !isValidEmail(search.email)) {
            // @ts-expect-error fix it ?
            return redirect({ to: '/' });
        }

        return;
    },
});
