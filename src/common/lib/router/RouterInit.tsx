import useAuth from '@/Auth/hooks/useAuth';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '.';

const RouterInit = () => {
    const { isAuth, isPending } = useAuth();

    return isPending ? null : <RouterProvider router={router} context={{ auth: { isAuth } }} />;
};

export default RouterInit;
