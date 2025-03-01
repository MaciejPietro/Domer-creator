import { publicRoute } from '@/common/lib/router/helpers';
import Projects from '@/pages/Projects';

export const Route = publicRoute({
    path: '/projects',
    component: Projects,
});
