// Cloudflare Pages Function: /api/phone-lookup?number=+14158586273
// Proxies Numverify server-side so the API key stays secret and the HTTP-only
// free-tier endpoint isn't blocked as mixed content on the HTTPS site.
// Set NUMVERIFY_API_KEY in the Cloudflare Pages project env vars.

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=86400' },
  });

export async function onRequestGet({ request, env }) {
  const number = new URL(request.url).searchParams.get('number') || '';
  // Trust boundary: only digits with an optional leading +, sane length.
  if (!/^\+?[0-9]{6,16}$/.test(number)) return json({ error: 'invalid number' }, 400);

  const key = env.NUMVERIFY_API_KEY;
  if (!key) return json({ error: 'lookup not configured' }, 503);

  try {
    const api = `http://apilayer.net/api/validate?access_key=${key}&number=${encodeURIComponent(number)}`;
    const d = await (await fetch(api)).json();
    if (d && d.success === false) return json({ error: 'lookup failed' }, 502);
    // Return only what the UI shows — don't leak the full upstream payload.
    return json({
      carrier: d.carrier || '',
      line_type: d.line_type || '',
      location: d.location || '',
    });
  } catch {
    return json({ error: 'lookup failed' }, 502);
  }
}
