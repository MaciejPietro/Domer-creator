import { useEffect } from 'react';
import { PageLayout } from './ui/Layout/PageLayout';
import { useFurnitureStore } from './stores/FurnitureStore';
import { AppShell, MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from '@mantine/emotion';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/common/lib/router/index';

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

                        <RouterProvider router={router} context={{ auth: { isAuth: true } }} />
                    </QueryClientProvider>
                </MantineEmotionProvider>
            </MantineProvider>
        </>
    );
}

export default App;
