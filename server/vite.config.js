import {defineConfig, normalizePath} from 'vite'
import {viteStaticCopy} from "vite-plugin-static-copy";
import {fileURLToPath, URL} from 'node:url'
import {quasar, transformAssetUrls} from "@quasar/vite-plugin";
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin';
import path from "node:path";


export default defineConfig({
    //base: '',
    //root: 'src',
    build: {
        outDir: 'public/'
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.resolve(__dirname, 'resources/public/*')),
                    dest: '.'
                }
            ]
        }),
        vue({
            template: {
                transformAssetUrls: {
                    // The Vue plugin will re-write asset URLs, when referenced
                    // in Single File Components, to point to the Laravel web
                    // server. Setting this to `null` allows the Laravel plugin
                    // to instead re-write asset URLs to point to the Vite
                    // server instead.
                    base: null,

                    // The Vue plugin will parse absolute URLs and treat them
                    // as absolute paths to files on disk. Setting this to
                    // `false` will leave absolute URLs un-touched so they can
                    // reference assets in the public directory as expected.
                    includeAbsolute: false,
                },
            },
        }),
        quasar({
            sassVariables: 'resources/css/quasar.variables.scss',
        }),
        laravel({
            input: [
                'resources/js/app.js',
            ],
            buildDirectory: '.',
            refresh: true,
            //valetTls: 'domain.test',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/frontend/src', import.meta.url)),
            '@app': fileURLToPath(new URL('./resources/frontend/app', import.meta.url)),
            'ziggy': path.resolve('vendor/tightenco/ziggy/dist/index.es'),
            //'ziggyVue': path.resolve('vendor/tightenco/ziggy/dist/vue.es'),
        }
    },
    watch: {
        ignored: ["**/vendor/**"],
    },
    server: {
        //https: true,
        //host: 'domain2.test',
    },
})
