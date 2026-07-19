import type { Runner, RunResult, RunFile } from './toolRunners';
import { CONVERSIONS } from './docConvertDispatch';
import { encodeCanvas, type RasterFormat } from './imageEncoders';
import { imagesToDocx, imagesToXlsx, imagesToPptx, imagesToPdf, type DocImage } from './imageDocs';

function docNeeds(slug: string, inputKind: string): Runner['needs'] {
  if (inputKind === 'text') return 'text';
  if (slug === 'pdf-to-csv') return 'pdf';
  if (slug === 'jpg-to-pdf' || slug === 'png-to-pdf') return 'image';
  return 'text';
}

function bridgeDoc(slug: string, spec: (typeof CONVERSIONS)[string]): Runner {
  return {
    needs: docNeeds(slug, spec.inputKind),
    async run({ query, files, extract }) {
      let input: { text?: string; file?: File };
      let base = 'output';
      if (spec.inputKind === 'text') {
        let text = query;
        try { const x = await extract('Return ONLY the exact text/data the user wants converted — no commentary, no code fences.'); if (x && x.trim()) text = x; } catch {}
        input = { text };
      } else {
        const file = files[0];
        if (!file) throw new Error('Attach the file you want to convert (paperclip on the left).');
        input = { file };
        base = file.name.replace(/\.[^.]+$/, '') || 'output';
      }
      const res = await spec.run(input, base);
      const out: RunResult = {};
      if (res.note) out.note = res.note;
      if (res.text != null) out.text = res.text;
      if (res.blob) {
        const kind: RunFile['kind'] = res.blob.type.startsWith('image/') && res.blob.type !== 'image/tiff' && res.blob.type !== 'image/vnd.adobe.photoshop' ? 'image' : 'file';
        out.files = [{ name: res.filename || `${base}.${res.ext || 'bin'}`, blob: res.blob, kind }];
      }
      return out;
    },
  };
}

const IMAGE_TARGETS: Record<string, string> = {
  'jpg-to-word': 'word', 'jpg-to-excel': 'excel', 'jpg-to-powerpoint': 'powerpoint',
  'jpg-to-svg': 'svg', 'jpg-to-bmp': 'bmp', 'jpg-to-tiff': 'tiff', 'jpg-to-ico': 'ico',
  'jpg-to-psd': 'psd', 'jpg-to-html': 'html',
  'bmp-to-jpg': 'image/jpeg', 'bmp-to-png': 'image/png', 'bmp-to-webp': 'image/webp',
  'bmp-to-gif': 'gif', 'bmp-to-pdf': 'pdf', 'bmp-to-ico': 'ico', 'bmp-to-svg': 'svg',
  'bmp-to-tiff': 'tiff', 'bmp-to-base64': 'base64', 'bmp-batch': 'image/png',
  'jfif-to-jpg': 'image/jpeg', 'jfif-to-png': 'image/png', 'jfif-to-webp': 'image/webp',
  'jfif-to-gif': 'gif', 'jfif-to-bmp': 'bmp', 'jfif-to-ico': 'ico', 'jfif-to-pdf': 'pdf',
  'jfif-to-svg': 'svg', 'jfif-to-tiff': 'tiff', 'jfif-to-psd': 'psd', 'jfif-to-avif': 'image/avif',
  'jfif-to-base64': 'base64',
};
const DOC_TARGETS = new Set(['word', 'excel', 'powerpoint', 'pdf']);

function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || 512; c.height = img.naturalHeight || 512;
      c.getContext('2d')!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(c);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not decode that image.')); };
    img.src = url;
  });
}

async function canvasToDocImage(c: HTMLCanvasElement, jpg = false): Promise<DocImage> {
  const mime = jpg ? 'image/jpeg' : 'image/png';
  const blob = await new Promise<Blob>((res, rej) => c.toBlob((b) => b ? res(b) : rej(new Error('encode failed')), mime, 0.92));
  return { bytes: new Uint8Array(await blob.arrayBuffer()), ext: jpg ? 'jpg' : 'png', w: c.width, h: c.height };
}

function bridgeImage(slug: string, target: string): Runner {
  return {
    needs: 'image',
    async run({ files }) {
      const imgs = files.filter((f) => /^image\//.test(f.type) || /\.(jpe?g|jfif|bmp|png|gif|webp)$/i.test(f.name));
      if (!imgs.length) throw new Error('Attach an image to convert (paperclip on the left).');
      const base = imgs[0].name.replace(/\.[^.]+$/, '') || 'image';

      if (DOC_TARGETS.has(target)) {
        const jpg = target === 'pdf' || target === 'powerpoint';
        const docImages = await Promise.all(imgs.map(async (f) => canvasToDocImage(await fileToCanvas(f), jpg)));
        let blob: Blob, ext: string;
        if (target === 'word') { blob = imagesToDocx(docImages); ext = 'docx'; }
        else if (target === 'excel') { blob = imagesToXlsx(docImages); ext = 'xlsx'; }
        else if (target === 'powerpoint') { blob = imagesToPptx(docImages); ext = 'pptx'; }
        else { blob = await imagesToPdf(docImages); ext = 'pdf'; }
        return { files: [{ name: `${imgs.length === 1 ? base : 'images'}.${ext}`, blob, kind: 'file' }], note: `${imgs.length} image(s) → ${ext.toUpperCase()}` };
      }

      if (target === 'base64' || target === 'html') {
        const outFiles: string[] = [];
        for (const f of imgs) {
          const c = await fileToCanvas(f);
          const dataUrl = c.toDataURL('image/png');
          outFiles.push(target === 'html' ? `<img src="${dataUrl}" alt="${f.name}" width="${c.width}" height="${c.height}" />` : dataUrl);
        }
        return { text: outFiles.join('\n\n'), note: `${imgs.length} image(s) → ${target === 'html' ? 'HTML <img> tag' : 'Base64 data URI'}` };
      }

      const results: RunFile[] = [];
      for (const f of imgs) {
        const c = await fileToCanvas(f);
        const enc = await encodeCanvas(c, target as RasterFormat, { quality: 0.9, matte: '#ffffff' });
        const b = f.name.replace(/\.[^.]+$/, '') || 'image';
        const isImg = enc.mime.startsWith('image/') && enc.mime !== 'image/tiff' && enc.mime !== 'image/vnd.adobe.photoshop';
        results.push({ name: `${b}.${enc.ext}`, blob: enc.blob, kind: isImg ? 'image' : 'file' });
      }
      return { files: results, note: `${imgs.length} image(s) converted` };
    },
  };
}

export const RUNNERS_DOCCONV: Record<string, Runner> = {};
for (const [slug, spec] of Object.entries(CONVERSIONS)) RUNNERS_DOCCONV[slug] = bridgeDoc(slug, spec);
for (const [slug, target] of Object.entries(IMAGE_TARGETS)) RUNNERS_DOCCONV[slug] = bridgeImage(slug, target);
