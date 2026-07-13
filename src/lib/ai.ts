

const KEY = (import.meta.env.PUBLIC_AI_API_KEY as string | undefined) ?? '';

const MODEL = (import.meta.env.PUBLIC_AI_MODEL as string | undefined) || 'gemini-flash-latest';

export const hasAI = KEY.length > 0;

export interface ChatMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function toRequestBody(messages: ChatMsg[], temperature?: number): Record<string, unknown> {
  const sys = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const body: Record<string, unknown> = { contents };
  if (sys) body.system_instruction = { parts: [{ text: sys }] };
  if (temperature != null) body.generationConfig = { temperature };
  return body;
}

export async function aiChat(messages: ChatMsg[], opts: { temperature?: number } = {}): Promise<string> {
  if (!hasAI) throw new Error('no api key');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(KEY)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(toRequestBody(messages, opts.temperature)),
    },
  );
  if (!res.ok) throw new Error(`ai ${res.status}`);
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text: string = Array.isArray(parts) ? parts.map((p: { text?: string }) => p.text ?? '').join('') : '';
  if (!text) throw new Error('empty reply');
  return text;
}

// ponytail self-check: dev-only, covers the one non-trivial bit (role mapping
// + system folding). Runs once when the first tool imports this in dev.
if (import.meta.env.DEV) {
  const b = toRequestBody(
    [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'yo' },
    ],
    0.5,
  ) as { contents: { role: string }[]; system_instruction?: { parts: { text: string }[] }; generationConfig?: { temperature: number } };
  console.assert(b.system_instruction?.parts[0].text === 'sys', 'system should fold into system_instruction');
  console.assert(b.contents.length === 2 && b.contents[0].role === 'user' && b.contents[1].role === 'model', 'assistant should map to model, system dropped from contents');
  console.assert(b.generationConfig?.temperature === 0.5, 'temperature should pass through');
}
