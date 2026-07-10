// Themes (concrete hex — a standalone exported .svg can't read CSS vars), canvas
// size presets, and zoom levels. The default "linear-dark" theme uses DESIGN.md
// tokens so an exported chart matches the site. Critical bars use a warm red so
// the critical path reads at a glance without introducing a second brand accent
// on the marketing chrome (the chart is content, not chrome).

import type { GanttTheme, ZoomLevel } from './types';

export const GANTT_THEMES: GanttTheme[] = [
  { id: 'linear-dark', label: 'Linear dark', bg: '#0f1011', grid: '#23252a', ink: '#f7f8f8', inkSubtle: '#8a8f98', bar: '#5e6ad2', barCritical: '#e5484d', progress: '#a5adf0', summary: '#4a4f6b', milestone: '#f7f8f8', today: '#e5a23d' },
  { id: 'paper', label: 'Light paper', bg: '#ffffff', grid: '#e4e4e7', ink: '#18181b', inkSubtle: '#71717a', bar: '#5e6ad2', barCritical: '#dc2626', progress: '#3a44a8', summary: '#a1a1aa', milestone: '#18181b', today: '#ea580c' },
  { id: 'corporate', label: 'Corporate blue', bg: '#0b1220', grid: '#1e3a5f', ink: '#e2e8f0', inkSubtle: '#7d90a8', bar: '#38bdf8', barCritical: '#fb7185', progress: '#0ea5e9', summary: '#334e6b', milestone: '#e2e8f0', today: '#fbbf24' },
  { id: 'forest', label: 'Forest green', bg: '#0c130f', grid: '#1f3a2c', ink: '#eafaf0', inkSubtle: '#7ba890', bar: '#34d399', barCritical: '#f87171', progress: '#10b981', summary: '#2b503d', milestone: '#eafaf0', today: '#fbbf24' },
  { id: 'sunset', label: 'Sunset', bg: '#1a1120', grid: '#3a2a44', ink: '#faf0f7', inkSubtle: '#b090a8', bar: '#c084fc', barCritical: '#f43f5e', progress: '#a855f7', summary: '#4a3556', milestone: '#faf0f7', today: '#fbbf24' },
];

export function getTheme(id: string): GanttTheme {
  return GANTT_THEMES.find((t) => t.id === id) ?? GANTT_THEMES[0];
}

export interface SizePreset {
  id: string;
  label: string;
  w: number; // design width in px; height grows to fit rows
  h: number; // baseline / minimum height
}

export const SIZE_PRESETS: SizePreset[] = [
  { id: 'landscape', label: 'Landscape (1280 wide)', w: 1280, h: 720 },
  { id: 'wide', label: 'Wide (1600 wide)', w: 1600, h: 720 },
  { id: 'a4-landscape', label: 'A4 landscape (1123 wide)', w: 1123, h: 794 },
  { id: 'square', label: 'Square (1080)', w: 1080, h: 1080 },
];

export function getSize(id: string): SizePreset {
  return SIZE_PRESETS.find((s) => s.id === id) ?? SIZE_PRESETS[0];
}

// Pixels per WORKING day at each zoom. render.ts uses this to space the axis.
export const ZOOM_PX_PER_DAY: Record<ZoomLevel, number> = {
  day: 26,
  week: 9,
  month: 3.2,
};

export const ZOOM_LEVELS: { id: ZoomLevel; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];
