

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let instance: FFmpeg | null = null;
let loading: Promise<FFmpeg> | null = null;

export interface LoadHooks {
  onLog?: (message: string) => void;
  onProgress?: (ratio: number) => void;
  onDownload?: (note: string) => void;
}

export async function getFFmpeg(hooks: LoadHooks = {}): Promise<FFmpeg> {
  if (instance) return instance;
  if (loading) return loading;

  loading = (async () => {
    const ff = new FFmpeg();
    if (hooks.onLog) ff.on('log', ({ message }) => hooks.onLog!(message));
    if (hooks.onProgress) ff.on('progress', ({ progress }) => hooks.onProgress!(progress));
    hooks.onDownload?.('Downloading the media engine (~31 MB, first use only)…');
    const base = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
    await ff.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    hooks.onDownload?.('');
    instance = ff;
    return ff;
  })();

  // If the load fails, clear the cached promise so a later call can retry —
  // otherwise one CDN blip permanently bricks the converter until page reload.
  loading.catch(() => { loading = null; });

  return loading;
}

export { fetchFile };
