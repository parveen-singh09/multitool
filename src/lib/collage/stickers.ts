

export interface Sticker {
  id: string;
  label: string;
  svg: string;
}
export interface StickerGroup {
  id: string;
  label: string;
  items: Sticker[];
}

const s = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`;

export const STICKER_GROUPS: StickerGroup[] = [
  {
    id: 'emoji',
    label: 'Emoji',
    items: [
      {
        id: 'smile',
        label: 'Smile',
        svg: s(
          '<circle cx="50" cy="50" r="46" fill="#ffd93b"/><circle cx="36" cy="42" r="6" fill="#333"/><circle cx="64" cy="42" r="6" fill="#333"/><path d="M30 60 Q50 80 70 60" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round"/>'
        ),
      },
      {
        id: 'heart-eyes',
        label: 'Heart eyes',
        svg: s(
          '<circle cx="50" cy="50" r="46" fill="#ffd93b"/><path d="M30 38 l6 6 6-6a4 4 0 0 0-6-5 4 4 0 0 0-6 5z" fill="#e5484d"/><path d="M58 38 l6 6 6-6a4 4 0 0 0-6-5 4 4 0 0 0-6 5z" fill="#e5484d"/><path d="M32 60 Q50 82 68 60" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round"/>'
        ),
      },
      {
        id: 'cool',
        label: 'Cool',
        svg: s(
          '<circle cx="50" cy="50" r="46" fill="#ffd93b"/><rect x="22" y="38" width="24" height="14" rx="4" fill="#222"/><rect x="54" y="38" width="24" height="14" rx="4" fill="#222"/><rect x="46" y="43" width="8" height="4" fill="#222"/><path d="M34 66 h32" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round"/>'
        ),
      },
      {
        id: 'wink',
        label: 'Wink',
        svg: s(
          '<circle cx="50" cy="50" r="46" fill="#ffd93b"/><circle cx="36" cy="42" r="6" fill="#333"/><path d="M58 42 q6-6 12 0" stroke="#333" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M32 60 Q50 78 68 60" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round"/>'
        ),
      },
    ],
  },
  {
    id: 'shapes',
    label: 'Badges',
    items: [
      {
        id: 'star',
        label: 'Star',
        svg: s(
          '<path d="M50 6 61 38 95 38 68 58 78 92 50 72 22 92 32 58 5 38 39 38z" fill="#ffcf33"/>'
        ),
      },
      {
        id: 'heart',
        label: 'Heart',
        svg: s(
          '<path d="M50 86 C10 56 14 20 40 20 c8 0 10 6 10 6 s2-6 10-6 c26 0 30 36-10 66z" fill="#e5484d"/>'
        ),
      },
      {
        id: 'seal',
        label: 'Seal',
        svg: s(
          '<circle cx="50" cy="50" r="40" fill="#5e6ad2"/><circle cx="50" cy="50" r="30" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/><text x="50" y="58" font-size="24" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="700">NEW</text>'
        ),
      },
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    items: [
      {
        id: 'arrow-r',
        label: 'Arrow',
        svg: s('<path d="M10 42 h50 v-16 l30 24-30 24 v-16 h-50z" fill="#f7f8f8"/>'),
      },
      {
        id: 'arrow-curve',
        label: 'Curved arrow',
        svg: s(
          '<path d="M20 80 Q20 30 70 30" stroke="#f7f8f8" stroke-width="8" fill="none"/><path d="M58 16 l18 14-18 14z" fill="#f7f8f8"/>'
        ),
      },
    ],
  },
  {
    id: 'deco',
    label: 'Decorative',
    items: [
      {
        id: 'sparkle',
        label: 'Sparkle',
        svg: s(
          '<path d="M50 8 C54 40 60 46 92 50 60 54 54 60 50 92 46 60 40 54 8 50 40 46 46 40 50 8z" fill="#ffe066"/>'
        ),
      },
      {
        id: 'bolt',
        label: 'Bolt',
        svg: s('<path d="M56 6 24 56 h20 l-8 38 34-56 h-22z" fill="#ffcf33"/>'),
      },
      {
        id: 'crown',
        label: 'Crown',
        svg: s(
          '<path d="M14 74 L20 34 40 54 50 26 60 54 80 34 86 74z" fill="#ffcf33"/><rect x="14" y="74" width="72" height="10" fill="#e0a800"/>'
        ),
      },
    ],
  },
];
