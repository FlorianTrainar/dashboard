import { fileURLToPath, URL } from 'node:url'

import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'i',
        }),
      ],
    }),
    AutoImport({
      resolvers: [
        IconsResolver({
          prefix: 'i', // important → i-lucide-xxx
        }),
      ],
    }),

    Icons({
      autoInstall: true,
    }),

    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',

      manifest: {
        name: 'FloBoard',
        short_name: 'FloBoard',
        start_url: '/',
        display: 'standalone',
        background_color: '#283038',
        theme_color: '#283038',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
