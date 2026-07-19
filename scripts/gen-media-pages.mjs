import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = resolve(__dirname, '../src/pages/tools');

const items = [
  ['mp4-to-mp3', 'MP4 to MP3 converter extracts the audio track from an MP4 (or other) video and saves it as an MP3 you can play anywhere.'],
  ['wav-to-mp3', 'WAV to MP3 converter compresses large uncompressed WAV files into small MP3s, saving space while keeping good quality.'],
  ['mp3-to-wav', 'MP3 to WAV converter decodes compressed MP3 audio into an uncompressed WAV (PCM) file, handy for audio editing software.'],
  ['flac-to-mp3', 'FLAC to MP3 converter turns lossless FLAC audio into compact MP3 files that play on virtually any device or player.'],
  ['m4a-to-mp3', 'M4A to MP3 converter turns Apple M4A and AAC audio — including voice memos — into MP3 files that work everywhere.'],
  ['ogg-converter', 'OGG converter turns MP3, WAV, M4A and other audio into the free, open OGG Vorbis format used by games and open-source software.'],
  ['aac-converter', 'AAC converter encodes audio into efficient AAC (.m4a) files, the format used by Apple Music, YouTube and modern streaming.'],
  ['mov-to-mp4', 'MOV to MP4 converter re-encodes Apple QuickTime MOV video into widely compatible MP4 (H.264 + AAC) that plays on any device.'],
  ['mkv-to-mp4', 'MKV to MP4 converter re-encodes Matroska MKV video into MP4 (H.264 + AAC), which more players, phones and editors accept.'],
  ['avi-converter', 'AVI to MP4 converter re-encodes older AVI video into modern MP4 (H.264 + AAC), producing smaller files with far wider support.'],
  ['wmv-converter', 'WMV to MP4 converter re-encodes Windows Media WMV video into MP4 (H.264 + AAC) so it plays on phones, Macs and the web.'],
];

for (const [slug, about] of items) {
  const page = `---
import ToolLayout from '../../layouts/ToolLayout.astro';
import MediaConverter from '../../components/MediaConverter.astro';
---

<ToolLayout slug="${slug}">
  <MediaConverter slug="${slug}" />

  <div slot="about" class="flex flex-col gap-4 text-[15px] leading-relaxed text-ink-subtle">
    <p>
      This free ${about} All processing happens locally in your browser using an
      in-page media engine, so your files are never uploaded to any server.
    </p>
  </div>
</ToolLayout>
`;
  writeFileSync(resolve(pagesDir, `${slug}.astro`), page);
  console.log('wrote', `${slug}.astro`);
}
