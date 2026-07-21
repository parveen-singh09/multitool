// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://toolsilk.com',
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      // `n:` is a mapped/network drive — native FS events don't fire reliably
      // on Windows network drives, so HMR silently misses edits. Poll instead.
      watch: { usePolling: true, interval: 300 },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['figlet', 'onnxruntime-web'],
      include: ['qrcode', 'wordcloud'],
    },
  },
});