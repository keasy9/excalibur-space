import {defineConfig} from 'vite';
import path from 'path';
// @ts-ignore что-то странное
import vuePlugin from '@vitejs/plugin-vue';

export default defineConfig({
    base: './',
    plugins: [vuePlugin()],
    optimizeDeps: {
        exclude: ['excalibur'],
    },
    build: {
        assetsInlineLimit: 0,
        sourcemap: true,
        rolldownOptions: {
            output: {
                format: 'umd'
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src'),
        }
    }
});
