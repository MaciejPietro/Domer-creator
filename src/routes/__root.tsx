// import type { AuthState } from "@/Auth/hooks/useAuth";

import App from '@/App';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

interface MyRouterContext {
    //   auth: Pick<AuthState, "isAuth">;
    auth: {
        isAuth: boolean;
    };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: App,
});
