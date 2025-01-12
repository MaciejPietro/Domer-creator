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
        server: {
            port: 3000,
            proxy: {
                '/iframe-app': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/iframe-app/, ''),
                },
            },
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
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
