

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

export async function ensureFont(family: string): Promise<void> {
  const def = FONTS.find((f) => f.family === family);
  if (!def?.load) return; 
  if (!loaded.has(family)) {
    await def.load();
    loaded.add(family);
  }

  const name = family.split(',')[0].replace(/['"]/g, '').trim();
  try {
    await document.fonts.load(`24px "${name}"`);
    await document.fonts.ready;
  } catch {

  }
}
