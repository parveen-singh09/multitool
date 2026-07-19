
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
