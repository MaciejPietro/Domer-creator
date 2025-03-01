import { publicRoute } from '@/common/lib/router/helpers';

const Projects = () => {
    return <div>Projects list</div>;
};

export const Route = publicRoute({
    path: '/projects',
    component: Projects,
});
