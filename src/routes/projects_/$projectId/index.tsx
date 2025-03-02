import { publicRoute } from '@/Common/lib/router/helpers';

const Project = () => {
    return <div>Project</div>;
};

export const Route = publicRoute({
    path: '/Projects/$projectId',
    component: Project,
});
