// Working-time calendar math. Durations are in WORKING days, so every date
// calculation has to skip weekends (and any holidays). The scheduler works in
// integer working-day indices; this module is the only place that converts
// between an ISO date and its working-day index.
//
// Convention (nailed here because render, interop and the scheduler all depend
// on it): a task of duration D >= 1 starting on working day S finishes on the
// LAST working day inclusive, i.e. finish = addWorkingDays(start, D - 1). A
// milestone (D = 0) finishes on its start.

import type { Calendar } from './types';

// Sun..Sat, Mon–Fri working. index 0 = Sunday.
export const DEFAULT_CALENDAR: Calendar = {
  workdays: [false, true, true, true, true, true, false],
  holidays: [],
};

const DAY = 86400000;

// Parse an ISO YYYY-MM-DD as a UTC midnight timestamp (UTC avoids DST shifts
// that could nudge a date across midnight).
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
  const dow = new Date(ts(isoDate)).getUTCDay(); // 0=Sun
  return cal.workdays[dow] && !cal.holidays.includes(isoDate);
}

// Next working day on or after the given date.
function snapForward(isoDate: string, cal: Calendar): string {
  let t = ts(isoDate);
  // Guard against an all-false calendar so this can't loop forever.
  for (let i = 0; i < 3660; i++) {
    if (isWorkingDay(iso(t), cal)) return iso(t);
    t += DAY;
  }
  return iso(t);
}

// Add n working days to a date (n may be negative). Result lands on a working
// day. addWorkingDays(x, 0) snaps x forward to the next working day.
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

// Count of working days in [aIso, bIso) — i.e. how many working steps from a to
// b. workingDaysBetween(Mon, Fri) = 4 on a Mon–Fri calendar.
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

// Working-day index of a date relative to an epoch (the project start). The
// epoch itself is index 0. Used by the scheduler; render uses it for the axis.
export function toIndex(isoDate: string, epoch: string, cal: Calendar): number {
  return workingDaysBetween(epoch, isoDate, cal);
}

export function fromIndex(index: number, epoch: string, cal: Calendar): string {
  return addWorkingDays(epoch, index, cal);
}

// Finish date of a task given start + working-day duration.
export function finishOf(startIso: string, duration: number, cal: Calendar): string {
  return duration <= 0 ? snapForward(startIso, cal) : addWorkingDays(startIso, duration - 1, cal);
}

export { iso as isoOf, ts as tsOf, snapForward };

// ---------------------------------------------------------------------------
// ponytail: self-check on the working-day math — the load-bearing logic every
// other file trusts. Run:  npx tsx src/lib/gantt/calendar.ts
// ---------------------------------------------------------------------------
declare const process: any;
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('calendar.ts')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  const C = DEFAULT_CALENDAR;

  // 2026-01-02 is a Friday. +1 working day skips Sat/Sun -> Mon 2026-01-05.
  assert(addWorkingDays('2026-01-02', 1, C) === '2026-01-05', 'Fri +1 wd -> Mon');
  // Mon 01-05 .. Fri 01-09 is 4 working steps.
  assert(workingDaysBetween('2026-01-05', '2026-01-09', C) === 4, 'Mon->Fri = 4');
  // addWorkingDays 0 snaps forward to the same working day.
  assert(addWorkingDays('2026-01-05', 0, C) === '2026-01-05', '+0 stays on a working day');
  // Weekend snaps forward: Sat 01-03 snapped is Mon 01-05.
  assert(snapForward('2026-01-03', C) === '2026-01-05', 'Sat snaps to Mon');

  // Holiday skip: make Mon 01-05 a holiday; Fri +1 wd should land Tue 01-06.
  const H: Calendar = { workdays: C.workdays, holidays: ['2026-01-05'] };
  assert(addWorkingDays('2026-01-02', 1, H) === '2026-01-06', 'holiday is skipped');

  // Index round-trip for a working day.
  const idx = toIndex('2026-01-09', '2026-01-05', C);
  assert(idx === 4, 'index of Fri from Mon epoch is 4');
  assert(fromIndex(idx, '2026-01-05', C) === '2026-01-09', 'index round-trips');

  // Duration/finish convention.
  assert(finishOf('2026-01-05', 5, C) === '2026-01-09', '5wd from Mon finishes Fri (inclusive)');
  assert(finishOf('2026-01-05', 1, C) === '2026-01-05', '1wd finishes same day');
  assert(finishOf('2026-01-05', 0, C) === '2026-01-05', 'milestone finishes on start');

  console.log('calendar.ts self-check passed');
}
