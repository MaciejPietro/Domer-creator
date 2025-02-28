import { useEffect } from 'react';
import { PageLayout } from './ui/Layout/PageLayout';
import { useFurnitureStore } from './stores/FurnitureStore';
import { AppShell, MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from '@mantine/emotion';
import { Notifications } from '@mantine/notifications';

function App() {
    const { getCategories } = useFurnitureStore();

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <MantineProvider>
                <MantineEmotionProvider>
                    <Notifications />
                    <AppShell>
                        <PageLayout />
                    </AppShell>
                </MantineEmotionProvider>
            </MantineProvider>
        </>
    );
}

export default App;
