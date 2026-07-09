// Curated font list for the Text panel. Each entry maps a display label to a
// CSS font-family and a lazy @fontsource loader. Fonts load locally (no Google
// Fonts network call). System fonts have no loader.
export interface FontDef {
  label: string;
  family: string;
  load?: () => Promise<unknown>;
}

export const FONTS: FontDef[] = [
  { label: 'Inter', family: 'Inter', load: () => import('@fontsource/inter') },
  { label: 'Sans (system)', family: 'system-ui, sans-serif' },
  { label: 'Serif (system)', family: 'Georgia, serif' },
  { label: 'Mono', family: 'JetBrains Mono Variable, monospace', load: () => import('@fontsource-variable/jetbrains-mono') },
  { label: 'Montserrat', family: 'Montserrat', load: () => import('@fontsource/montserrat') },
  { label: 'Oswald', family: 'Oswald', load: () => import('@fontsource/oswald') },
  { label: 'Bebas Neue', family: 'Bebas Neue', load: () => import('@fontsource/bebas-neue') },
  { label: 'Playfair Display', family: 'Playfair Display', load: () => import('@fontsource/playfair-display') },
  { label: 'Pacifico', family: 'Pacifico', load: () => import('@fontsource/pacifico') },
  { label: 'Lobster', family: 'Lobster', load: () => import('@fontsource/lobster') },
  { label: 'Dancing Script', family: 'Dancing Script', load: () => import('@fontsource/dancing-script') },
  { label: 'Caveat', family: 'Caveat', load: () => import('@fontsource/caveat') },
  { label: 'Roboto', family: 'Roboto', load: () => import('@fontsource/roboto') },
  { label: 'Lato', family: 'Lato', load: () => import('@fontsource/lato') },
  { label: 'Poppins', family: 'Poppins', load: () => import('@fontsource/poppins') },
  { label: 'Anton', family: 'Anton', load: () => import('@fontsource/anton') },
  { label: 'Righteous', family: 'Righteous', load: () => import('@fontsource/righteous') },
  { label: 'Abril Fatface', family: 'Abril Fatface', load: () => import('@fontsource/abril-fatface') },
  { label: 'Great Vibes', family: 'Great Vibes', load: () => import('@fontsource/great-vibes') },
  { label: 'Satisfy', family: 'Satisfy', load: () => import('@fontsource/satisfy') },
];

const loaded = new Set<string>();

// Loads the @fontsource package for `family` (once) and waits for the browser
// to have the face ready, so Fabric re-renders with the real glyphs.
export async function ensureFont(family: string): Promise<void> {
  const def = FONTS.find((f) => f.family === family);
  if (!def?.load) return; // system font — already available
  if (!loaded.has(family)) {
    await def.load();
    loaded.add(family);
  }
  // First family token, stripped of fallbacks/quotes, for document.fonts.load.
  const name = family.split(',')[0].replace(/['"]/g, '').trim();
  try {
    await document.fonts.load(`24px "${name}"`);
    await document.fonts.ready;
  } catch {
    /* font load best-effort; fall back to whatever renders */
  }
}
