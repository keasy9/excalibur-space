import {defineConfig} from 'vite';
import path from 'path';
import vuePlugin from '@vitejs/plugin-vue';

export default defineConfig({
    base: './',
    publicDir: 'assets',
    plugins: [vuePlugin()],
    optimizeDeps: {
        exclude: ['excalibur'],
    },
    build: {
        outDir: 'public',
        emptyOutDir: true,
        assetsInlineLimit: 0,
        sourcemap: true,
        rolldownOptions: {
            keepNames: true,
            output: {
                format: 'umd'
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src'),
        }
    },
    server: {
        host: true,
        allowedHosts: true,
    },
});
