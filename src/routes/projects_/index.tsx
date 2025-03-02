import { publicRoute } from '@/Common/lib/router/helpers';
import Projects from '@/pages/Projects';

export const Route = publicRoute({
    path: '/projects',
    component: Projects,
});
