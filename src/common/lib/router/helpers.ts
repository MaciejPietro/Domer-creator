import { createFileRoute, redirect, type FileRoutesByPath, type RouteComponent } from '@tanstack/react-router';
import { error } from 'console';

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

export const authRoute = (route: { path: keyof FileRoutesByPath; component: RouteComponent<any> }) => {
    return createFileRoute(route.path)({
        component: route.component,

        beforeLoad: ({ context }) => {
            console.log('xdxd,', context);

            if (!context.auth.isAuth) {
                // @ts-expect-error fix me
                throw redirect({
                    to: '/auth/login',
                });
            }
        },
        pendingMinMs: 0,
    });
};
