import { authRoute } from '@/Common/lib/router/helpers';
import Account from '@/pages/Account';

export const Route = authRoute({
    path: '/account',
    component: Account,
});
