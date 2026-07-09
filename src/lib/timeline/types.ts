// Timeline data model + date parsing. The whole tool renders from a single
// `Timeline` object; every export derives from the SVG that model produces.
//
// Dates DON'T go through the JS Date object: it can't parse "44 BC" or years
// < 100 reliably. Instead parseDate() pulls year/month/day out with a regex and
// computes a single numeric `sort` key (BC years are negative) that orders every
// event — ancient to modern — with one comparison.

export interface TLDate {
  raw: string;      // exactly what the user typed
  year: number;     // negative = BC/BCE
  month?: number;   // 1-12
  day?: number;     // 1-31
  sort: number;     // single comparable key: year + (month-1)/12 + (day-1)/372
}

export interface TimelineEvent {
  id: string;
  start: TLDate;
  end?: TLDate;         // present => range/period bar; absent => point event
  displayDate?: string; // free-text label overriding the auto-formatted date
  title: string;
  desc?: string;
  group?: string;       // swimlane / category label
  color?: string;       // per-event accent (#hex) overriding the theme accent
  media?: string;       // optional image URL
}

export interface TimelineTheme {
  id: string;
  label: string;
  bg: string;
  spine: string;
  ink: string;
  inkSubtle: string;
  accent: string;
  // Concrete hex only — a standalone exported .svg can't read CSS variables.
}

export type TimelineLayout = 'vertical' | 'horizontal' | 'alternating';

export interface Timeline {
  title: string;
  layout: TimelineLayout;
  themeId: string;
  sizeId: string;
  events: TimelineEvent[];
}

// 372 = 31 * 12, so day fractions can never spill into the next month's slot.
function sortKey(year: number, month?: number, day?: number): number {
  return year + ((month ?? 1) - 1) / 12 + ((day ?? 1) - 1) / 372;
}

// Accepts: "2024", "2024-03", "2024-03-15", "March 2024", "44 BC", "800 BCE",
// "3/15/2024", "2024 Q1" (quarter -> first month of quarter). Returns null when
// there's no year to anchor on.
export function parseDate(raw: string): TLDate | null {
  const s = raw.trim();
  if (!s) return null;

  const bc = /\b(bc|bce)\b/i.test(s);
  const sign = bc ? -1 : 1;

  // Quarter: "2024 Q1" .. "2024 Q4"
  const q = s.match(/(\d{1,4})\s*q\s*([1-4])/i);
  if (q) {
    const year = sign * parseInt(q[1], 10);
    const month = (parseInt(q[2], 10) - 1) * 3 + 1;
    return { raw, year, month, sort: sortKey(year, month) };
  }

  // ISO-ish: YYYY, YYYY-MM, YYYY-MM-DD
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
