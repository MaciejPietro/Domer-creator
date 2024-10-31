import '@mantine/dropzone/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import './index.css';

import App from './App';
import { createRoot } from 'react-dom/client';

const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer!);
root.render(<App />);
