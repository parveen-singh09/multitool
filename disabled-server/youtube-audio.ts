// YouTube audio proxy — DISABLED / NOT WIRED IN.
//
// This file is intentionally kept OUTSIDE src/pages so the site can build as a
// pure static export. To enable it:
//   1. Move it back to src/pages/api/youtube-audio.ts
//   2. Add a SERVER adapter that provides a real Node runtime — use
//      @astrojs/node on a VPS/container (Render, Railway, Fly, a Docker host).
//      NOT Cloudflare Workers: @distube/ytdl-core needs Node's undici/streams,
//      which V8 isolates don't provide, and YouTube blocks Worker egress IPs.
//   3. Re-add the YouTube URL input + handler to music-analyzer.astro.
//
// IMPORTANT LIMITATIONS (were true when this was live):
//  - @distube/ytdl-core tracks YouTube's frequently changing internals and can
//    break without notice.
//  - YouTube blocks many datacenter/serverless IPs with a bot check, so this
//    can fail in production even when the code is correct.
//  - Server-side downloading may conflict with YouTube's Terms of Service.
// Provided as an opt-in convenience for a self-hosted Node deploy, not a
// guaranteed feature.

import type { APIRoute } from 'astro';
import ytdl from '@distube/ytdl-core';

// This route must run on the server (Worker), not be prerendered.
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

  // SSRF guard: only accept genuine YouTube URLs / 11-char video IDs. This
  // endpoint must never be usable as an open proxy to arbitrary hosts.
  let videoUrl: string;
  if (ytdl.validateID(input)) {
    videoUrl = `https://www.youtube.com/watch?v=${input}`;
  } else if (ytdl.validateURL(input)) {
    videoUrl = input;
  } else {
    return json(400, { error: 'That is not a valid YouTube URL or video ID.' });
  }

  try {
    // Resolve deciphered formats with ytdl, then stream the chosen audio URL
    // via the Worker's native fetch — avoids relying on ytdl's Node-stream
    // downloader working inside a V8 isolate.
    const info = await ytdl.getInfo(videoUrl);
    const durationSec = Number(info.videoDetails.lengthSeconds || 0);
    // Guard against absurdly long inputs (livestreams, hours-long uploads).
    if (durationSec > 20 * 60) {
      return json(413, { error: 'Track is longer than 20 minutes; download it and upload the file instead.' });
    }

    const format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio', filter: 'audioonly' });
    if (!format?.url) return json(502, { error: 'No audio-only stream is available for this video.' });

    // Use ytdl's own downloader rather than fetching format.url by hand: it
    // applies the `n`-parameter transform, range requests and client headers
    // internally, which is what googlevideo requires (a raw fetch 403s). Returns
    // a Node Readable, which we adapt to a web stream for the Response.
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
    // YouTube's bot check is the most common real-world failure.
    const botBlocked = /confirm|bot|sign in|429|status code: 4/i.test(msg);
    return json(botBlocked ? 429 : 500, {
      error: botBlocked
        ? 'YouTube blocked this server request (bot check). Download the audio and upload the file instead.'
        : `Could not fetch that video: ${msg}`,
    });
  }
};
