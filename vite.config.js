import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';
import store from "@/store/index.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'Assistant',
        short_name: 'Assistant',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: '/img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/img/icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
        theme_color: '#38424e',
        background_color: '#38424e',
      },
      workbox: {
        // Настройки Workbox (опционально)
      },
      onUpdateFound: () => {
        console.log('Новый контент загружен.');
      },
      onUpdated: () => {
        console.log('Доступен новый контент. Пожалуйста, обновитесь.');
        caches.keys().then(function (names) {
          for (let name of names) caches.delete(name);
        });
        // Вызов действия в store (если store доступен)
        store.dispatch('setManualUpdate');
      },
      onOfflineReady: () => {
        console.log('Приложение готово к работе в оффлайн-режиме.');
      },
      onError: (error) => {
        console.error('Ошибка при регистрации сервис-воркера:', error);
      },
    }),
  ],
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
