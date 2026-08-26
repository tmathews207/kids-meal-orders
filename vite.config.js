import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/kids-meal-orders/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Meal Orders',
        short_name: 'Meals',
        description: 'Order meals from menus Mom and Dad create',
        theme_color: '#E85D2C',
        background_color: '#FFF8F2',
        display: 'standalone',
        scope: '/kids-meal-orders/',
        start_url: '/kids-meal-orders/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
        navigateFallbackDenylist: [/^\/history/],
      },
    }),
  ],
})
