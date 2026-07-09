// Import/export. Native JSON is our own Timeline shape. TimelineJS is the
// de-facto interchange format (Knight Lab) — its dates are {year,month,day}
// objects (1-based month/day, both optional), so we're lenient on parse.

import type { Timeline, TimelineEvent, TLDate } from './types';
import { formatDate } from './types';

// --- native JSON ------------------------------------------------------------
export function toJSON(tl: Timeline): string {
  return JSON.stringify(tl, null, 2);
}

export function fromJSON(str: string): Timeline {
  const o = JSON.parse(str);
  if (!o || !Array.isArray(o.events)) throw new Error('Not a timeline file');
  return {
    title: String(o.title ?? 'Timeline'),
    layout: o.layout ?? 'vertical',
    themeId: o.themeId ?? 'linear-dark',
    sizeId: o.sizeId ?? 'landscape',
    events: o.events.map((e: any, i: number) => normalizeEvent(e, i)),
  };
}

function normalizeEvent(e: any, i: number): TimelineEvent {
  if (!e.start || typeof e.start.sort !== 'number') throw new Error('Bad event date');
  return {
    id: e.id || `e${i}`,
    start: e.start, end: e.end,
    displayDate: e.displayDate, title: String(e.title ?? ''),
    desc: e.desc, group: e.group, color: e.color, media: e.media,
  };
}

// --- TimelineJS -------------------------------------------------------------
function sortKey(year: number, month?: number, day?: number): number {
  return year + ((month ?? 1) - 1) / 12 + ((day ?? 1) - 1) / 372;
}

function fromParts(p: any): TLDate | undefined {
  if (!p || p.year === undefined || p.year === null) return undefined;
  const year = Number(p.year);
  const month = p.month != null ? Number(p.month) : undefined;
  const day = p.day != null ? Number(p.day) : undefined;
  return { raw: String(year), year, month, day, sort: sortKey(year, month, day) };
}

function toParts(d: TLDate): any {
  const p: any = { year: d.year };
  if (d.month) p.month = d.month;
  if (d.day) p.day = d.day;
  return p;
}

export function toTimelineJS(tl: Timeline): object {
  return {
    title: { text: { headline: tl.title } },
    events: tl.events.map((e) => ({
      start_date: toParts(e.start),
      ...(e.end ? { end_date: toParts(e.end) } : {}),
      text: { headline: e.title, text: e.desc || '' },
      ...(e.displayDate ? { display_date: e.displayDate } : {}),
      ...(e.group ? { group: e.group } : {}),
      ...(e.media ? { media: { url: e.media } } : {}),
    })),
  };
}

export function fromTimelineJS(json: any): Timeline {
  const o = typeof json === 'string' ? JSON.parse(json) : json;
  const events: TimelineEvent[] = (o.events || [])
    .map((e: any, i: number): TimelineEvent | null => {
      const start = fromParts(e.start_date);
      if (!start) return null;
      return {
        id: `tj${i}`,
        start,
        end: fromParts(e.end_date),
        displayDate: e.display_date,
        title: e.text?.headline || e.text?.text || 'Event',
        desc: e.text?.text && e.text?.headline ? stripHtml(e.text.text) : undefined,
        group: e.group,
        media: e.media?.url,
      };
    })
    .filter(Boolean) as TimelineEvent[];

  return {
    title: o.title?.text?.headline || 'Imported timeline',
    layout: 'vertical', themeId: 'linear-dark', sizeId: 'landscape',
    events,
  };
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim();
}
