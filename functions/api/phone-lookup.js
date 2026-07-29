
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // Only cache successes — a cached 503 pins the "lookup not configured"
      // error at the edge for a day after the key is finally set.
      'cache-control': status === 200 ? 'public, max-age=86400' : 'no-store',
    },
  });

export async function onRequestGet({ request, env }) {
  const number = new URL(request.url).searchParams.get('number') || '';
  if (!/^\+?[0-9]{6,16}$/.test(number)) return json({ error: 'invalid number' }, 400);

  const key = env.NUMVERIFY_API_KEY;
  if (!key) return json({ error: 'lookup not configured' }, 503);

  try {
    const api = `https://apilayer.net/api/validate?access_key=${key}&number=${encodeURIComponent(number)}`;
    const d = await (await fetch(api)).json();
    if (d && d.success === false) return json({ error: 'lookup failed' }, 502);
    return json({
      carrier: d.carrier || '',
      line_type: d.line_type || '',
      location: d.location || '',
    });
  } catch {
    return json({ error: 'lookup failed' }, 502);
  }
}
