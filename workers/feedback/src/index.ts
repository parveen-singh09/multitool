/// <reference types="@cloudflare/workers-types" />
import { EmailMessage } from 'cloudflare:email';

interface Env {
  FEEDBACK_EMAIL: { send(msg: EmailMessage): Promise<void> };
  FEEDBACK_TO?: string;
  FEEDBACK_FROM?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    let body: { type?: string; tool?: string; message?: string; from?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const type = (body.type || 'Feedback').toString().slice(0, 100);
    const tool = (body.tool || '').toString().slice(0, 200);
    const message = (body.message || '').toString().trim().slice(0, 5000);
    const from = (body.from || '').toString().slice(0, 200);

    if (!message) return json({ error: 'Message is required' }, 400);
    if (!env.FEEDBACK_EMAIL) return json({ error: 'Email not configured' }, 500);

    const to = env.FEEDBACK_TO || 'hello@toolsilk.com';
    const sender = env.FEEDBACK_FROM || 'feedback@toolsilk.com';
    const subject = tool ? `${type}: ${tool}` : type;
    const text = [`Type: ${type}`, tool && `Tool: ${tool}`, from && `From: ${from}`, '', message]
      .filter((l) => l)
      .join('\r\n');

    const clean = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();
    const headers = [
      `From: ToolSilk Feedback <${sender}>`,
      `To: <${to}>`,
      from && `Reply-To: <${clean(from)}>`,
      `Subject: ${clean(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
    ].filter(Boolean);
    const raw = headers.join('\r\n') + '\r\n\r\n' + text;

    try {
      await env.FEEDBACK_EMAIL.send(new EmailMessage(sender, to, raw));
    } catch {
      return json({ error: 'Failed to send' }, 502);
    }
    return json({ ok: true });
  },
};
