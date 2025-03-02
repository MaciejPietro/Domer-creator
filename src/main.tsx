import { createRoot } from 'react-dom/client';

import '@mantine/dropzone/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import './index.css';

import App from './App';
import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './Common/lib/router';

const rootElement = document.querySelector('#root') as Element;

if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}

{
    /* <ModalsProvider
modalProps={{
    overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
    },
    radius: 10,
}}
> */
}
