import {defineConfig} from "vite";
import path from "path";

export default defineConfig({
    base: './',
    plugins: [],
    optimizeDeps: {
        exclude: ["excalibur"],
    },
    build: {
        assetsInlineLimit: 0,
        sourcemap: true,
        rollupOptions: {
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
