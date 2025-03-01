import { createRoot } from 'react-dom/client';

import '@mantine/dropzone/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import './index.css';

import App from './App';
import React from 'react';

const rootElement = document.querySelector('#root') as Element;

if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
