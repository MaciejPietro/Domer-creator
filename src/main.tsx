import { createRoot } from 'react-dom/client';

import '@mantine/dropzone/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import './index.css';

import React from 'react';
import RouterInit from './Common/lib/router/RouterInit';

const rootElement = document.querySelector('#root') as Element;

if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <RouterInit />
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
