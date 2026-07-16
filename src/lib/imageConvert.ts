
export interface ConvertOpts {
  to: string;        
  quality?: number;  
  flatten?: boolean; 
}

export function convertImage(file: File, opts: ConvertOpts): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode that image.'));
      img.onload = () => {
        const w = img.naturalWidth || 512;
        const h = img.naturalHeight || 512;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas is not supported in this browser.'));
        if (opts.flatten) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Your browser could not encode this format.'))),
          opts.to,
          opts.quality,
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

if (import.meta.env.DEV && typeof document !== 'undefined') {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  c.toBlob((png) => {
    if (!png) return;
    convertImage(new File([png], 'x.png', { type: 'image/png' }), { to: 'image/jpeg', quality: 0.9, flatten: true })
      .then((out) => console.assert(out.size > 0 && out.type === 'image/jpeg', 'convertImage should return a jpeg blob'))
      .catch((e) => console.assert(false, 'convertImage self-check threw: ' + e));
  }, 'image/png');
}
