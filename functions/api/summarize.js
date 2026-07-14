// Cloudflare Pages Function: POST /api/summarize
// Proxies Google's Gemini API. The browser extracts the PDF's text locally and
// sends ONLY that text here — the file itself is never uploaded. This is the
// one tool that leaves the no-upload model (documented in privacy.astro's
// live-data carve-out).
//
// Uses PUBLIC_AI_API_KEY (same Gemini key as the client-side AI tools). Note
// this key is NOT secret — it also ships in the client bundle — so the proxy
// bounds cost (MAX_CHARS below) but does not hide the key.
//
// ponytail: no per-IP rate limiting — Workers can't do it without KV/Durable
// Objects. Input is hard-capped below, but this endpoint is unauthenticated
// and, with a public key upstream, abusable at volume. Add a Cloudflare rate-
// limiting rule (dashboard → Security → Rate limiting) on /api/summarize
// before this sees real traffic — that's the right layer, not app code.

// ~100k chars ≈ 25k tokens — a long report, but bounded so one request can't
// run up an unbounded bill. The client truncates to match and warns the user.
const MAX_CHARS = 100_000;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export async function onRequestPost({ request, env }) {
  const key = env.PUBLIC_AI_API_KEY;
  if (!key) return json({ error: 'summarizer not configured' }, 503);
  const model = env.PUBLIC_AI_MODEL || 'gemini-flash-latest';

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid request' }, 400);
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) return json({ error: 'no text provided' }, 400);
  if (text.length > MAX_CHARS) {
    return json({ error: `text too long (max ${MAX_CHARS} characters)` }, 413);
  }

  // Length preset maps to a short target so summaries stay tight and cheap.
  const length = body.length === 'short' || body.length === 'detailed' ? body.length : 'medium';
  const targets = {
    short: 'in 2-3 sentences',
    medium: 'in one concise paragraph',
    detailed: 'as 5-8 bullet points covering the key sections',
  };

  const prompt =
    `Summarize the following document ${targets[length]}. ` +
    `Be faithful to the source; do not add information that isn't in the text. ` +
    `Reply with only the summary, no preamble.\n\n<document>\n${text}\n</document>`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2000 },
        }),
      },
    );

    if (!res.ok) return json({ error: 'summarizer upstream error' }, 502);
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const summary = Array.isArray(parts)
      ? parts.map((p) => p.text ?? '').join('').trim()
      : '';
    if (!summary) return json({ error: 'no summary produced' }, 502);
    return json({ summary });
  } catch {
    return json({ error: 'summarizer failed' }, 502);
  }
}
