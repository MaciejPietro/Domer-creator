import type { Config } from 'tailwindcss';
import { appConfig } from './src/config/app';

const config: Config = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                blue: {
                    50: '#ebf5ff',
                    100: '#d0eaff',
                    200: '#a3d6ff',
                    300: '#66baff',
                    400: '#339cff',
                    500: '#1c8ee5',
                    600: '#1c7ed6',
                    700: '#1a66b3',
                    800: '#184e91',
                    900: '#123570',
                },
            },
        },
    },
    corePlugins: {
        preflight: false,
    },
};

export default config;
