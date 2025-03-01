import { useEffect } from 'react';
import { useFurnitureStore } from './stores/FurnitureStore';
import { AppShell, MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from '@mantine/emotion';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/common/lib/router/index';
import AppSidebar from './common/components/AppSidebar';

const queryClient = new QueryClient();

function App() {
    const { getCategories } = useFurnitureStore();

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <MantineProvider>
                <MantineEmotionProvider>
                    <QueryClientProvider client={queryClient}>
                        <Notifications />
                        <AppShell>
                            <RouterProvider router={router} context={{ auth: { isAuth: true } }} />
                        </AppShell>
                    </QueryClientProvider>
                </MantineEmotionProvider>
            </MantineProvider>
        </>
    );
}

export default App;
