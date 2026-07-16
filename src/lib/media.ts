

export type OutFamily = 'mp3' | 'aac' | 'ogg' | 'wav' | 'video';

export interface MediaConversion {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  icon: string;

  kind: 'audio' | 'video';

  accept: string;

  ext: string;

  mime: string;

  out: OutFamily;

  about: string;

  slow?: boolean;
}

export interface ConvertOptions {

  quality?: string;

  sampleRate?: number;

  channels?: number;

  trimStart?: number;

  trimEnd?: number;

  normalize?: boolean;

  fadeIn?: number;
  fadeOut?: number;

  duration?: number;

  crf?: number;

  scale?: number;

  fps?: number;

  mute?: boolean;

  audioBitrate?: number;
}

const AUDIO_ICON = 'M9 18V5l12-2v13M9 13l12-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z';
const VIDEO_ICON = 'M4 5h16v14H4zM10 9l5 3-5 3z';

export function buildArgs(conv: MediaConversion, o: ConvertOptions, input: string, output: string): string[] {
  const pre: string[] = [];
  const start = o.trimStart && o.trimStart > 0 ? o.trimStart : 0;
  if (start > 0) pre.push('-ss', String(start));
  pre.push('-i', input);
  if (o.trimEnd && o.trimEnd > start) pre.push('-to', String(o.trimEnd - start));

  if (conv.out === 'video') {
    const v: string[] = [];
    v.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(o.crf ?? 23), '-pix_fmt', 'yuv420p');
    if (o.scale && o.scale > 0) v.push('-vf', `scale='min(${o.scale},iw)':-2`);
    if (o.fps && o.fps > 0) v.push('-r', String(o.fps));
    if (o.mute) v.push('-an');
    else v.push('-c:a', 'aac', '-b:a', (o.audioBitrate || 192) + 'k');
    v.push('-movflags', '+faststart');
    return [...pre, ...v, output];
  }

  const outDur = o.trimEnd && o.trimEnd > start ? o.trimEnd - start : (o.duration || 0) - start;
  const af: string[] = [];
  if (o.fadeIn && o.fadeIn > 0) af.push(`afade=t=in:st=0:d=${o.fadeIn}`);
  if (o.fadeOut && o.fadeOut > 0 && outDur > 0) af.push(`afade=t=out:st=${Math.max(0, outDur - o.fadeOut).toFixed(3)}:d=${o.fadeOut}`);
  if (o.normalize) af.push('loudnorm=I=-16:TP=-1.5:LRA=11');

  const out: string[] = [];
  out.push('-vn'); 
  if (o.sampleRate && o.sampleRate > 0) out.push('-ar', String(o.sampleRate));
  if (o.channels && o.channels > 0) out.push('-ac', String(o.channels));
  if (af.length) out.push('-af', af.join(','));

  const q = o.quality || '';
  if (conv.out === 'mp3') {
    out.push('-c:a', 'libmp3lame');
    if (q.startsWith('v')) out.push('-q:a', q.slice(1)); 
    else out.push('-b:a', (q || '192') + 'k'); 
  } else if (conv.out === 'aac') {
    out.push('-c:a', 'aac', '-b:a', (q || '192') + 'k');
  } else if (conv.out === 'ogg') {
    out.push('-c:a', 'libvorbis', '-q:a', q || '5'); 
  } else if (conv.out === 'wav') {
    out.push('-c:a', q || 'pcm_s16le'); 
  }
  return [...pre, ...out, output];
}

export function defaultQuality(out: OutFamily): string {
  switch (out) {
    case 'mp3': return 'v2';
    case 'aac': return '192';
    case 'ogg': return '5';
    case 'wav': return 'pcm_s16le';
    default: return '';
  }
}

export const MEDIA_CONVERSIONS: MediaConversion[] = [
  {
    slug: 'mp4-to-mp3', name: 'MP4 to MP3', tagline: 'Extract MP3 audio from MP4 video.',
    description: 'Free online MP4 to MP3 converter. Extract the audio track from an MP4 video and save it as an MP3 file, right in your browser. Choose the bitrate, trim, normalize and convert several files at once. No account.',
    keywords: ['mp4 to mp3', 'convert mp4 to mp3', 'mp4 to mp3 converter', 'extract audio from mp4', 'video to mp3'],
    icon: AUDIO_ICON, kind: 'video', accept: 'video/mp4,video/*', ext: 'mp3', mime: 'audio/mpeg', out: 'mp3',
    about: 'MP4 to MP3 converter extracts the audio track from an MP4 (or other) video and saves it as an MP3 you can play anywhere.',
  },
  {
    slug: 'wav-to-mp3', name: 'WAV to MP3', tagline: 'Compress WAV audio to MP3.',
    description: 'Free online WAV to MP3 converter. Compress large uncompressed WAV audio into small, universally supported MP3 files in your browser. Pick the bitrate, adjust channels and sample rate, and batch-convert.',
    keywords: ['wav to mp3', 'convert wav to mp3', 'wav to mp3 converter', 'compress wav', 'wav to mp3 online'],
    icon: AUDIO_ICON, kind: 'audio', accept: 'audio/wav,audio/*', ext: 'mp3', mime: 'audio/mpeg', out: 'mp3',
    about: 'WAV to MP3 converter compresses large uncompressed WAV files into small MP3s, saving space while keeping good quality.',
  },
  {
    slug: 'mp3-to-wav', name: 'MP3 to WAV', tagline: 'Decode MP3 to uncompressed WAV.',
    description: 'Free online MP3 to WAV converter. Decode MP3 audio into uncompressed WAV (PCM) for editing and mastering, in your browser. Choose 16, 24 or 32-bit depth, sample rate and channels.',
    keywords: ['mp3 to wav', 'convert mp3 to wav', 'mp3 to wav converter', 'mp3 to wav online', 'decode mp3'],
    icon: AUDIO_ICON, kind: 'audio', accept: 'audio/mpeg,audio/*', ext: 'wav', mime: 'audio/wav', out: 'wav',
    about: 'MP3 to WAV converter decodes compressed MP3 audio into an uncompressed WAV (PCM) file, handy for audio editing software.',
  },
  {
    slug: 'flac-to-mp3', name: 'FLAC to MP3', tagline: 'Convert lossless FLAC to MP3.',
    description: 'Free online FLAC to MP3 converter. Convert lossless FLAC audio into compact MP3 files that play on any device, in your browser. Choose the bitrate, normalize loudness and convert several at once.',
    keywords: ['flac to mp3', 'convert flac to mp3', 'flac to mp3 converter', 'flac to mp3 online', 'lossless to mp3'],
    icon: AUDIO_ICON, kind: 'audio', accept: 'audio/flac,.flac,audio/*', ext: 'mp3', mime: 'audio/mpeg', out: 'mp3',
    about: 'FLAC to MP3 converter turns lossless FLAC audio into compact MP3 files that play on virtually any device or player.',
  },
  {
    slug: 'm4a-to-mp3', name: 'M4A to MP3', tagline: 'Convert M4A/AAC audio to MP3.',
    description: 'Free online M4A to MP3 converter. Convert M4A and AAC audio (Apple, voice memos) into universal MP3 files in your browser. Pick the bitrate, downmix to mono for voice, trim and batch-convert. No sign-up.',
    keywords: ['m4a to mp3', 'convert m4a to mp3', 'm4a to mp3 converter', 'aac to mp3', 'm4a to mp3 online'],
    icon: AUDIO_ICON, kind: 'audio', accept: 'audio/mp4,audio/x-m4a,.m4a,audio/*', ext: 'mp3', mime: 'audio/mpeg', out: 'mp3',
    about: 'M4A to MP3 converter turns Apple M4A and AAC audio — including voice memos — into MP3 files that work everywhere.',
  },
  {
    slug: 'ogg-converter', name: 'OGG Converter', tagline: 'Convert audio to OGG Vorbis.',
    description: 'Free online OGG converter. Convert MP3, WAV, M4A and other audio into open OGG Vorbis format in your browser. Choose the Vorbis quality, channels and sample rate.',
    keywords: ['ogg converter', 'mp3 to ogg', 'wav to ogg', 'convert to ogg', 'ogg vorbis converter'],
    icon: AUDIO_ICON, kind: 'audio', accept: 'audio/*', ext: 'ogg', mime: 'audio/ogg', out: 'ogg',
    about: 'OGG converter turns MP3, WAV, M4A and other audio into the free, open OGG Vorbis format used by games and open-source software.',
  },
  {
    slug: 'aac-converter', name: 'AAC Converter', tagline: 'Convert audio to AAC (M4A).',
    description: 'Free online AAC converter. Convert WAV, MP3, FLAC and other audio into efficient AAC (.m4a) files in your browser. Choose the bitrate, channels and sample rate, and convert several files at once. No account needed.',
    keywords: ['aac converter', 'convert to aac', 'mp3 to aac', 'wav to aac', 'audio to m4a'],
    icon: AUDIO_ICON, kind: 'audio', accept: 'audio/*', ext: 'm4a', mime: 'audio/mp4', out: 'aac',
    about: 'AAC converter encodes audio into efficient AAC (.m4a) files, the format used by Apple Music, YouTube and modern streaming.',
  },
  {
    slug: 'mov-to-mp4', name: 'MOV to MP4', tagline: 'Convert QuickTime MOV to MP4.',
    description: 'Free online MOV to MP4 converter. Convert Apple QuickTime MOV videos into widely compatible MP4 (H.264) in your browser.',
    keywords: ['mov to mp4', 'convert mov to mp4', 'mov to mp4 converter', 'quicktime to mp4', 'mov to mp4 online'],
    icon: VIDEO_ICON, kind: 'video', accept: 'video/quicktime,.mov,video/*', ext: 'mp4', mime: 'video/mp4', out: 'video', slow: true,
    about: 'MOV to MP4 converter re-encodes Apple QuickTime MOV video into widely compatible MP4 (H.264 + AAC) that plays on any device.',
  },
  {
    slug: 'mkv-to-mp4', name: 'MKV to MP4', tagline: 'Convert MKV video to MP4.',
    description: 'Free online MKV to MP4 converter. Convert Matroska MKV videos into MP4 (H.264) for broad device support, in your browser.',
    keywords: ['mkv to mp4', 'convert mkv to mp4', 'mkv to mp4 converter', 'matroska to mp4', 'mkv to mp4 online'],
    icon: VIDEO_ICON, kind: 'video', accept: '.mkv,video/x-matroska,video/*', ext: 'mp4', mime: 'video/mp4', out: 'video', slow: true,
    about: 'MKV to MP4 converter re-encodes Matroska MKV video into MP4 (H.264 + AAC), which more players, phones and editors accept.',
  },
  {
    slug: 'avi-converter', name: 'AVI to MP4', tagline: 'Convert AVI video to MP4.',
    description: 'Free online AVI to MP4 converter. Convert older AVI videos into modern MP4 (H.264) for smaller files and broad support, in your browser.',
    keywords: ['avi to mp4', 'avi converter', 'convert avi to mp4', 'avi to mp4 converter', 'avi to mp4 online'],
    icon: VIDEO_ICON, kind: 'video', accept: '.avi,video/x-msvideo,video/*', ext: 'mp4', mime: 'video/mp4', out: 'video', slow: true,
    about: 'AVI to MP4 converter re-encodes older AVI video into modern MP4 (H.264 + AAC), producing smaller files with far wider support.',
  },
  {
    slug: 'wmv-converter', name: 'WMV to MP4', tagline: 'Convert WMV video to MP4.',
    description: 'Free online WMV to MP4 converter. Convert Windows Media WMV videos into MP4 (H.264) that plays on phones, Macs and the web, in your browser.',
    keywords: ['wmv to mp4', 'wmv converter', 'convert wmv to mp4', 'wmv to mp4 converter', 'windows media to mp4'],
    icon: VIDEO_ICON, kind: 'video', accept: '.wmv,video/x-ms-wmv,video/*', ext: 'mp4', mime: 'video/mp4', out: 'video', slow: true,
    about: 'WMV to MP4 converter re-encodes Windows Media WMV video into MP4 (H.264 + AAC) so it plays on phones, Macs and the web.',
  },
];

export function getConversion(slug: string): MediaConversion | undefined {
  return MEDIA_CONVERSIONS.find((c) => c.slug === slug);
}
