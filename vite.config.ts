import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

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
        plugins: [react(), TanStackRouterVite({ target: 'react', autoCodeSplitting: true }), , svgr()],
        server: {
            host: true,
            // strictPort: true,
            // cors: true,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        test: {
            environment: 'jsdom',
            setupFiles: ['./vitest.setup.ts'],
            css: true,
        },
        esbuild: {
            drop: ['console', 'debugger'],
        },
        // define: processEnvValues,
    };
});
