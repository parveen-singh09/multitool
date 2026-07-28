// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Map each static page's URL pathname to the ISO date of its last git commit,
 * in ONE `git log` pass. Google honours <lastmod> only when it's accurate — a
 * blanket build-time stamp makes it distrust the field site-wide, so we derive
 * a real per-page date and simply omit it when git is unavailable or the URL is
 * a dynamic route (nothing is worse than a fake date). Build-time only.
 */
function pageLastmods() {
  const map = new Map();
  let out;
  try {
    out = execSync('git log --name-only --pretty=format:%x00%cI', {
      cwd: __dirname,
      encoding: 'utf8',
      maxBuffer: 128 * 1024 * 1024,
    });
  } catch {
    return map; // no git (e.g. CI shallow/none) → omit lastmod entirely
  }
  let date = null;
  for (const line of out.split('\n')) {
    if (line[0] === '\x00') {
      date = line.slice(1).trim();
      continue;
    }
    const m = line.match(/^src\/pages\/(.+)\.astro$/);
    if (!m || !date) continue;
    if (m[1].includes('[')) continue; // dynamic route ([category].astro etc.)
    const pathname = m[1] === 'index' ? '/' : `/${m[1]}`;
    if (!map.has(pathname)) map.set(pathname, date); // log is newest-first → first wins
  }
  return map;
}

const LASTMODS = pageLastmods();

export default defineConfig({
  site: 'https://toolsilk.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      // Attach the real git commit date per page; leave lastmod off for any URL
      // we don't have a date for (dynamic routes, untracked files) rather than
      // inventing one. `serialize` runs per entry at build.
      serialize(item) {
        const { pathname } = new URL(item.url);
        const key = pathname === '' ? '/' : pathname.replace(/\/$/, '') || '/';
        const date = LASTMODS.get(key);
        if (date) item.lastmod = date;
        return item;
      },
    }),
    react(),
  ],
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