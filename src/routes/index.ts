import Homepage from '@/pages/Homepage';
import { publicRoute } from '@/common/lib/router/helpers';
// import { withAuth } from '@/common/lib/router/helpers';

export const Route = publicRoute({
    path: '/',
    component: Homepage,
});
