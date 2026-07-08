// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://toolcities.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // figlet ships font data as ESM modules under figlet/fonts/*. Vite's dep
    // optimizer mis-handles these dynamic imports in dev (names with spaces
    // 404 out of .vite/deps), so serve figlet unbundled.
    // onnxruntime-web (sticker bg-removal, genre model) ships wasm + internal
    // dynamic imports the optimizer mangles → "Failed to fetch dynamically
    // imported module" in dev. Serve it unbundled too.
    optimizeDeps: {
      exclude: ['figlet', 'onnxruntime-web'],
    },
  },
});
