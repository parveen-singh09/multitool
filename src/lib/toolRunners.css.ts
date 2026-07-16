// Inline runners for the CSS-generator tools. Each ports the REAL output
// format of its tool page (src/pages/tools/<slug>.astro) and returns the
// generated CSS as `text`, using ctx.extract to pull any values the user
// named and falling back to each tool's own defaults.
//
// All are `needs: 'text'` — they work straight from the chat message.
// Nothing omitted: every one of these tools can produce output from text alone.

import type { Runner } from './toolRunners';

// #rrggbb → "r, g, b" (the exact form the tool scripts use).
const rgbParts = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const hexToRgba = (hex: string, a: number) => `rgba(${rgbParts(hex)}, ${a})`;

// First hex color in a string, or a fallback. ponytail: 3/6/8-digit all fine.
const firstHex = (s: string, fallback: string) =>
  (s.match(/#[0-9a-fA-F]{3,8}/) ?? [fallback])[0];

export const RUNNERS_CSS: Record<string, Runner> = {
  // --- Gradient: linear/radial/conic from named colors + angle. --------------
  // Ports gradientCss(): stops spaced 0→100%, `#color pos%` joined by `, `.
  'gradient-generator': {
    needs: 'text',
    async run({ query, extract }) {
      const list = await extract('List ONLY the hex colors the user wants in the gradient, comma-separated (e.g. "#ff0000,#0000ff"). If none named, return nothing.');
      const found = list.match(/#[0-9a-fA-F]{3,8}/g) ?? [];
      const stops = found.length >= 2 ? found : ['#5e6ad2', '#828fff']; // tool default
      const type = /radial/i.test(query) ? 'radial' : /conic/i.test(query) ? 'conic' : 'linear';
      const angleStr = (await extract('Return ONLY the gradient angle in degrees (a number 0-360) the user named, else 90.')).trim();
      const angle = /^\d{1,3}$/.test(angleStr) ? angleStr : '90';
      const cs = stops.map((c, i) => `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`).join(', ');
      const css =
        type === 'linear' ? `linear-gradient(${angle}deg, ${cs})`
        : type === 'radial' ? `radial-gradient(circle at 50% 50%, ${cs})`
        : `conic-gradient(from ${angle}deg at 50% 50%, ${cs})`;
      return { text: `background: ${css};`, note: `${type} gradient · ${stops.length} stops` };
    },
  },

  // --- Box-shadow: x/y/blur/spread + color + opacity, optional inset. --------
  // Ports the `${inset }x px y px blur px spread px rgba(...)` value builder.
  'box-shadow-generator': {
    needs: 'text',
    async run({ query, extract }) {
      const color = firstHex(await extract('Return ONLY the shadow hex color the user named, else #5e6ad2.'), '#5e6ad2');
      const inset = /\binset\b/i.test(query);
      const nums = (await extract('Return ONLY four integers "x y blur spread" for the box-shadow the user described (px offsets, blur, spread), else "0 10 30 0".')).match(/-?\d+/g) ?? [];
      const [x, y, blur, spread] = nums.length >= 4 ? nums : ['0', '10', '30', '0']; // tool defaults
      const value = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, 0.3)}`;
      return { text: `box-shadow: ${value};`, note: `box-shadow${inset ? ' (inset)' : ''}` };
    },
  },

  // --- Border-radius: 4-value corners in px. ---------------------------------
  // Ports `border-radius: tl px tr px br px bl px;` (one value → all corners).
  'border-radius-generator': {
    needs: 'text',
    async run({ extract }) {
      const nums = (await extract('Return ONLY the border-radius value(s) in px the user named — one number for all corners, or four for TL TR BR BL — else 24.')).match(/\d+/g) ?? [];
      let [tl, tr, br, bl] = nums.length >= 4 ? nums : Array(4).fill(nums[0] ?? '24');
      return { text: `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`, note: 'border-radius' };
    },
  },

  // --- Glassmorphism: full frosted-glass rule set (.glass-card + ::before/::after).
  // Ports buildCss('.glass-card') verbatim; tint + blur pulled, rest defaults.
  'glassmorphism-generator': {
    needs: 'text',
    async run({ extract }) {
      const color = firstHex(await extract('Return ONLY the glass tint hex color the user named, else #ffffff.'), '#ffffff');
      const blurStr = (await extract('Return ONLY the blur amount in px the user named (0-40), else 12.')).match(/\d+/)?.[0];
      const blur = blurStr ? Math.min(40, +blurStr) : 12;
      // tool defaults: alpha .15, sat 180%, refraction .40, depth 10, radius 16, border .30
      const alpha = 0.15, sat = 180, refr = 0.4, depth = 10, radius = 16, bw = 0.3;
      const rgb = rgbParts(color);
      const outer = `0 ${depth}px ${(depth * 2.5).toFixed(0)}px rgba(0, 0, 0, ${(0.08 + depth * 0.008).toFixed(2)})`;
      const insetTop = `inset 0 1px 1px rgba(255, 255, 255, ${(0.5 * refr).toFixed(2)})`;
      const insetBottom = `inset 0 -1px 1px rgba(255, 255, 255, ${(0.15 * refr).toFixed(2)})`;
      const edge = (0.6 * refr).toFixed(2);
      const sel = '.glass-card';
      const text =
`${sel} {
  background: rgba(${rgb}, ${alpha});
  border-radius: ${radius}px;
  backdrop-filter: blur(${blur}px) saturate(${sat}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${sat}%);
  border: 1px solid rgba(255, 255, 255, ${bw.toFixed(2)});
  box-shadow: ${outer}, ${insetTop}, ${insetBottom};
  position: relative;
  overflow: hidden;
}
${sel}::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, ${edge}), transparent);
}
${sel}::after {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, ${edge}), transparent);
}`;
      return { text, note: `glassmorphism · blur ${blur}px` };
    },
  },

  // --- CSS animation: @keyframes + animation shorthand from a named effect. --
  // CATS is the tool's own effect library (copied — it's the real keyframe data).
  'css-animation-generator': {
    needs: 'text',
    async run({ extract }) {
      // ponytail: mirrors the tool's CATS map; add a category here when the page does.
      const CATS: Record<string, { id: string; label: string; body: string; bg?: boolean }[]> = {
        Basic: [
          { id: 'fade', label: 'Fade', body: '0%{opacity:0}100%{opacity:1}' },
          { id: 'slide-up', label: 'Slide up', body: '0%{transform:translateY(30px);opacity:0}100%{transform:translateY(0);opacity:1}' },
          { id: 'slide-down', label: 'Slide down', body: '0%{transform:translateY(-30px);opacity:0}100%{transform:translateY(0);opacity:1}' },
          { id: 'slide-left', label: 'Slide left', body: '0%{transform:translateX(30px);opacity:0}100%{transform:translateX(0);opacity:1}' },
          { id: 'slide-right', label: 'Slide right', body: '0%{transform:translateX(-30px);opacity:0}100%{transform:translateX(0);opacity:1}' },
          { id: 'spin', label: 'Spin', body: '0%{transform:rotate(0)}100%{transform:rotate(360deg)}' },
          { id: 'scale-up', label: 'Scale up', body: '0%{transform:scale(0)}100%{transform:scale(1)}' },
          { id: 'scale-down', label: 'Scale down', body: '0%{transform:scale(1.4)}100%{transform:scale(1)}' },
        ],
        Entrance: [
          { id: 'fade-in', label: 'Fade in', body: '0%{opacity:0}100%{opacity:1}' },
          { id: 'fade-in-up', label: 'Fade in up', body: '0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:translateY(0)}' },
          { id: 'fade-in-down', label: 'Fade in down', body: '0%{opacity:0;transform:translateY(-40px)}100%{opacity:1;transform:translateY(0)}' },
          { id: 'zoom-in', label: 'Zoom in', body: '0%{opacity:0;transform:scale(.3)}100%{opacity:1;transform:scale(1)}' },
          { id: 'bounce-in', label: 'Bounce in', body: '0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1)}' },
          { id: 'flip-in-x', label: 'Flip in X', body: '0%{opacity:0;transform:perspective(400px) rotateX(90deg)}100%{opacity:1;transform:perspective(400px) rotateX(0)}' },
          { id: 'rotate-in', label: 'Rotate in', body: '0%{opacity:0;transform:rotate(-200deg)}100%{opacity:1;transform:rotate(0)}' },
        ],
        Exit: [
          { id: 'fade-out', label: 'Fade out', body: '0%{opacity:1}100%{opacity:0}' },
          { id: 'fade-out-up', label: 'Fade out up', body: '0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-40px)}' },
          { id: 'zoom-out', label: 'Zoom out', body: '0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.3)}' },
          { id: 'bounce-out', label: 'Bounce out', body: '0%{transform:scale(1)}20%{transform:scale(.9)}50%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:scale(.3)}' },
          { id: 'flip-out-x', label: 'Flip out X', body: '0%{opacity:1;transform:perspective(400px) rotateX(0)}100%{opacity:0;transform:perspective(400px) rotateX(90deg)}' },
        ],
        Attention: [
          { id: 'bounce', label: 'Bounce', body: '0%,20%,53%,100%{transform:translateY(0)}40%,43%{transform:translateY(-30px)}70%{transform:translateY(-15px)}90%{transform:translateY(-4px)}' },
          { id: 'shake', label: 'Shake', body: '0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}' },
          { id: 'wobble', label: 'Wobble', body: '0%,100%{transform:none}15%{transform:translateX(-25%) rotate(-5deg)}30%{transform:translateX(20%) rotate(3deg)}45%{transform:translateX(-15%) rotate(-3deg)}60%{transform:translateX(10%) rotate(2deg)}75%{transform:translateX(-5%) rotate(-1deg)}' },
          { id: 'swing', label: 'Swing', body: '20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}100%{transform:rotate(0)}' },
          { id: 'tada', label: 'Tada', body: '0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-3deg)}30%,50%,70%,90%{transform:scale(1.1) rotate(3deg)}40%,60%,80%{transform:scale(1.1) rotate(-3deg)}100%{transform:scale(1) rotate(0)}' },
          { id: 'flash', label: 'Flash', body: '0%,50%,100%{opacity:1}25%,75%{opacity:0}' },
          { id: 'pulse', label: 'Pulse', body: '0%,100%{transform:scale(1)}50%{transform:scale(1.15)}' },
          { id: 'heartbeat', label: 'Heartbeat', body: '0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}' },
          { id: 'jello', label: 'Jello', body: '0%,11.1%,100%{transform:none}22.2%{transform:skewX(-12deg) skewY(-12deg)}33.3%{transform:skewX(6deg) skewY(6deg)}44.4%{transform:skewX(-3deg) skewY(-3deg)}55.5%{transform:skewX(1.5deg) skewY(1.5deg)}' },
          { id: 'rubber-band', label: 'Rubber band', body: '0%{transform:scale(1)}30%{transform:scaleX(1.25) scaleY(.75)}40%{transform:scaleX(.75) scaleY(1.25)}60%{transform:scaleX(1.15) scaleY(.85)}100%{transform:scale(1)}' },
        ],
        Background: [
          { id: 'bg-pan', label: 'Background pan', bg: true, body: '0%{background-position:0% 50%}100%{background-position:100% 50%}' },
          { id: 'gradient-shift', label: 'Gradient shift', bg: true, body: '0%,100%{background-position:0% 50%}50%{background-position:100% 50%}' },
          { id: 'hue-rotate', label: 'Hue rotate', bg: true, body: '0%{filter:hue-rotate(0)}100%{filter:hue-rotate(360deg)}' },
        ],
      };
      const all = Object.values(CATS).flat();
      const wanted = (await extract('Return ONLY the animation effect the user wants (e.g. "bounce", "fade in", "pulse", "spin"), else "fade".')).toLowerCase().trim();
      const norm = wanted.replace(/\s+/g, '-');
      const eff =
        all.find((e) => e.id === norm || e.label.toLowerCase() === wanted) ??
        all.find((e) => e.id.includes(norm) || e.label.toLowerCase().includes(wanted)) ??
        CATS.Basic[0]; // default: fade
      const durStr = (await extract('Return ONLY the animation duration in seconds the user named (a number), else 1.')).match(/[\d.]+/)?.[0];
      const dur = durStr || '1';
      // tool defaults for the rest: ease · 0s delay · infinite · normal · none · running
      const name = eff.id;
      const keyframes = `@keyframes ${name} {\n  ${eff.body.replace(/}/g, '}\n  ').trim()}\n}`;
      const shorthand = `animation: ${name} ${dur}s ease 0s infinite normal none;`;
      const text = `${keyframes}\n\n.element {\n  ${shorthand}\n  animation-play-state: running;\n}`;
      return { text, note: `${eff.label} animation · ${dur}s` };
    },
  },

  // --- Media query: @media rule from min/max width. --------------------------
  // ponytail: width-only — the full tool also does height/orientation/scheme/
  // aspect-ratio/resolution; add those conditions here if asked.
  'media-query-generator': {
    needs: 'text',
    async run({ extract }) {
      const min = (await extract('Return ONLY the min-width in px the user named (a number), else 768.')).match(/\d+/)?.[0] ?? '768';
      const max = (await extract('Return ONLY the max-width in px the user named (a number), else nothing.')).match(/\d+/)?.[0];
      const conds: string[] = [];
      if (min) conds.push(`(min-width: ${min}px)`);
      if (max) conds.push(`(max-width: ${max}px)`);
      // Bare `screen` is dropped once real conditions carry the query (tool rule).
      const query = conds.length ? conds.join(' and ') : 'screen';
      return { text: `@media ${query} {\n  \n}`, note: 'media query' };
    },
  },

  // --- Flexbox: container rule. ----------------------------------------------
  // ponytail: container only — per-item order/grow/shrink/basis need clicking
  // items in the visual tool; use the page for those.
  'flexbox-generator': {
    needs: 'text',
    async run({ extract }) {
      const one = async (instr: string, def: string) => (await extract(instr)).trim() || def;
      const dir = await one('Return ONLY the flex-direction the user wants (row, row-reverse, column, column-reverse), else row.', 'row');
      const wrap = await one('Return ONLY the flex-wrap the user wants (nowrap, wrap, wrap-reverse), else nowrap.', 'nowrap');
      const justify = await one('Return ONLY the justify-content value the user wants (flex-start, center, flex-end, space-between, space-around, space-evenly), else flex-start.', 'flex-start');
      const align = await one('Return ONLY the align-items value the user wants (stretch, flex-start, center, flex-end, baseline), else stretch.', 'stretch');
      const gap = (await extract('Return ONLY the gap in px the user named (a number), else 12.')).match(/\d+/)?.[0] ?? '12';
      const text =
`.container {
  display: flex;
  flex-direction: ${dir};
  flex-wrap: ${wrap};
  justify-content: ${justify};
  align-items: ${align};
  align-content: stretch;
  gap: ${gap}px;
}`;
      return { text, note: 'flexbox container' };
    },
  },
};
