import { useEffect } from 'react';
import { useFurnitureStore } from './stores/FurnitureStore';
import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, RouterProvider } from '@tanstack/react-router';
import { router } from '@/Common/lib/router/index';
import useAuth from '@/Auth/hooks/useAuth';
import { ModalsProvider } from '@mantine/modals';

const queryClient = new QueryClient();

function App() {
    const { getCategories } = useFurnitureStore();
    const { isAuth, isPending } = useAuth();

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <MantineProvider>
                    <Notifications />
                    <ModalsProvider
                        modalProps={{
                            overlayProps: {
                                backgroundOpacity: 0.55,
                                blur: 3,
                            },
                            radius: 10,
                        }}
                    >
                        <AppShell>
                            <Outlet />
                        </AppShell>
                    </ModalsProvider>
                </MantineProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;
