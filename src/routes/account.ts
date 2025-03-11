import { authRoute } from '@/Common/lib/router/helpers';
import Account from '@/User/pages/Account';

export const Route = authRoute({
    path: '/account',
    component: Account,
});
