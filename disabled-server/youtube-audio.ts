
import type { APIRoute } from 'astro';
import ytdl from '@distube/ytdl-core';

export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS });

export const GET: APIRoute = async ({ url }) => {
  const input = url.searchParams.get('url') || url.searchParams.get('v') || '';
  if (!input) return json(400, { error: 'Provide a YouTube ?url= or ?v= parameter.' });

  let videoUrl: string;
  if (ytdl.validateID(input)) {
    videoUrl = `https://www.youtube.com/watch?v=${input}`;
  } else if (ytdl.validateURL(input)) {
    videoUrl = input;
  } else {
    return json(400, { error: 'That is not a valid YouTube URL or video ID.' });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const durationSec = Number(info.videoDetails.lengthSeconds || 0);
    if (durationSec > 20 * 60) {
      return json(413, { error: 'Track is longer than 20 minutes; download it and upload the file instead.' });
    }

    const format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio', filter: 'audioonly' });
    if (!format?.url) return json(502, { error: 'No audio-only stream is available for this video.' });

    const nodeStream = ytdl.downloadFromInfo(info, { quality: 'lowestaudio', filter: 'audioonly' });
    const { Readable } = await import('node:stream');
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    const safeTitle = (info.videoDetails.title || 'youtube-audio').replace(/[^\w.-]+/g, '_').slice(0, 80);
    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': format.mimeType?.split(';')[0] || 'audio/webm',
        'Content-Disposition': `inline; filename="${safeTitle}"`,
        'Cache-Control': 'no-store',
        'X-Audio-Title': encodeURIComponent(info.videoDetails.title || ''),
        'X-Audio-Duration': String(durationSec),
        ...CORS,
      },
    });
  } catch (e) {
    const msg = (e as Error).message || 'Unknown error';
    const botBlocked = /confirm|bot|sign in|429|status code: 4/i.test(msg);
    return json(botBlocked ? 429 : 500, {
      error: botBlocked
        ? 'YouTube blocked this server request (bot check). Download the audio and upload the file instead.'
        : `Could not fetch that video: ${msg}`,
    });
  }
};
