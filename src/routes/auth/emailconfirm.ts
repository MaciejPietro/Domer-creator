import { publicRoute } from '@/Common/lib/router/helpers';
import { isValidEmail } from '@/Auth/helpers';
import { redirect } from '@tanstack/react-router';
import EmailConfirm from '@/pages/EmailConfirm';
// import { withAuth } from '@/Common/lib/router/helpers';

export type EmailConfirmSearchParams = {
    token?: string;
    email?: string;
};

export const Route = publicRoute({
    path: '/auth/emailconfirm',
    component: EmailConfirm,
    beforeLoad: ({ search }: { search: EmailConfirmSearchParams }) => {
        if (!search.token || !search.email || !isValidEmail(search.email)) {
            // @ts-expect-error fix it ?
            return redirect({ to: '/' });
        }

        return;
    },
});
