import { createFileRoute, redirect, type FileRoutesByPath, type RouteComponent } from '@tanstack/react-router';

type RouteProps = {
    path: keyof FileRoutesByPath;
    component: RouteComponent<any>;
    beforeLoad?: (args: { search: Record<string, string> }) => void;
};

export const publicRoute = (route: RouteProps) => {
    return createFileRoute(route.path)({
        component: route.component,

        beforeLoad: ({ search }) => {
            route.beforeLoad?.({ search });
        },
        pendingMinMs: 0,
    });
};
