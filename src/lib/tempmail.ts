

const BASE = 'https://api.mail.tm';

export interface Domain { domain: string; isActive: boolean; }
export interface Account { id: string; address: string; }
export interface MessageSummary {
  id: string;
  from: { address: string; name: string };
  subject: string;
  intro: string;
  seen: boolean;
  createdAt: string;
}
export interface Message extends MessageSummary {
  text: string;
  html: string[];
}

async function req(path: string, init?: RequestInit): Promise<any> {
  const r = await fetch(BASE + path, init);
  if (!r.ok) throw new Error(`mail.tm ${init?.method || 'GET'} ${path} → ${r.status}`);
  return r.status === 204 ? null : r.json();
}

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
export function randomLocalPart(len = 10): string {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  let s = '';
  for (const b of buf) s += CHARS[b % CHARS.length];
  return /^[a-z]/.test(s) ? s : 'x' + s.slice(1);
}

export function randomPassword(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function activeDomains(): Promise<string[]> {
  const d = await req('/domains');
  return (d['hydra:member'] as Domain[]).filter((x) => x.isActive).map((x) => x.domain);
}

export async function createAccount(address: string, password: string): Promise<Account> {
  return req('/accounts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
}

export async function login(address: string, password: string): Promise<string> {
  const d = await req('/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  return d.token as string;
}

const auth = (token: string) => ({ authorization: `Bearer ${token}` });

export async function listMessages(token: string): Promise<MessageSummary[]> {
  const d = await req('/messages', { headers: auth(token) });
  return d['hydra:member'] as MessageSummary[];
}

export async function getMessage(token: string, id: string): Promise<Message> {
  return req(`/messages/${id}`, { headers: auth(token) });
}

export async function deleteAccount(token: string, id: string): Promise<void> {
  await req(`/accounts/${id}`, { method: 'DELETE', headers: auth(token) });
}

if (typeof process !== 'undefined' && process.argv?.[1]?.includes('tempmail')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  const lp = randomLocalPart();
  assert(/^[a-z][a-z0-9]{9}$/.test(lp), 'local part is 10 lowercase alnum starting with a letter');
  assert(new Set(Array.from({ length: 50 }, () => randomLocalPart())).size > 45, 'local parts vary');
  assert(/^[0-9a-f]{32}$/.test(randomPassword()), 'password is 32 hex chars');
  console.log('tempmail.ts self-check passed');
}
