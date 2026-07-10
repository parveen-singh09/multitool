// Themes (concrete hex — a standalone exported .svg can't read CSS vars),
// layout orientations, and canvas size presets. The default "linear-dark" theme
// uses DESIGN.md tokens so an exported chart matches the site: root box is the
// one lavender accent, child boxes sit on surface-2, connectors use the strong
// hairline. Other themes stay single-accent to honour the "no second chromatic
// accent" rule per chart.

import type { OrgTheme } from './types';

export const ORG_THEMES: OrgTheme[] = [
  { id: 'linear-dark', label: 'Linear dark', bg: '#0f1011', box: '#141516', boxRoot: '#5e6ad2', border: '#34343a', ink: '#f7f8f8', inkSubtle: '#8a8f98', inkRoot: '#ffffff' },
  { id: 'paper', label: 'Light paper', bg: '#ffffff', box: '#f7f8f8', boxRoot: '#5e6ad2', border: '#d0d2d8', ink: '#18181b', inkSubtle: '#71717a', inkRoot: '#ffffff' },
  { id: 'slate', label: 'Slate', bg: '#0b0f14', box: '#161c24', boxRoot: '#3b82f6', border: '#2b3543', ink: '#e6edf3', inkSubtle: '#8b98a8', inkRoot: '#ffffff' },
  { id: 'forest', label: 'Forest green', bg: '#0c130f', box: '#15211a', boxRoot: '#10b981', border: '#26402f', ink: '#eafaf0', inkSubtle: '#7ba890', inkRoot: '#04180f' },
  { id: 'sunset', label: 'Sunset', bg: '#1a1120', box: '#241830', boxRoot: '#c084fc', border: '#3a2a44', ink: '#faf0f7', inkSubtle: '#b090a8', inkRoot: '#1a0f22' },
  { id: 'mono', label: 'Mono', bg: '#ffffff', box: '#ffffff', boxRoot: '#111111', border: '#111111', ink: '#111111', inkSubtle: '#555555', inkRoot: '#ffffff' },
];

export function getTheme(id: string): OrgTheme {
  return ORG_THEMES.find((t) => t.id === id) ?? ORG_THEMES[0];
}

// Orientation of the tree. The layout engine computes a top-down tidy tree, then
// transforms coordinates to realise the other three.
export type Orientation = 'top-down' | 'bottom-up' | 'left-right' | 'right-left';

export interface LayoutPreset {
  id: string;
  label: string;
  orientation: Orientation;
}

export const LAYOUTS: LayoutPreset[] = [
  { id: 'top-down', label: 'Top-down', orientation: 'top-down' },
  { id: 'left-right', label: 'Left to right', orientation: 'left-right' },
  { id: 'right-left', label: 'Right to left', orientation: 'right-left' },
  { id: 'bottom-up', label: 'Bottom-up', orientation: 'bottom-up' },
];

export function getLayout(id: string): LayoutPreset {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

export interface SizePreset {
  id: string;
  label: string;
  // Box dimensions + spacing in px. The canvas grows to fit the whole tree, so
  // these tune the box/gap scale rather than a fixed frame.
  boxW: number;
  boxH: number;
  gapX: number; // gap between sibling subtrees
  gapY: number; // gap between levels
}

export const SIZE_PRESETS: SizePreset[] = [
  { id: 'comfortable', label: 'Comfortable', boxW: 180, boxH: 64, gapX: 28, gapY: 72 },
  { id: 'compact', label: 'Compact', boxW: 150, boxH: 52, gapX: 20, gapY: 56 },
  { id: 'spacious', label: 'Spacious', boxW: 220, boxH: 76, gapX: 40, gapY: 96 },
];

export function getSize(id: string): SizePreset {
  return SIZE_PRESETS.find((s) => s.id === id) ?? SIZE_PRESETS[0];
}
