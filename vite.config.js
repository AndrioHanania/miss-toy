import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({ 
      registerType: 'autoUpdate',

      includeAssets: ['favicon.ico'],

      manifest: {
        name: 'Miss Toy',
        short_name: 'MissToy',
        description: 'Digital Toys Shop',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: "standalone",
        // scope: "/miss-toy/",
        start_url: "/miss-toy/#/",
        icons: [
          {
            src: "/miss-toy/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          ,
          {
            src: "/miss-toy/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          }
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/andriohanania\.github\.io\/miss-toy\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'miss-toy-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
        ],
      },
    }),
  ],
  
  base: '/miss-toy'
})
