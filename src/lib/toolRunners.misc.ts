// Inline runners for the mixed visual + audio generators. Same contract as
// toolRunners.ts — one entry per tool, porting each tool's REAL logic (its lib
// or its page's generation code), never guessing at output.
//
// Deps reused from the pages: highlight.js (code-snippet), wordcloud
// (word-cloud-maker), chart.js (chart-maker), plus ./colors + ./random for the
// palette. Web Audio's OfflineAudioContext + a ported WAV encoder for tones.
//
// ponytail: chat runners take a single named input via `extract` + sane
// defaults; the full pages keep every slider/picker/mode. One extract call per
// runner to avoid extra AI roundtrips.

import type { Runner, RunFile } from './toolRunners';
import { canvasBlob } from './toolRunners';

const svgFile = (name: string, svg: string): RunFile =>
  ({ name, blob: new Blob([svg], { type: 'image/svg+xml' }), kind: 'image' });

export const RUNNERS_MISC: Record<string, Runner> = {
  // --- Color palette: build a harmony palette → hex list (text) + a PNG strip.
  // Ports build()/hslHex from the page, reusing ./colors + ./random.
  'color-palette-generator': {
    needs: 'text',
    async run({ extract }) {
      const { hexToRgb, rgbToHex, hslToRgb } = await import('./colors');
      const { randInt } = await import('./random');

      // One call: harmony + count. Defaults: auto, 5.
      const spec = (await extract(
        'From the request, return the palette harmony and color count as "<harmony> <count>". ' +
        'harmony ∈ auto|analogous|monochrome|complementary|split|triadic|tetradic; count 3-8. ' +
        'If unspecified return "auto 5".',
      )).toLowerCase();
      const mode = (spec.match(/analogous|monochrome|complementary|split|triadic|tetradic|auto/) || ['auto'])[0];
      const n = Math.min(8, Math.max(3, Number((spec.match(/[3-8]/) || [])[0]) || 5));

      const clamp = (h: number, s: number, l: number) => ({ h: ((h % 360) + 360) % 360, s: Math.max(0, Math.min(100, s)), l: Math.max(0, Math.min(100, l)) });
      const hslHex = (h: number, s: number, l: number) => rgbToHex(hslToRgb(clamp(h, s, l)));
      const b = { h: randInt(0, 359), s: randInt(55, 80), l: randInt(45, 65) };
      const center = (n - 1) / 2;
      const hexes: string[] = [];
      for (let i = 0; i < n; i++) {
        const t = i / Math.max(1, n - 1);
        switch (mode) {
          case 'analogous': hexes.push(hslHex(b.h + (i - center) * 28, b.s + randInt(-6, 6), b.l + (i - center) * 6)); break;
          case 'monochrome': hexes.push(hslHex(b.h + randInt(-4, 4), b.s + randInt(-10, 10), 22 + t * 60)); break;
          case 'complementary': hexes.push(hslHex(i % 2 === 0 ? b.h : b.h + 180, b.s + randInt(-8, 8), 40 + t * 30)); break;
          case 'split': hexes.push(hslHex(b.h + [0, 150, 210][i % 3], b.s + randInt(-8, 8), 42 + t * 26)); break;
          case 'triadic': hexes.push(hslHex(b.h + (i % 3) * 120, b.s + randInt(-8, 8), 42 + t * 26)); break;
          case 'tetradic': hexes.push(hslHex(b.h + (i % 4) * 90, b.s + randInt(-8, 8), 42 + t * 26)); break;
          default: hexes.push(hslHex(randInt(0, 359), randInt(50, 82), randInt(40, 72)));
        }
      }

      // PNG swatch strip (ported from the page's downloadPng).
      const W = 240, H = 320;
      const canvas = document.createElement('canvas');
      canvas.width = W * hexes.length; canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      hexes.forEach((hex, i) => {
        const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
        const L = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        ctx.fillStyle = hex; ctx.fillRect(i * W, 0, W, H);
        ctx.fillStyle = L > 0.6 ? '#0b0b0c' : '#ffffff';
        ctx.font = '600 22px ui-monospace, monospace'; ctx.textAlign = 'center';
        ctx.fillText(hex.toUpperCase(), i * W + W / 2, H - 28);
      });
      return {
        files: [{ name: 'palette.png', blob: await canvasBlob(canvas), kind: 'image' }],
        text: hexes.map((h) => h.toUpperCase()).join(', '),
        note: `${mode === 'auto' ? 'Random' : mode} palette · ${n} colors`,
      };
    },
  },

  // --- Signature: render a typed name in a script font to a transparent PNG.
  // Ports the page's "type" mode (renderTyped) + high-res export.
  'signature-generator': {
    needs: 'text',
    async run({ extract }) {
      const name = (await extract('Return ONLY the name to render as a signature. Just the name, no quotes.')).trim() || 'Signature';
      const REF_W = 700, W = REF_W * 3, H = Math.round(REF_W * 0.4) * 3; // 5:2 stage, 3× export
      const ink = '#0b1324';
      // ponytail: system cursive stack (page default); full tool offers 6 styles.
      const font = '"Segoe Script","Snell Roundhand","Brush Script MT",cursive';
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const c = canvas.getContext('2d')!;
      c.fillStyle = ink; c.textAlign = 'center'; c.textBaseline = 'middle';
      let fs = H * 0.42;
      c.font = `${fs}px ${font}`;
      while (c.measureText(name).width > W - W * 0.12 && fs > 12) { fs -= 4; c.font = `${fs}px ${font}`; }
      c.fillText(name, W / 2, H * 0.46);
      return { files: [{ name: 'signature.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `Signature · “${name}”` };
    },
  },

  // --- Code snippet: highlight code (highlight.js auto-detect) and render it to
  // a framed PNG. Ports the page's tokenize/roleColor + canvas draw (linear
  // theme, indigo gradient bg, traffic-light dots).
  // ponytail: single theme + background; full tool has 9 themes / 16 backgrounds.
  'code-snippet-generator': {
    needs: 'text',
    async run({ extract }) {
      const code = (await extract('Return ONLY the exact code the user wants rendered, verbatim, no fences or commentary.')).replace(/^```\w*\n?|\n?```$/g, '');
      if (!code.trim()) throw new Error('Give me the code to render.');
      const { loadHljs } = await import('./highlight');
      const hljs = await loadHljs();

      const t = {
        fg: '#e6e7ea', win: '#181822', winFg: '#8a8f98',
        keyword: '#828fff', string: '#7fd0a6', number: '#d0a0ff', comment: '#62666d',
        fn: '#f2c777', builtin: '#828fff', variable: '#7ec7ff', property: '#7ec7ff',
        type: '#f2c777', punctuation: '#8a8f98',
      };
      const roleColor = (cls: string): string | null => {
        const c = ' ' + cls + ' ';
        const has = (k: string) => c.includes(' hljs-' + k + ' ') || c.includes(' hljs-' + k);
        if (has('comment') || has('quote')) return t.comment;
        if (has('keyword') || has('selector-tag') || has('literal')) return t.keyword;
        if (has('built_in')) return t.builtin;
        if (has('string') || has('regexp') || has('char')) return t.string;
        if (has('number') || has('symbol')) return t.number;
        if (has('title') || has('function_') || has('section') || has('name')) return t.fn;
        if (has('type') || has('class')) return t.type;
        if (has('attr') || has('attribute') || has('property') || has('variable') || has('template-variable')) return t.property;
        if (has('tag') || has('meta') || has('punctuation') || has('params') || has('doctag')) return t.punctuation;
        return null;
      };
      type RunT = { text: string; color: string };
      const res = hljs.highlightAuto(code);
      const root = document.createElement('div');
      root.innerHTML = res.value;
      const flat: RunT[] = [];
      const walk = (node: Node, color: string) => node.childNodes.forEach((child) => {
        if (child.nodeType === 3) flat.push({ text: (child.nodeValue || '').replace(/\t/g, '  '), color });
        else if (child.nodeType === 1) { const el = child as HTMLElement; walk(el, roleColor(el.className) || color); }
      });
      walk(root, t.fg);
      const lines: RunT[][] = [[]];
      for (const r of flat) r.text.split('\n').forEach((p, i) => { if (i > 0) lines.push([]); if (p) lines[lines.length - 1].push({ text: p, color: r.color }); });

      const MONO = 'ui-monospace, "Menlo", "Consolas", monospace';
      const fontSize = 15, lineHeight = 24, winPad = 20, titleH = 44, pad = 48;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      ctx.font = `${fontSize}px ${MONO}`;
      let maxW = 1;
      for (const line of lines) { let w = 0; for (const r of line) w += ctx.measureText(r.text).width; maxW = Math.max(maxW, w); }
      const winW = Math.ceil(maxW + winPad * 2);
      const winH = Math.ceil(titleH + lines.length * lineHeight + winPad * 2);
      const cw = winW + pad * 2, ch = winH + pad * 2, scale = 2;
      canvas.width = cw * scale; canvas.height = ch * scale;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.textBaseline = 'top'; ctx.textAlign = 'left';

      // indigo gradient background (page default index 5).
      const g = ctx.createLinearGradient(0, 0, cw, ch);
      g.addColorStop(0, '#667eea'); g.addColorStop(1, '#764ba2');
      ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
      // window card + drop shadow + dots.
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
      ctx.fillStyle = t.win; ctx.beginPath(); ctx.roundRect(pad, pad, winW, winH, 12); ctx.fill(); ctx.restore();
      ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((col, i) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(pad + 24 + i * 20, pad + 22, 6, 0, Math.PI * 2); ctx.fill(); });
      // code.
      ctx.font = `${fontSize}px ${MONO}`;
      const codeX = pad + winPad, codeY = pad + titleH + winPad;
      lines.forEach((line, i) => {
        let x = codeX; const y = codeY + i * lineHeight;
        for (const r of line) { ctx.fillStyle = r.color; ctx.fillText(r.text, x, y); x += ctx.measureText(r.text).width; }
      });
      return { files: [{ name: 'code-snippet.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `Code snippet · ${res.language || 'auto'}` };
    },
  },

  // --- Logo: build a wordmark SVG from a brand name. Ports the page's buildSvg
  // (default icon left of the name, indigo accent, dark card).
  // ponytail: fixed icon/layout/accent; full tool shuffles all of them.
  'logo-generator': {
    needs: 'text',
    async run({ extract }) {
      const raw = (await extract('Return ONLY the brand/company name for the logo. Just the name.')).trim() || 'Brand';
      const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
      const name = esc(raw);
      const accent = '#5e6ad2', font = "'Inter',system-ui,sans-serif";
      const icon = '<path d="M50 6l10 34 34 10-34 10-10 34-10-34L6 50l34-10z" fill="currentColor"/>'; // Spark

      const measure = document.createElement('canvas').getContext('2d')!;
      measure.font = `700 54px ${font}`;
      const nameW = measure.measureText(raw).width - (raw.length - 1); // letter-spacing -1
      const iconBox = 88, gap = 24, pad = 40, nameSize = 54;
      const textX = pad + iconBox + gap;
      const w = Math.round(textX + Math.max(nameW, 0) + pad);
      const h = Math.round(pad * 2 + Math.max(iconBox, nameSize));
      const cy = h / 2;
      const iconG = `<g transform="translate(${pad},${cy - iconBox / 2}) scale(${iconBox / 100})" color="${accent}">${icon}</g>`;
      const textG = `<text x="${textX}" y="${cy + nameSize * 0.34}" font-family="${font}" font-weight="700" font-size="${nameSize}" fill="#f7f8f8" letter-spacing="-1" dominant-baseline="middle">${name}</text>`;
      const rect = `<rect width="${w}" height="${h}" rx="18" fill="#0f1011"/>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${rect}${iconG}${textG}</svg>`;
      return { files: [svgFile('logo.svg', svg)], note: `Logo · “${raw}”` };
    },
  },

  // --- Word cloud: count words from the user's text and render a cloud PNG via
  // the `wordcloud` dep. Ports the page's tokenizer + weightFactor essentials.
  // ponytail: circle shape, lavender palette, system font; full tool has masks,
  // 20 fonts, and every layout knob.
  'word-cloud-maker': {
    needs: 'text',
    async run({ extract }) {
      const text = (await extract('Return the text/words the user wants in the word cloud, verbatim.')).trim();
      if (!text) throw new Error('Give me some text or a list of words.');
      const WordCloud = (await import('wordcloud')).default as any;

      const STOP = new Set(('a an and are as at be but by for from has have he her him his i in is it its me my no not of on or our so that the their them they this to us was we were what when where which who will with you your yours'.split(' ')));
      const freq = new Map<string, number>();
      for (const w of (text.toLowerCase().match(/[\p{L}\p{N}']+/gu) || [])) {
        if (w.length < 2 || STOP.has(w)) continue;
        freq.set(w, (freq.get(w) || 0) + 1);
      }
      const list = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 120);
      if (!list.length) throw new Error('No usable words in that text.');

      const W = 1600, H = 1000;
      const palette = ['#5e6ad2', '#7b83e0', '#9aa0ec', '#4c56b8', '#8f7be0'];
      const maxW = Math.max(1, ...list.map((e) => e[1]));
      const base = Math.min(H / 5, (H * 1.6) / Math.sqrt(list.length + 3));
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;

      let ci = 0;
      await new Promise<void>((resolve) => {
        canvas.addEventListener('wordcloudstop', () => resolve(), { once: true });
        WordCloud(canvas, {
          list,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: '700',
          color: () => palette[ci++ % palette.length],
          backgroundColor: '#ffffff',
          weightFactor: (w: number) => Math.max(6, Math.pow(w / maxW, 0.7) * base),
          gridSize: 8,
          rotateRatio: 0.1,
          shuffle: true,
          drawOutOfBound: false,
          shrinkToFit: true,
          abortThreshold: 2000,
          minRotation: -Math.PI / 2, maxRotation: Math.PI / 2, rotationSteps: 2,
        });
        // Fallback in case the stop event never fires (empty layout).
        setTimeout(resolve, 5000);
      });
      return { files: [{ name: 'word-cloud.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `Word cloud · ${list.length} words` };
    },
  },

  // --- Chart: render {type, labels, values} to a PNG via chart.js. Ports the
  // page's config essentials for the common single-series types.
  // ponytail: bar/line/area/pie/doughnut/scatter only; full tool covers 24
  // types incl. treemap/heatmap/candlestick via extra plugins.
  'chart-maker': {
    needs: 'text',
    async run({ extract }) {
      const spec = await extract(
        'Return ONLY JSON for the chart the user wants: {"type":"bar|line|area|pie|doughnut|scatter","labels":["…"],"values":[…],"title":"…"}. ' +
        'For scatter, values is an array of [x,y] pairs. No prose.',
      );
      let data: { type?: string; labels?: any[]; values?: any[]; title?: string };
      try { data = JSON.parse(spec.replace(/^```json?\n?|\n?```$/g, '').trim()); }
      catch { throw new Error("Tell me the chart data (labels and values) and I'll draw it."); }
      const type = (data.type || 'bar').toLowerCase();
      const values = data.values || [];
      const labels = data.labels || values.map((_, i) => `#${i + 1}`);
      if (!values.length) throw new Error('No data values to chart.');

      const { Chart, registerables } = await import('chart.js');
      (Chart.register as (...i: unknown[]) => void)(...registerables);

      const accent = '#5e6ad2';
      const PALETTE = ['#5e6ad2', '#26a69a', '#ef6c57', '#f2b84b', '#7e57c2', '#42a5f5', '#ec407a', '#66bb6a', '#8d6e63', '#78909c'];
      const rgb = (h: string) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) });
      const alpha = (h: string, a: number) => { const { r, g, b } = rgb(h); return `rgba(${r},${g},${b},${a})`; };

      const canvas = document.createElement('canvas');
      canvas.width = 900; canvas.height = 540;
      Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
      Chart.defaults.color = '#33333a';

      const bgPlugin = { id: 'bg', beforeDraw(c: any) { const x = c.ctx; x.save(); x.globalCompositeOperation = 'destination-over'; x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height); x.restore(); } };
      const title = data.title ? { display: true, text: data.title, font: { size: 18, weight: 600 as const }, padding: { bottom: 16 } } : { display: false };
      const common = { responsive: false, animation: false as const, devicePixelRatio: 2, plugins: { title, legend: { display: type === 'pie' || type === 'doughnut' } } };

      let config: any;
      if (type === 'pie' || type === 'doughnut') {
        config = { type, data: { labels, datasets: [{ data: values, backgroundColor: labels.map((_: any, i: number) => PALETTE[i % PALETTE.length]), borderColor: '#fff', borderWidth: 2 }] }, options: common, plugins: [bgPlugin] };
      } else if (type === 'scatter') {
        const pts = values.map((v: any) => Array.isArray(v) ? { x: v[0], y: v[1] } : { x: v?.x, y: v?.y });
        config = { type: 'scatter', data: { datasets: [{ label: data.title || 'Points', data: pts, backgroundColor: accent }] }, options: common, plugins: [bgPlugin] };
      } else {
        const area = type === 'area';
        config = {
          type: area ? 'line' : type,
          data: { labels, datasets: [{ label: data.title || 'Value', data: values, backgroundColor: area ? alpha(accent, 0.25) : alpha(accent, 0.85), borderColor: accent, borderWidth: 2, fill: area, tension: 0, pointRadius: type === 'line' || area ? 3 : 0 }] },
          options: { ...common, scales: { x: { grid: { color: 'rgba(0,0,0,.08)' } }, y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.08)' } } } },
          plugins: [bgPlugin],
        };
      }
      const chart = new Chart(canvas, config);
      chart.draw(); // animation:false renders synchronously, but force a draw to be safe
      const blob = await canvasBlob(canvas);
      chart.destroy();
      return { files: [{ name: 'chart.png', blob, kind: 'image' }], note: `${type} chart · ${values.length} points` };
    },
  },

  // --- Audio tone: synthesize a single tone offline → WAV. Ports the page's
  // OfflineAudioContext render + encodeWav (44-byte header + 16-bit PCM).
  // ponytail: single-tone mode; full tool also does sweeps and binaural beats.
  'audio-tone-generator': {
    needs: 'text',
    async run({ extract }) {
      const spec = (await extract(
        'Return "<frequency Hz> <duration s> <waveform>" for the tone. ' +
        'waveform ∈ sine|square|triangle|sawtooth. If unspecified return "440 2 sine".',
      )).toLowerCase();
      const nums = spec.match(/\d+(?:\.\d+)?/g) || [];
      const freq = Math.max(1, Math.min(24000, Number(nums[0]) || 440));
      const dur = Math.max(0.1, Math.min(600, Number(nums[1]) || 2));
      const wave = (spec.match(/sine|square|triangle|sawtooth/) || ['sine'])[0] as OscillatorType;

      const sr = 44100;
      const oac = new OfflineAudioContext(1, Math.ceil(sr * dur), sr);
      const g = oac.createGain();
      const v = 0.3, fade = 0.02;
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(v, fade);
      g.gain.setValueAtTime(v, Math.max(fade, dur - fade));
      g.gain.linearRampToValueAtTime(0, dur);
      g.connect(oac.destination);
      const o = oac.createOscillator();
      o.type = wave; o.frequency.value = freq;
      o.connect(g); o.start(); o.stop(dur);
      const buffer = await oac.startRendering();

      // encodeWav: mono 16-bit PCM (ported from the page).
      const ch = buffer.numberOfChannels, len = buffer.length;
      const out = new ArrayBuffer(44 + len * ch * 2);
      const dv = new DataView(out);
      const wr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i)); };
      wr(0, 'RIFF'); dv.setUint32(4, 36 + len * ch * 2, true); wr(8, 'WAVE');
      wr(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, ch, true);
      dv.setUint32(24, sr, true); dv.setUint32(28, sr * ch * 2, true); dv.setUint16(32, ch * 2, true); dv.setUint16(34, 16, true);
      wr(36, 'data'); dv.setUint32(40, len * ch * 2, true);
      let off = 44;
      const chans = Array.from({ length: ch }, (_, c) => buffer.getChannelData(c));
      for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const s = Math.max(-1, Math.min(1, chans[c][i])); dv.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true); off += 2; }

      return {
        files: [{ name: `tone-${Math.round(freq)}hz.wav`, blob: new Blob([out], { type: 'audio/wav' }), kind: 'file' }],
        note: `${Math.round(freq)} Hz ${wave} · ${dur}s WAV`,
      };
    },
  },
};
