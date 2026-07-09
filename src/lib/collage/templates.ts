// Full pre-designed collage scenes (background + decorative text + stickers +
// tilted photo frames), as opposed to the bare photo grids in layouts.ts.
// All positions/sizes are NORMALIZED (0..1 of the canvas) so a template scales
// to whatever canvas size is active. The editor builds Fabric objects from these
// descriptors and leaves the photo slots fillable from the upload tray.
//
// Templates are GENERATED from reusable arrangements (slot layouts, 3-6 photos)
// crossed with per-occasion themes — instead of hand-authoring every scene.

export interface TplSlot {
  x: number; y: number; w: number; h: number; // normalized frame box
  angle?: number;        // tilt in degrees
  frame?: string;        // matte/border color (the "polaroid" edge)
  border?: number;       // border thickness as a fraction of the slot's short side (default 0.05)
  radius?: number;       // corner radius, normalized to canvas width
}

export interface TplText {
  text: string;
  x: number; y: number;  // center, normalized
  size: number;          // font size as a fraction of canvas height
  family: string;        // must match a FONTS family
  color: string;
  angle?: number;
  weight?: 'normal' | 'bold';
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TplDeco {
  svg: string;
  x: number; y: number;  // center, normalized
  size: number;          // as a fraction of canvas width
  angle?: number;
}

export interface TplBorder {
  color: string;
  width: number;         // px at design scale, applied as fraction of canvas min-dimension
  inset: number;         // normalized inset from each edge
}

export interface Template {
  id: string;
  label: string;
  group: string;
  bg: { color: string } | { gradient: [string, string] };
  border?: TplBorder;
  slots: TplSlot[];
  texts: TplText[];
  deco: TplDeco[];
}

// ---------------------------------------------------------------------------
// Decorative SVGs (viewBox 0 0 100 100), loaded like stickers by the editor.
// ---------------------------------------------------------------------------
const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`;

const D = {
  mapleLeaf: svg('<path d="M50 6 54 30 74 18 62 40 90 42 66 54 78 82 54 66 50 96 46 66 22 82 34 54 10 42 38 40 26 18 46 30z" fill="#d97706"/>'),
  oakLeaf: svg('<path d="M50 8 C40 20 56 24 44 34 C34 44 58 46 46 56 C36 66 60 68 50 92 C40 68 64 66 54 56 C42 46 66 44 56 34 C44 24 60 20 50 8z" fill="#b45309"/>'),
  acorn: svg('<ellipse cx="50" cy="62" rx="24" ry="28" fill="#a16207"/><path d="M24 44 a26 14 0 0 1 52 0 z" fill="#78350f"/><rect x="47" y="16" width="6" height="14" rx="3" fill="#78350f"/>'),
  snowflake: svg('<g stroke="#e0f2fe" stroke-width="5" stroke-linecap="round"><path d="M50 8 V92 M8 50 H92 M20 20 L80 80 M80 20 L20 80"/><path d="M50 20 l-8 8 M50 20 l8 8 M50 80 l-8-8 M50 80 l8-8 M20 50 l8-8 M20 50 l8 8 M80 50 l-8-8 M80 50 l-8 8"/></g>'),
  holly: svg('<path d="M50 40 Q30 30 22 46 Q34 56 50 50 Q66 56 78 46 Q70 30 50 40z" fill="#166534"/><circle cx="46" cy="60" r="7" fill="#dc2626"/><circle cx="58" cy="62" r="7" fill="#dc2626"/><circle cx="52" cy="72" r="7" fill="#dc2626"/>'),
  confetti: svg('<g><rect x="10" y="14" width="10" height="10" rx="2" fill="#5e6ad2" transform="rotate(20 15 19)"/><circle cx="70" cy="20" r="6" fill="#f59e0b"/><rect x="78" y="60" width="10" height="10" rx="2" fill="#ec4899" transform="rotate(-15 83 65)"/><circle cx="26" cy="74" r="6" fill="#10b981"/><path d="M50 40 l6 12-6 4-6-4z" fill="#ef4444"/></g>'),
  heart: svg('<path d="M50 84 C12 56 16 22 40 22 c8 0 10 6 10 6 s2-6 10-6 c24 0 28 34-10 62z" fill="#e5484d"/>'),
  flower: svg('<g fill="#f472b6"><circle cx="50" cy="30" r="14"/><circle cx="30" cy="50" r="14"/><circle cx="70" cy="50" r="14"/><circle cx="40" cy="70" r="14"/><circle cx="60" cy="70" r="14"/></g><circle cx="50" cy="52" r="12" fill="#fbbf24"/>'),
  rose: svg('<circle cx="50" cy="50" r="30" fill="#ec4899"/><g fill="#db2777" opacity="0.7"><path d="M50 22 a28 28 0 0 1 0 56 a20 20 0 0 0 0-40 a12 12 0 0 1 0 24z"/></g><circle cx="50" cy="50" r="6" fill="#fbcfe8"/>'),
  egg: svg('<ellipse cx="50" cy="54" rx="30" ry="40" fill="#a78bfa"/><g stroke="#fff" stroke-width="4" fill="none"><path d="M22 50 q14 8 28 0 t28 0"/><path d="M24 68 q13 8 26 0 t26 0"/></g>'),
  eggPink: svg('<ellipse cx="50" cy="54" rx="30" ry="40" fill="#f9a8d4"/><g stroke="#fff" stroke-width="4" fill="none"><path d="M22 44 q14 8 28 0 t28 0"/><path d="M24 62 q13 8 26 0 t26 0"/></g>'),
  tie: svg('<path d="M42 14 h16 l-4 8 8 44-12 16-12-16 8-44z" fill="#334155"/><path d="M42 14 l8 8 8-8z" fill="#1e293b"/>'),
  mustache: svg('<path d="M50 46 C40 34 20 34 14 48 c8-4 16-2 20 6 4-8 12-10 16-6 4-4 12-2 16 6 4-8 12-10 20-6 C80 34 60 34 50 46z" fill="#3f3f46"/>'),
  pumpkin: svg('<ellipse cx="50" cy="58" rx="34" ry="30" fill="#f97316"/><ellipse cx="30" cy="58" rx="14" ry="30" fill="#fb923c"/><ellipse cx="70" cy="58" rx="14" ry="30" fill="#fb923c"/><rect x="46" y="20" width="8" height="14" fill="#4d7c0f"/>'),
  ghost: svg('<path d="M28 84 V48 a22 22 0 0 1 44 0 V84 l-8-8-8 8-8-8-8 8-8-8z" fill="#f8fafc"/><circle cx="42" cy="46" r="4" fill="#1e293b"/><circle cx="58" cy="46" r="4" fill="#1e293b"/>'),
  balloon: svg('<ellipse cx="50" cy="40" rx="24" ry="30" fill="#ef4444"/><path d="M46 68 l4 8 4-8z" fill="#ef4444"/><path d="M50 76 q6 10 0 18" stroke="#94a3b8" stroke-width="2" fill="none"/>'),
  cake: svg('<rect x="22" y="52" width="56" height="30" rx="4" fill="#f9a8d4"/><rect x="22" y="46" width="56" height="10" fill="#fce7f3"/><rect x="48" y="26" width="4" height="16" fill="#fbbf24"/><circle cx="50" cy="23" r="4" fill="#f59e0b"/>'),
  rings: svg('<circle cx="40" cy="54" r="20" fill="none" stroke="#eab308" stroke-width="6"/><circle cx="62" cy="54" r="20" fill="none" stroke="#facc15" stroke-width="6"/>'),
  firework: svg('<g stroke="#fbbf24" stroke-width="3" stroke-linecap="round"><path d="M50 50 V14 M50 50 V86 M50 50 H14 M50 50 H86 M50 50 L26 26 M50 50 L74 74 M50 50 L74 26 M50 50 L26 74"/></g><circle cx="50" cy="50" r="5" fill="#f59e0b"/>'),
  star: svg('<path d="M50 8 61 38 94 38 67 58 78 90 50 70 22 90 33 58 6 38 39 38z" fill="#fbbf24"/>'),
  sun: svg('<circle cx="50" cy="50" r="20" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="5" stroke-linecap="round"><path d="M50 8 V22 M50 78 V92 M8 50 H22 M78 50 H92 M20 20 L30 30 M70 70 L80 80 M80 20 L70 30 M20 80 L30 70"/></g>'),
  palm: svg('<rect x="46" y="48" width="8" height="40" fill="#78350f"/><g fill="#16a34a"><path d="M50 48 Q30 30 12 36 Q34 34 50 50z"/><path d="M50 48 Q70 30 88 36 Q66 34 50 50z"/><path d="M50 46 Q46 22 30 14 Q46 26 50 48z"/><path d="M50 46 Q54 22 70 14 Q54 26 50 48z"/></g>'),
  plane: svg('<path d="M14 54 l72-20-14 40-18-14-8 14-6-18z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>'),
  suitcase: svg('<rect x="24" y="40" width="52" height="40" rx="4" fill="#0ea5e9"/><rect x="40" y="30" width="20" height="12" rx="3" fill="none" stroke="#0ea5e9" stroke-width="4"/><path d="M50 40 V80" stroke="#e0f2fe" stroke-width="3"/>'),
  cap: svg('<path d="M50 30 L14 44 L50 58 L86 44z" fill="#1e293b"/><path d="M32 50 v14 q18 12 36 0 v-14" fill="#334155"/><rect x="83" y="44" width="4" height="20" fill="#eab308"/><circle cx="85" cy="66" r="4" fill="#eab308"/>'),
} as const;

// ---------------------------------------------------------------------------
// Arrangements: slot layouts for 3-6 photos. Frame color is applied per-theme.
// All slots sit within y 0.22..0.92 so the top band is free for the heading.
// ---------------------------------------------------------------------------
type Slot = { x: number; y: number; w: number; h: number; angle: number };

const ARRANGEMENTS: Slot[][] = [
  // grid4
  [
    { x: 0.08, y: 0.26, w: 0.40, h: 0.32, angle: -4 },
    { x: 0.52, y: 0.28, w: 0.40, h: 0.32, angle: 4 },
    { x: 0.10, y: 0.60, w: 0.40, h: 0.30, angle: 3 },
    { x: 0.50, y: 0.58, w: 0.40, h: 0.30, angle: -3 },
  ],
  // row3
  [
    { x: 0.06, y: 0.34, w: 0.28, h: 0.42, angle: -6 },
    { x: 0.36, y: 0.30, w: 0.28, h: 0.42, angle: 3 },
    { x: 0.66, y: 0.34, w: 0.28, h: 0.42, angle: 7 },
  ],
  // feature5 (big left + 4 small)
  [
    { x: 0.06, y: 0.30, w: 0.44, h: 0.52, angle: -3 },
    { x: 0.54, y: 0.28, w: 0.20, h: 0.24, angle: 4 },
    { x: 0.76, y: 0.28, w: 0.18, h: 0.24, angle: -4 },
    { x: 0.54, y: 0.56, w: 0.20, h: 0.26, angle: -3 },
    { x: 0.76, y: 0.56, w: 0.18, h: 0.26, angle: 5 },
  ],
  // grid6 (3x2)
  [
    { x: 0.06, y: 0.26, w: 0.28, h: 0.30, angle: -3 },
    { x: 0.36, y: 0.24, w: 0.28, h: 0.30, angle: 3 },
    { x: 0.66, y: 0.26, w: 0.28, h: 0.30, angle: -3 },
    { x: 0.06, y: 0.60, w: 0.28, h: 0.30, angle: 4 },
    { x: 0.36, y: 0.62, w: 0.28, h: 0.30, angle: -4 },
    { x: 0.66, y: 0.60, w: 0.28, h: 0.30, angle: 3 },
  ],
  // scatter5
  [
    { x: 0.08, y: 0.28, w: 0.30, h: 0.36, angle: -8 },
    { x: 0.40, y: 0.24, w: 0.26, h: 0.34, angle: 5 },
    { x: 0.66, y: 0.30, w: 0.28, h: 0.36, angle: -6 },
    { x: 0.18, y: 0.58, w: 0.30, h: 0.34, angle: 7 },
    { x: 0.52, y: 0.58, w: 0.32, h: 0.34, angle: -5 },
  ],
  // big3
  [
    { x: 0.06, y: 0.30, w: 0.40, h: 0.50, angle: -4 },
    { x: 0.50, y: 0.26, w: 0.42, h: 0.28, angle: 4 },
    { x: 0.50, y: 0.58, w: 0.42, h: 0.30, angle: -3 },
  ],
];

// Corner slots for decorations (auto-placed, cycling the theme's deco svgs).
const CORNERS = [
  { x: 0.11, y: 0.10, angle: -14 },
  { x: 0.89, y: 0.10, angle: 14 },
  { x: 0.10, y: 0.91, angle: -18 },
  { x: 0.90, y: 0.91, angle: 16 },
];

interface Theme {
  group: string;
  bg: { color: string } | { gradient: [string, string] };
  border?: string;
  font: string;
  headingColor: string;
  frame: string;         // matte color for photo slots
  italic?: boolean;
  deco: string[];        // decorative svgs, cycled across the 4 corners
  headings: string[];    // one per template (5-6)
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function makeCategory(t: Theme): Template[] {
  return t.headings.map((heading, i) => {
    const arr = ARRANGEMENTS[i % ARRANGEMENTS.length];
    return {
      id: `${slug(t.group)}-${i + 1}`,
      label: heading,
      group: t.group,
      bg: t.bg,
      border: t.border ? { color: t.border, width: 3, inset: 0.04 } : undefined,
      slots: arr.map((s) => ({ ...s, frame: t.frame })),
      texts: [
        {
          text: heading, x: 0.5, y: 0.13, size: 0.085,
          family: t.font, color: t.headingColor, align: 'center', italic: t.italic,
        },
      ],
      deco: CORNERS.map((c, j) => ({
        svg: t.deco[j % t.deco.length], x: c.x, y: c.y, size: 0.085, angle: c.angle,
      })),
    };
  });
}

const THEMES: Theme[] = [
  {
    group: 'Birthday',
    bg: { gradient: ['#1e1b4b', '#0f1011'] }, border: '#5e6ad2',
    font: 'Pacifico', headingColor: '#f7f8f8', frame: '#ffffff',
    deco: [D.balloon, D.cake, D.confetti, D.star],
    headings: ['Happy Birthday', 'Party Time', 'Make a Wish', 'Best Day Ever', "Let's Celebrate", 'Another Year'],
  },
  {
    group: 'Wedding',
    bg: { color: '#faf7f2' }, border: '#c9a24b',
    font: 'Playfair Display', headingColor: '#8a6d3b', frame: '#ffffff', italic: true,
    deco: [D.rings, D.rose, D.flower, D.heart],
    headings: ['Just Married', 'Forever & Always', 'Our Big Day', 'Mr & Mrs', 'Two Hearts', 'The Wedding'],
  },
  {
    group: "Valentine's Day",
    bg: { gradient: ['#7f1d3a', '#3b0a1e'] }, border: '#f472b6',
    font: 'Dancing Script', headingColor: '#fecdd3', frame: '#ffffff',
    deco: [D.heart, D.rose, D.heart, D.rose],
    headings: ['Be Mine', 'My Valentine', 'Love You', 'Sweethearts', 'XOXO', 'You & Me'],
  },
  {
    group: 'Easter',
    bg: { gradient: ['#e0f2fe', '#fce7f3'] }, border: '#a78bfa',
    font: 'Caveat', headingColor: '#7c3aed', frame: '#ffffff',
    deco: [D.egg, D.eggPink, D.flower, D.egg],
    headings: ['Happy Easter', 'Egg Hunt', 'Spring Joy', 'Hoppy Easter', 'Sweet Spring', 'Easter Fun'],
  },
  {
    group: "Mother's Day",
    bg: { gradient: ['#fdf2f8', '#fbcfe8'] }, border: '#ec4899',
    font: 'Dancing Script', headingColor: '#be185d', frame: '#ffffff',
    deco: [D.flower, D.rose, D.heart, D.flower],
    headings: ['Happy Mother’s Day', 'Best Mom Ever', 'Love You Mom', 'Thank You Mom', 'Mom & Me', 'For Mom'],
  },
  {
    group: "Father's Day",
    bg: { gradient: ['#0f172a', '#1e293b'] }, border: '#38bdf8',
    font: 'Oswald', headingColor: '#e2e8f0', frame: '#ffffff',
    deco: [D.tie, D.mustache, D.star, D.tie],
    headings: ['Happy Father’s Day', 'Best Dad Ever', 'Super Dad', 'Love You Dad', 'Dad & Me', 'For Dad'],
  },
  {
    group: 'Halloween',
    bg: { gradient: ['#3b0764', '#1a0b2e'] }, border: '#f97316',
    font: 'Bebas Neue', headingColor: '#fb923c', frame: '#f8fafc',
    deco: [D.pumpkin, D.ghost, D.pumpkin, D.ghost],
    headings: ['Happy Halloween', 'Trick or Treat', 'Spooky Season', 'Boo!', 'Frightful Fun', 'Pumpkin Time'],
  },
  {
    group: 'Thanksgiving',
    bg: { gradient: ['#f3e6cf', '#d9a86c'] }, border: '#a16207',
    font: 'Playfair Display', headingColor: '#7c4a12', frame: '#ffffff', italic: true,
    deco: [D.mapleLeaf, D.acorn, D.oakLeaf, D.mapleLeaf],
    headings: ['Give Thanks', 'Happy Thanksgiving', 'Grateful', 'Family & Feast', 'Blessed', 'Harvest Time'],
  },
  {
    group: 'Christmas',
    bg: { gradient: ['#7f1d1d', '#450a0a'] }, border: '#e7c65a',
    font: 'Playfair Display', headingColor: '#f3e6cf', frame: '#ffffff', italic: true,
    deco: [D.holly, D.snowflake, D.holly, D.snowflake],
    headings: ['Merry Christmas', 'Happy Holidays', 'Season’s Greetings', 'Joy to All', 'Warm Wishes', 'Ho Ho Ho'],
  },
  {
    group: 'New Year',
    bg: { gradient: ['#0f1011', '#312e81'] }, border: '#fbbf24',
    font: 'Bebas Neue', headingColor: '#fde68a', frame: '#ffffff',
    deco: [D.firework, D.star, D.firework, D.confetti],
    headings: ['Happy New Year', 'Cheers to 2026', 'New Beginnings', 'Countdown', 'Fresh Start', 'Midnight'],
  },
  {
    group: 'Autumn Season',
    bg: { color: '#fbf7ef' }, border: '#c2843b',
    font: 'Dancing Script', headingColor: '#8a5a1e', frame: '#ffffff',
    deco: [D.mapleLeaf, D.acorn, D.oakLeaf, D.mapleLeaf],
    headings: ['Hello Autumn', 'Falling Leaves', 'Sweater Weather', 'Cozy Days', 'Fall is Here', 'Golden Hour'],
  },
  {
    group: 'Summer',
    bg: { gradient: ['#0ea5e9', '#fde68a'] }, border: '#f59e0b',
    font: 'Pacifico', headingColor: '#ffffff', frame: '#ffffff',
    deco: [D.sun, D.palm, D.sun, D.palm],
    headings: ['Hello Summer', 'Beach Days', 'Sun & Fun', 'Summer Vibes', 'Endless Summer', 'Poolside'],
  },
  {
    group: 'Travel',
    bg: { gradient: ['#0c4a6e', '#0f1011'] }, border: '#38bdf8',
    font: 'Bebas Neue', headingColor: '#e0f2fe', frame: '#ffffff',
    deco: [D.plane, D.suitcase, D.plane, D.suitcase],
    headings: ['Adventure Awaits', 'Wanderlust', 'Our Trip', 'Explore More', 'On the Road', 'Vacation Mode'],
  },
  {
    group: 'Graduation',
    bg: { gradient: ['#1e293b', '#0f1011'] }, border: '#eab308',
    font: 'Playfair Display', headingColor: '#fde68a', frame: '#ffffff', italic: true,
    deco: [D.cap, D.star, D.cap, D.star],
    headings: ['Congrats Grad', 'Class of 2026', 'We Did It', 'The Graduate', 'Future Bright', 'Cap & Gown'],
  },
];

export const TEMPLATES: Template[] = THEMES.flatMap(makeCategory);

export function templateGroups(): { label: string; items: Template[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, Template[]>();
  for (const t of TEMPLATES) {
    if (!byGroup.has(t.group)) { byGroup.set(t.group, []); order.push(t.group); }
    byGroup.get(t.group)!.push(t);
  }
  return order.map((label) => ({ label, items: byGroup.get(label)! }));
}

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
