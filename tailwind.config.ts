import type { Config } from 'tailwindcss';
import { appConfig } from './src/config/app';

const config: Config = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false,
    },
};

export default config;
