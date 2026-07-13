

export interface TLDate {
  raw: string;      
  year: number;     
  month?: number;   
  day?: number;     
  sort: number;     
}

export interface TimelineEvent {
  id: string;
  start: TLDate;
  end?: TLDate;         
  displayDate?: string; 
  title: string;
  desc?: string;
  group?: string;       
  color?: string;       
  media?: string;       
}

export interface TimelineTheme {
  id: string;
  label: string;
  bg: string;
  spine: string;
  ink: string;
  inkSubtle: string;
  accent: string;

}

export type TimelineLayout = 'vertical' | 'horizontal' | 'alternating';

export interface Timeline {
  title: string;
  layout: TimelineLayout;
  themeId: string;
  sizeId: string;
  events: TimelineEvent[];
}

function sortKey(year: number, month?: number, day?: number): number {
  return year + ((month ?? 1) - 1) / 12 + ((day ?? 1) - 1) / 372;
}

export function parseDate(raw: string): TLDate | null {
  const s = raw.trim();
  if (!s) return null;

  const bc = /\b(bc|bce)\b/i.test(s);
  const sign = bc ? -1 : 1;

  const q = s.match(/(\d{1,4})\s*q\s*([1-4])/i);
  if (q) {
    const year = sign * parseInt(q[1], 10);
    const month = (parseInt(q[2], 10) - 1) * 3 + 1;
    return { raw, year, month, sort: sortKey(year, month) };
  }

  const iso = s.match(/^(\d{1,6})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
  const monthName = MONTHS.findIndex((m) => new RegExp(`\\b${m}`, 'i').test(s));

  if (iso && !bc && (iso[2] || !monthName || monthName < 0)) {
    const year = parseInt(iso[1], 10);
    const month = iso[2] ? parseInt(iso[2], 10) : undefined;
    const day = iso[3] ? parseInt(iso[3], 10) : undefined;
    // A bare 1-2 digit number with no separators is likelier a day/quarter typo
    // than a year, but we still treat it as a year — the user anchored on it.
    return { raw, year, month, day, sort: sortKey(year, month, day) };
  }

  // "March 2024" / "15 March 2024" / "March 15, 2024"
  if (monthName >= 0) {
    const yearM = s.match(/(\d{1,6})/g);
    const year = sign * parseInt(yearM?.[yearM.length - 1] ?? '0', 10);
    const dayM = s.match(/\b(\d{1,2})\b(?!.*\d)/); // a small number = day (rough)
    const month = monthName + 1;
    const day = dayM && parseInt(dayM[1], 10) <= 31 && parseInt(dayM[1], 10) !== Math.abs(year)
      ? parseInt(dayM[1], 10) : undefined;
    if (year) return { raw, year, month, day, sort: sortKey(year, month, day) };
  }

  // US "M/D/YYYY" or "D/M/YYYY" — assume M/D/Y
  const slash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})/);
  if (slash) {
    const year = sign * parseInt(slash[3], 10);
    return {
      raw, year, month: parseInt(slash[1], 10), day: parseInt(slash[2], 10),
      sort: sortKey(year, parseInt(slash[1], 10), parseInt(slash[2], 10)),
    };
  }

  // Last resort: any number is the year.
  const anyNum = s.match(/(\d{1,6})/);
  if (anyNum) {
    const year = sign * parseInt(anyNum[1], 10);
    return { raw, year, sort: sortKey(year) };
  }
  return null;
}

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Human label for a parsed date, used when the event has no displayDate.
export function formatDate(d: TLDate): string {
  const era = d.year < 0 ? ' BC' : '';
  const y = Math.abs(d.year);
  if (d.month && d.day) return `${MONTHS_FULL[d.month - 1]} ${d.day}, ${y}${era}`;
  if (d.month) return `${MONTHS_FULL[d.month - 1]} ${y}${era}`;
  return `${y}${era}`;
}

// ---------------------------------------------------------------------------
// ponytail: one self-check on the only non-trivial logic — the BC-aware sort.
// Run with:  npx tsx src/lib/timeline/types.ts
// Guard is a no-op in the browser (process is undefined there), so this never
// runs in the Astro bundle — only under tsx/node when this file is the entry.
// ---------------------------------------------------------------------------
declare const process: any;
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('types.ts')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  const p = (s: string) => parseDate(s)!;
  assert(p('44 BC').sort < p('1 AD').sort, 'BC sorts before AD');
  assert(p('44 BC').year === -44, 'BC year is negative');
  assert(p('800 BCE').sort < p('44 BC').sort, 'older BC sorts first');
  assert(p('2024-01').sort < p('2024-12').sort, 'earlier month first');
  assert(p('2024-03-01').sort < p('2024-03-15').sort, 'earlier day first');
  assert(p('2024 Q1').sort < p('2024 Q4').sort, 'earlier quarter first');
  assert(p('March 2024').month === 3, 'month name parsed');
  assert(parseDate('') === null, 'empty is null');
  assert(p('1969-07-20').day === 20, 'ISO day parsed');
  console.log('types.ts self-check passed');
}
