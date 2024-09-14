import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
    // const env = loadEnv(mode, process.cwd());

    // const processEnvValues = {
    //     'process.env': Object.entries(env).reduce(
    //         (prev, [key, val]) => ({
    //             ...prev,
    //             [key]: val,
    //         }),
    //         {}
    //     ),
    // };

    return {
        base: '/',
        plugins: [react(), svgr()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        esbuild: {
            drop: ['console', 'debugger'],
        },
        // define: processEnvValues,
    };
});
