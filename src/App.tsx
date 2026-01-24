import { PageLayout } from './ui/Layout/PageLayout';
import { AppShell, MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from '@mantine/emotion';
import { Notifications } from '@mantine/notifications';

function App() {
    return (
        <MantineProvider>
            <MantineEmotionProvider>
                <Notifications />
                <AppShell>
                    <PageLayout />
                </AppShell>
            </MantineEmotionProvider>
        </MantineProvider>
    );
}

export default App;
