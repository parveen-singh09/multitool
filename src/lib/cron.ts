// Shared 5-field cron engine: parse a field to its value set, describe an
// expression in plain English, and compute the next N run times. Used by both
// the cron parser and the cron generator so the schedule logic lives once.

export interface FieldSpec { min: number; max: number; name: string; }

export const SPECS: FieldSpec[] = [
  { min: 0, max: 59, name: 'minute' },
  { min: 0, max: 23, name: 'hour' },
  { min: 1, max: 31, name: 'day of month' },
  { min: 1, max: 12, name: 'month' },
  { min: 0, max: 6, name: 'day of week' },
];

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_ALIAS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const DOW_ALIAS: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

function aliasValue(token: string, fieldIndex: number): number | null {
  const t = token.toLowerCase();
  if (fieldIndex === 3 && t in MONTH_ALIAS) return MONTH_ALIAS[t];
  if (fieldIndex === 4 && t in DOW_ALIAS) return DOW_ALIAS[t];
  if (/^\d+$/.test(token)) return parseInt(token, 10);
  return null;
}

// Parse one field into a sorted set of allowed numbers. Throws on error.
export function parseField(field: string, index: number): Set<number> {
  const { min, max, name } = SPECS[index];
  const out = new Set<number>();

  for (const part of field.split(',')) {
    if (part === '') throw new Error(`Empty value in ${name} field.`);
    let range = part;
    let step = 1;
    const slash = part.split('/');
    if (slash.length === 2) {
      range = slash[0];
      step = parseInt(slash[1], 10);
      if (!Number.isInteger(step) || step < 1) throw new Error(`Invalid step "/${slash[1]}" in ${name} field.`);
    } else if (slash.length > 2) {
      throw new Error(`Invalid step syntax in ${name} field.`);
    }

    let lo: number, hi: number;
    if (range === '*') {
      lo = min; hi = max;
    } else if (range.includes('-')) {
      const [a, b] = range.split('-');
      const av = aliasValue(a, index); const bv = aliasValue(b, index);
      if (av === null || bv === null) throw new Error(`Invalid range "${range}" in ${name} field.`);
      lo = av; hi = bv;
    } else {
      const v = aliasValue(range, index);
      if (v === null) throw new Error(`Invalid value "${range}" in ${name} field.`);
      lo = v; hi = slash.length === 2 ? max : v; // "n/step" means from n to max
    }

    // Day-of-week 7 == Sunday (0).
    if (index === 4) { if (lo === 7) lo = 0; if (hi === 7) hi = 0; }

    if (lo < min || lo > max || hi < min || hi > max) {
      throw new Error(`${name} value out of range (${min}-${max}).`);
    }
    if (lo > hi) throw new Error(`Range start greater than end in ${name} field.`);
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return out;
}

export function describe(fields: string[]): string {
  const [minF, hourF, domF, monF, dowF] = fields;

  if (fields.join(' ') === '* * * * *') return 'Every minute';

  const parts: string[] = [];
  const minVals = [...parseField(minF, 0)].sort((a, b) => a - b);
  const hourVals = [...parseField(hourF, 1)].sort((a, b) => a - b);
  const minStep = minF.match(/^\*\/(\d+)$/);
  const hourStep = hourF.match(/^\*\/(\d+)$/);

  // Time-of-day phrase.
  if (minF === '*' && hourF === '*') {
    parts.push('Every minute');
  } else if (minStep && hourF === '*') {
    parts.push(`Every ${minStep[1]} minutes`);
  } else if (minVals.length === 1 && hourVals.length === 1 && !hourStep && !minStep) {
    const hh = String(hourVals[0]).padStart(2, '0');
    const mm = String(minVals[0]).padStart(2, '0');
    parts.push(`At ${hh}:${mm}`);
  } else if (minVals.length === 1 && hourF === '*') {
    parts.push(`At minute ${minVals[0]} of every hour`);
  } else {
    const minPhrase = minF === '*' ? 'every minute' : minStep ? `every ${minStep[1]} minutes` : `minute ${minVals.join(', ')}`;
    const hourPhrase = hourF === '*' ? 'every hour' : hourStep ? `every ${hourStep[1]} hours` : `hour ${hourVals.join(', ')}`;
    parts.push(`At ${minPhrase} past ${hourPhrase}`);
  }

  // Day-of-month.
  if (domF !== '*') {
    const domVals = [...parseField(domF, 2)].sort((a, b) => a - b);
    const domStep = domF.match(/^\*\/(\d+)$/);
    parts.push(domStep ? `every ${domStep[1]} days of the month` : `on day ${domVals.join(', ')} of the month`);
  }

  // Month.
  if (monF !== '*') {
    const monVals = [...parseField(monF, 3)].sort((a, b) => a - b);
    parts.push('in ' + monVals.map((m) => MONTHS[m - 1]).join(', '));
  }

  // Day-of-week.
  if (dowF !== '*') {
    const dowVals = [...parseField(dowF, 4)].sort((a, b) => a - b);
    parts.push('on ' + dowVals.map((d) => DOW[d]).join(', '));
  }

  const sentence = parts.join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function matches(date: Date, sets: Set<number>[]): boolean {
  const [minS, hourS, domS, monS, dowS] = sets;
  if (!minS.has(date.getMinutes())) return false;
  if (!hourS.has(date.getHours())) return false;
  if (!monS.has(date.getMonth() + 1)) return false;

  const domRestricted = domS.size !== 31;
  const dowRestricted = dowS.size !== 7;
  const domOk = domS.has(date.getDate());
  const dowOk = dowS.has(date.getDay());

  // Standard cron: if both DOM and DOW are restricted, either match counts.
  if (domRestricted && dowRestricted) return domOk || dowOk;
  if (domRestricted) return domOk;
  if (dowRestricted) return dowOk;
  return true;
}

// Compute next `count` run times from now. Returns [] if none within the bound.
export function nextRuns(fields: string[], count: number): Date[] {
  const sets = fields.map((f, i) => parseField(f, i));
  const runs: Date[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const limit = 366 * 4 * 24 * 60; // ~4 years of minutes, safety bound.
  for (let i = 0; i < limit && runs.length < count; i++) {
    if (matches(d, sets)) runs.push(new Date(d));
    d.setMinutes(d.getMinutes() + 1);
  }
  return runs;
}

export function fmtDate(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
