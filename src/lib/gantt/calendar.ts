

import type { Calendar } from './types';

export const DEFAULT_CALENDAR: Calendar = {
  workdays: [false, true, true, true, true, true, false],
  holidays: [],
};

const DAY = 86400000;

function ts(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1);
}

function iso(t: number): string {
  const d = new Date(t);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isWorkingDay(isoDate: string, cal: Calendar): boolean {
  const dow = new Date(ts(isoDate)).getUTCDay(); 
  return cal.workdays[dow] && !cal.holidays.includes(isoDate);
}

function snapForward(isoDate: string, cal: Calendar): string {
  let t = ts(isoDate);
  for (let i = 0; i < 3660; i++) {
    if (isWorkingDay(iso(t), cal)) return iso(t);
    t += DAY;
  }
  return iso(t);
}

export function addWorkingDays(isoDate: string, n: number, cal: Calendar): string {
  let cur = snapForward(isoDate, cal);
  const step = n >= 0 ? DAY : -DAY;
  let remaining = Math.abs(n);
  let t = ts(cur);
  while (remaining > 0) {
    t += step;
    if (isWorkingDay(iso(t), cal)) remaining--;
  }
  return iso(t);
}

export function workingDaysBetween(aIso: string, bIso: string, cal: Calendar): number {
  let a = ts(snapForward(aIso, cal));
  const b = ts(snapForward(bIso, cal));
  if (a === b) return 0;
  const dir = b > a ? 1 : -1;
  let count = 0;
  while (a !== b) {
    a += dir * DAY;
    if (isWorkingDay(iso(a), cal)) count += dir;
  }
  return count;
}

export function toIndex(isoDate: string, epoch: string, cal: Calendar): number {
  return workingDaysBetween(epoch, isoDate, cal);
}

export function fromIndex(index: number, epoch: string, cal: Calendar): string {
  return addWorkingDays(epoch, index, cal);
}

export function finishOf(startIso: string, duration: number, cal: Calendar): string {
  return duration <= 0 ? snapForward(startIso, cal) : addWorkingDays(startIso, duration - 1, cal);
}

export { iso as isoOf, ts as tsOf, snapForward };

declare const process: any;
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('calendar.ts')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  const C = DEFAULT_CALENDAR;

  assert(addWorkingDays('2026-01-02', 1, C) === '2026-01-05', 'Fri +1 wd -> Mon');
  assert(workingDaysBetween('2026-01-05', '2026-01-09', C) === 4, 'Mon->Fri = 4');
  assert(addWorkingDays('2026-01-05', 0, C) === '2026-01-05', '+0 stays on a working day');
  assert(snapForward('2026-01-03', C) === '2026-01-05', 'Sat snaps to Mon');

  const H: Calendar = { workdays: C.workdays, holidays: ['2026-01-05'] };
  assert(addWorkingDays('2026-01-02', 1, H) === '2026-01-06', 'holiday is skipped');

  const idx = toIndex('2026-01-09', '2026-01-05', C);
  assert(idx === 4, 'index of Fri from Mon epoch is 4');
  assert(fromIndex(idx, '2026-01-05', C) === '2026-01-09', 'index round-trips');

  assert(finishOf('2026-01-05', 5, C) === '2026-01-09', '5wd from Mon finishes Fri (inclusive)');
  assert(finishOf('2026-01-05', 1, C) === '2026-01-05', '1wd finishes same day');
  assert(finishOf('2026-01-05', 0, C) === '2026-01-05', 'milestone finishes on start');

  console.log('calendar.ts self-check passed');
}
