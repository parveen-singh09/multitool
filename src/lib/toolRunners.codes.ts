
import type { Runner, RunFile } from './toolRunners';
import { canvasBlob } from './toolRunners';

function hexColor(raw: string, fallback: string): string {
  const m = (raw || '').match(/#?([0-9a-f]{6}|[0-9a-f]{3})\b/i);
  if (!m) return fallback;
  const h = m[1];
  return (h.length === 3 ? h.split('').map((c) => c + c).join('') : h).toLowerCase();
}

const svgFile = (name: string, svg: string): RunFile =>
  ({ name, blob: new Blob([svg], { type: 'image/svg+xml' }), kind: 'image' });

export const RUNNERS_CODES: Record<string, Runner> = {
  'data-matrix-generator': {
    needs: 'text',
    async run({ extract }) {
      const content = await extract('Extract ONLY the exact text or data to encode in the Data Matrix code. Return just that string.');
      if (!content) throw new Error('Tell me what to encode.');
      const { toCanvas } = await import('./barcode');
      const canvas = document.createElement('canvas');
      await toCanvas(canvas, {
        bcid: 'datamatrix', text: content, scale: 8,
        barcolor: '010102', backgroundcolor: 'ffffff',
        paddingwidth: 2, paddingheight: 2,
      });
      return { files: [{ name: 'datamatrix.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `Data Matrix · “${content}”` };
    },
  },

  'pdf417-generator': {
    needs: 'text',
    async run({ extract }) {
      const content = await extract('Extract ONLY the exact text or data to encode in the PDF417 barcode. Return just that string.');
      if (!content) throw new Error('Tell me what to encode.');
      const { toCanvas } = await import('./barcode');
      const canvas = document.createElement('canvas');
      await toCanvas(canvas, {
        bcid: 'pdf417', text: content, scale: 5, rowmult: 3,
        barcolor: '000000', backgroundcolor: 'ffffff',
        paddingwidth: 4, paddingheight: 4,
      });
      return { files: [{ name: 'pdf417.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `PDF417 · “${content}”` };
    },
  },

  'aztec-generator': {
    needs: 'text',
    async run({ extract }) {
      const content = await extract('Extract ONLY the exact text or data to encode in the Aztec code. Return just that string.');
      if (!content) throw new Error('Tell me what to encode.');
      const { toCanvas } = await import('./barcode');
      const canvas = document.createElement('canvas');
      await toCanvas(canvas, {
        bcid: 'azteccode', text: content, scale: 8, format: 'full', eclevel: 23,
        barcolor: '010102', backgroundcolor: 'ffffff',
        paddingwidth: 2, paddingheight: 2,
      });
      return { files: [{ name: 'aztec.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `Aztec code · “${content}”` };
    },
  },

  'svg-wave-generator': {
    needs: 'text',
    async run({ extract }) {
      const { randFloat } = await import('./random');
      const color = '#' + hexColor(await extract('If the user named a color for the wave, return it as a hex code like #5e6ad2, otherwise return nothing.'), '5e6ad2');
      const W = 1440, h = 150, waves = 4, flip = false;
      const seed = Array.from({ length: waves * 2 + 2 }, () => randFloat());
      const segW = W / waves;
      let d = `M0 ${h * 0.5}`;
      for (let i = 0; i < waves; i++) {
        const x1 = segW * i + segW / 3;
        const x2 = segW * i + (segW * 2) / 3;
        const x = segW * (i + 1);
        const up = (seed[i] ?? 0.5) * h * 0.5;
        const down = (seed[i + waves] ?? 0.5) * h * 0.5;
        d += ` C ${x1} ${up}, ${x2} ${h - down}, ${x} ${h * 0.5}`;
      }
      d += ` L ${W} ${flip ? 0 : h} L 0 ${flip ? 0 : h} Z`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="100%" height="${h}" preserveAspectRatio="none"><path fill="${color}" d="${d}"/></svg>`;
      return { files: [svgFile('wave.svg', svg)], note: `SVG wave divider · ${color}` };
    },
  },

  'blob-generator': {
    needs: 'text',
    async run({ extract }) {
      const { randFloat } = await import('./random');
      const color = '#' + hexColor(await extract('If the user named a color for the blob, return it as a hex code like #5e6ad2, otherwise return nothing.'), '5e6ad2');
      const SIZE = 400, C = 200, n = 6, contrast = 0.4, base = 150;
      const radii = Array.from({ length: n }, () => randFloat());
      const pts: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        const r = base * (1 - contrast + radii[i] * contrast * 2);
        pts.push([C + Math.cos(angle) * r, C + Math.sin(angle) * r]);
      }
      let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
        const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      d += ' Z';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path fill="${color}" d="${d}"/></svg>`;
      return { files: [svgFile('blob.svg', svg)], note: `SVG blob shape · ${color}` };
    },
  },

  'pattern-generator': {
    needs: 'text',
    async run({ extract }) {
      const { PATTERNS, PALETTES, generateSVG } = await import('./patterns');
      const q = (await extract('If the user named a pattern (e.g. "waves", "chevron", "dots", "herringbone"), return just that name, otherwise return nothing.')).trim().toLowerCase();
      const pattern = (q && PATTERNS.find((p) =>
        p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)))) || PATTERNS[0];
      const W = 1200;
      const svg = generateSVG(pattern, { colors: PALETTES[0], colorCounts: pattern.colors }).replace(
        "width='100%' height='100%'",
        `width='${W}' height='${W}' viewBox='0 0 ${W} ${W}'`,
      );
      return { files: [svgFile('pattern.svg', svg)], note: `${pattern.title} pattern tile` };
    },
  },
};
