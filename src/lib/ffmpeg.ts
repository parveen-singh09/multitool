// Shared ffmpeg.wasm loader. Loads the self-hosted single-thread core once
// and reuses the instance across every audio/video tool. Single-thread core
// avoids SharedArrayBuffer, so no COOP/COEP response headers are required —
// the tools work on any static host. The ~31 MB core is fetched from the same
// origin (public/ffmpeg), never a third party.
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
    const base = '/ffmpeg';
    await ff.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    hooks.onDownload?.('');
    instance = ff;
    return ff;
  })();

  return loading;
}

export { fetchFile };
