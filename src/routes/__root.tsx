// import type { AuthState } from "@/Auth/hooks/useAuth";

import App from '@/App';
import { AuthState } from '@/Auth/hooks/useAuth';
import { createRootRouteWithContext } from '@tanstack/react-router';

interface MyRouterContext {
    auth: Pick<AuthState, 'isAuth'>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: App,
});
