import { useEffect } from 'react';
import { useFurnitureStore } from './stores/FurnitureStore';
import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, RouterProvider } from '@tanstack/react-router';
import { router } from '@/Common/lib/router/index';
import useAuth from '@/Auth/hooks/useAuth';
import { ModalsProvider } from '@mantine/modals';
import { theme } from './Common/lib/mantine/theme';

const queryClient = new QueryClient();

const App = () => {
    const { isAuth, isPending } = useAuth();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme}>
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
};

export default App;
