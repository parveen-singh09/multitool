export const VIDEO_MIME: Record<string, string> = {
  mp4: 'video/mp4', webm: 'video/webm', mkv: 'video/x-matroska',
  mov: 'video/quicktime', avi: 'video/x-msvideo', flv: 'video/x-flv', ogv: 'video/ogg',
};

export const LOCAL_VIDEO = Object.keys(VIDEO_MIME);

export function videoArgs(to: string, tier: string, input: string, output: string): string[] {
  const x264crf = tier === 'high' ? '20' : tier === 'small' ? '28' : '23';
  const vp8b = tier === 'high' ? '1M' : tier === 'small' ? '0.4M' : '0.7M';
  const mp4gp5 = tier === 'high' ? '3' : tier === 'small' ? '8' : '5';
  const theora = tier === 'high' ? '8' : tier === 'small' ? '4' : '6';
  const pre = ['-i', input];
  switch (to) {
    case 'mp4':
    case 'mov':
    case 'mkv':
    case 'flv':
      return [...pre, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', x264crf, '-pix_fmt', 'yuv420p',
              '-c:a', 'aac', '-b:a', '192k', ...(to === 'mp4' || to === 'mov' ? ['-movflags', '+faststart'] : []), output];
    case 'webm':
      return [...pre, '-c:v', 'libvpx', '-b:v', vp8b, '-c:a', 'libvorbis', '-q:a', '4', output];
    case 'avi':
      return [...pre, '-c:v', 'mpeg4', '-q:v', mp4gp5, '-c:a', 'libmp3lame', '-q:a', '4', output];
    case 'ogv':
      return [...pre, '-c:v', 'libtheora', '-q:v', theora, '-c:a', 'libvorbis', '-q:a', '4', output];
    default:
      return [...pre, output];
  }
}
