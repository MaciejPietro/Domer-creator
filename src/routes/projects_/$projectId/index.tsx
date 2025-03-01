import { publicRoute } from '@/common/lib/router/helpers';

const Project = () => {
    return <div>Project</div>;
};

export const Route = publicRoute({
    path: '/projects/$projectId',
    component: Project,
});
