import Homepage from '@/pages/Homepage';
import { publicRoute } from '@/Common/lib/router/helpers';
// import { withAuth } from '@/Common/lib/router/helpers';

export const Route = publicRoute({
    path: '/',
    component: Homepage,
});
