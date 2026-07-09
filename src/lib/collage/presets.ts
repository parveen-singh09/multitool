// Canvas size presets for the collage editor. Width/height in px.
export interface SizePreset {
  id: string;
  label: string;
  w: number;
  h: number;
}

export const SIZE_PRESETS: SizePreset[] = [
  { id: 'square', label: 'Square 1:1', w: 1080, h: 1080 },
  { id: 'ig-portrait', label: 'Instagram Portrait 4:5', w: 1080, h: 1350 },
  { id: 'story', label: 'Story 9:16', w: 1080, h: 1920 },
  { id: 'landscape', label: 'Landscape 16:9', w: 1920, h: 1080 },
  { id: 'fb-cover', label: 'Facebook Cover', w: 1640, h: 924 },
  { id: 'yt-thumb', label: 'YouTube Thumbnail', w: 1280, h: 720 },
  { id: 'a4-portrait', label: 'A4 Portrait', w: 1240, h: 1754 },
  { id: 'a4-landscape', label: 'A4 Landscape', w: 1754, h: 1240 },
  { id: 'pinterest', label: 'Pinterest 2:3', w: 1000, h: 1500 },
];
