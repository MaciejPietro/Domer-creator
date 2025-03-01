// import type { AuthState } from "@/Auth/hooks/useAuth";

import { createRootRouteWithContext } from '@tanstack/react-router';

interface MyRouterContext {
    //   auth: Pick<AuthState, "isAuth">;
    auth: {
        isAuth: boolean;
    };
}

export const Route = createRootRouteWithContext<MyRouterContext>()();
