import { useEffect } from 'react';
import './App.css';
import { PageLayout } from './ui/Layout/PageLayout';
import {useFurnitureStore} from './stores/FurnitureStore'
import { Notifications } from '@mantine/notifications';
import { AppShell, MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from '@mantine/emotion';

function App() {
  const {getCategories} = useFurnitureStore();

  useEffect(() => {
    getCategories()
  },[])
  return (
    <>
          <MantineProvider >
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
