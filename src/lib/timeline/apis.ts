

import type { TimelineEvent } from './types';
import { parseDate } from './types';

const MAX = 30; 

function ev(date: string, title: string, desc?: string, media?: string): TimelineEvent {
  return {
    id: `api${Math.random().toString(36).slice(2, 9)}`,
    start: parseDate(date)!, displayDate: date, title, desc, media,
  };
}

export async function onThisDay(month: number, day: number, lang = 'en'): Promise<TimelineEvent[]> {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/${lang}/onthisday/events/${mm}/${dd}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const data = await res.json();
    const items: any[] = Array.isArray(data.events) ? data.events : [];
    return items
      .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
      .slice(0, MAX)
      .map((it) => {
        const page = it.pages?.[0];
        return ev(String(it.year), it.text ?? 'Event', undefined, page?.thumbnail?.source);
      })
      .filter((e) => e.start); 
  } catch {
    return [];
  }
}

export async function holidays(countryCode: string, year: number): Promise<TimelineEvent[]> {
  const cc = countryCode.trim().toUpperCase();
  const url = `https://date.nager.at/api/v4/Holidays/${year}/${cc}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const items: any[] = await res.json();
    if (!Array.isArray(items)) return [];
    return items.slice(0, MAX).map((h) => ev(h.date, h.localName || h.name, h.name !== h.localName ? h.name : undefined));
  } catch {
    return [];
  }
}
