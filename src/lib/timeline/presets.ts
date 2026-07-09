// Themes (concrete hex — a standalone exported .svg can't read CSS vars) and
// canvas size presets. The default "Linear dark" theme uses the DESIGN.md tokens
// so an exported timeline matches the site's look.

import type { TimelineTheme } from './types';

export const TIMELINE_THEMES: TimelineTheme[] = [
  { id: 'linear-dark', label: 'Linear dark', bg: '#0f1011', spine: '#34343a', ink: '#f7f8f8', inkSubtle: '#8a8f98', accent: '#5e6ad2' },
  { id: 'paper', label: 'Light paper', bg: '#ffffff', spine: '#d4d4d8', ink: '#18181b', inkSubtle: '#71717a', accent: '#5e6ad2' },
  { id: 'corporate', label: 'Corporate blue', bg: '#0b1220', spine: '#1e3a5f', ink: '#e2e8f0', inkSubtle: '#7d90a8', accent: '#38bdf8' },
  { id: 'sepia', label: 'Historical sepia', bg: '#f5ecd9', spine: '#c8b088', ink: '#4a3726', inkSubtle: '#8a7355', accent: '#a1662f' },
  { id: 'roadmap', label: 'Roadmap green', bg: '#0c130f', spine: '#1f3a2c', ink: '#eafaf0', inkSubtle: '#7ba890', accent: '#34d399' },
  { id: 'wedding', label: 'Wedding rose', bg: '#fdf2f6', spine: '#e8c4d4', ink: '#4a2434', inkSubtle: '#9c7183', accent: '#e05a8a' },
];

export function getTheme(id: string): TimelineTheme | undefined {
  return TIMELINE_THEMES.find((t) => t.id === id);
}

export interface SizePreset {
  id: string;
  label: string;
  w: number;   // design width in px; height grows to fit content
  h: number;   // baseline / minimum height
}

export const SIZE_PRESETS: SizePreset[] = [
  { id: 'landscape', label: 'Landscape (1280×720)', w: 1280, h: 720 },
  { id: 'portrait', label: 'Portrait (720×1280)', w: 720, h: 1280 },
  { id: 'story', label: 'Story (1080×1920)', w: 1080, h: 1920 },
  { id: 'wide', label: 'Wide banner (1600×600)', w: 1600, h: 600 },
  { id: 'square', label: 'Square (1080×1080)', w: 1080, h: 1080 },
];

export function getSize(id: string): SizePreset {
  return SIZE_PRESETS.find((s) => s.id === id) ?? SIZE_PRESETS[0];
}
