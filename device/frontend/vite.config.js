import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import {quasar, transformAssetUrls} from "@quasar/vite-plugin";



// https://vitejs.dev/config/
export default defineConfig({
  //base: '',
  root: 'src',
  build: {
    outDir: '../../data/'
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: '@/css/quasar.variables.scss',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app': fileURLToPath(new URL('./app', import.meta.url)),
      //'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  }
})
