// USMC Physical Fitness Test (PFT) scoring standards.
// Transcribed from operationmilitarykids.org/marine-corps-pft-standards, which
// publishes six point tiers per event (100, 90, 75, 60, 50, 40) rather than a
// value for every point. Scoring therefore INTERPOLATES between the two anchors
// that bracket a raw result, so scores are continuous while the on-page table
// shows the exact published tier values for verification.
//
// Column order per row (after the leading Points value): 10 data cells =
//   5 age groups x [Male, Female], in order: 17-20, 21-25, 26-30, 31-35, 36-40
// A null cell corresponds to an "N/A" blank in the source.
//
// Raw units: pull-ups / push-ups in reps (higher is better); plank and 3-mile
// run stored as "mm:ss" strings (plank: longer hold = higher; run: faster = higher).
//
// The source covers ages 17-40 only; brackets 41+ are intentionally omitted.

export type Cell = number | string | null;
export type Dir = 'high' | 'low'; // high: bigger raw is better; low: faster time is better

export interface EventStd {
  key: string;
  label: string;
  shortLabel: string;
  unit: string;
  dir: Dir;
  isTime: boolean;
  max: number; // point cap for this event (push-ups cap at 70; others 100)
  // rows[i][0] = points; rows[i][1..10] = data cells (see column order above)
  rows: Cell[][];
}

export const AGE_GROUPS = ['17–20', '21–25', '26–30', '31–35', '36–40'] as const;

export type Sex = 'male' | 'female';

// ===========================================================================
// Pull-ups — reps (higher is better), up to 100 points
// ===========================================================================
const PULLUP_ROWS: Cell[][] = [
  // pts  17M 17F  21M 21F  26M 26F  31M 31F  36M 36F
  [100, 20, 7, 23, 11, 23, 12, 23, 11, 21, 10],
  [90, 17, 6, 20, 9, 20, 10, 20, 9, 19, 8],
  [75, 13, 4, 16, 6, 16, 7, 16, 6, 15, 6],
  [60, 10, 1, 11, 3, 11, 4, 11, 3, 11, 3],
  [50, 7, null, 8, null, 8, null, 8, null, 8, null],
  [40, 4, null, 5, null, 5, null, 5, null, 5, null],
];

// ===========================================================================
// Push-ups — reps (higher is better), CAPPED at 70 points
// ===========================================================================
const PUSHUP_ROWS: Cell[][] = [
  // pts  17M  17F   21M  21F   26M  26F   31M  31F   36M  36F
  [100, null, null, null, null, null, null, null, null, null, null],
  [90, null, null, null, null, null, null, null, null, null, null],
  [75, 65, null, 64, null, 65, null, 67, null, null, null],
  [60, 59, 34, 53, 38, 54, 39, 56, 36, 62, 33],
  [50, 55, 27, 46, 28, 47, 29, 50, 26, 48, 24],
  [40, 42, 19, 40, 18, 39, 18, 43, 16, 34, 14],
];

// ===========================================================================
// Plank — forearm hold mm:ss (longer is better). Same for all groups + sexes.
// ===========================================================================
const PLANK_ROWS: Cell[][] = [
  // pts   17M     17F     21M     21F     26M     26F     31M     31F     36M     36F
  [100, '3:45', '3:45', '3:45', '3:45', '3:45', '3:45', '3:45', '3:45', '3:45', '3:45'],
  [90, '3:20', '3:20', '3:20', '3:20', '3:20', '3:20', '3:20', '3:20', '3:20', '3:20'],
  [75, '2:41', '2:41', '2:41', '2:41', '2:41', '2:41', '2:41', '2:41', '2:41', '2:41'],
  [60, '2:02', '2:02', '2:02', '2:02', '2:02', '2:02', '2:02', '2:02', '2:02', '2:02'],
  [50, '1:36', '1:36', '1:36', '1:36', '1:36', '1:36', '1:36', '1:36', '1:36', '1:36'],
  [40, '1:10', '1:10', '1:10', '1:10', '1:10', '1:10', '1:10', '1:10', '1:10', '1:10'],
];

// ===========================================================================
// 3-Mile Run — time mm:ss (faster is better)
// ===========================================================================
const RUN_ROWS: Cell[][] = [
  // pts    17M      17F      21M      21F      26M      26F      31M      31F      36M      36F
  [100, '18:00', '21:00', '18:00', '21:00', '18:00', '21:00', '18:00', '21:00', '18:00', '21:00'],
  [90, '19:40', '22:40', '19:40', '22:40', '19:40', '22:40', '19:40', '22:50', '19:50', '22:50'],
  [75, '22:00', '25:10', '22:00', '25:10', '22:10', '25:10', '22:20', '25:20', '22:30', '25:30'],
  [60, '24:30', '27:30', '24:30', '27:30', '24:40', '27:50', '24:50', '28:00', '25:10', '28:10'],
  [50, '26:00', '29:10', '26:00', '29:10', '26:20', '29:30', '26:40', '29:50', '26:50', '30:00'],
  [40, '27:40', '30:50', '27:40', '30:50', '28:00', '31:10', '28:20', '31:30', '28:40', '31:50'],
];

export const PULLUPS: EventStd = {
  key: 'pullups', label: 'Pull-ups', shortLabel: 'Pull-ups', unit: 'reps', dir: 'high', isTime: false, max: 100, rows: PULLUP_ROWS,
};
export const PUSHUPS: EventStd = {
  key: 'pushups', label: 'Push-ups', shortLabel: 'Push-ups', unit: 'reps', dir: 'high', isTime: false, max: 70, rows: PUSHUP_ROWS,
};
export const PLANK: EventStd = {
  key: 'plank', label: 'Plank', shortLabel: 'Plank', unit: 'time', dir: 'high', isTime: true, max: 100, rows: PLANK_ROWS,
};
export const RUN: EventStd = {
  key: 'run', label: '3-Mile Run', shortLabel: '3-mile run', unit: 'time', dir: 'low', isTime: true, max: 100, rows: RUN_ROWS,
};

// Data-cell column index for a given age group + sex.
// row = [points, 17M, 17F, 21M, 21F, ...] -> 1 + ageIndex*2 + (female ? 1 : 0)
export function colIndex(ageIndex: number, sex: Sex): number {
  return 1 + ageIndex * 2 + (sex === 'female' ? 1 : 0);
}

// "mm:ss" (or "m:ss") -> total seconds. Plain numbers pass through.
export function timeToSec(v: string): number {
  const m = v.trim().match(/^(\d+):(\d{1,2})$/);
  if (!m) return Number(v);
  return Number(m[1]) * 60 + Number(m[2]);
}

// total seconds -> "m:ss"
export function secToTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Numeric value of a cell (time cells -> seconds), or null when blank.
function cellValue(cell: Cell, isTime: boolean): number | null {
  if (cell === null || cell === undefined) return null;
  return isTime ? timeToSec(String(cell)) : Number(cell);
}

// Score a raw performance by interpolating between the published tier anchors.
// raw: reps for rep events, SECONDS for time events. Returns rounded points
// clamped to [0, event.max]. Extrapolates linearly beyond the outermost anchors
// so results above the top tier or below the 40 tier still degrade smoothly.
export function scoreEvent(event: EventStd, sex: Sex, ageIndex: number, raw: number): number {
  const ci = colIndex(ageIndex, sex);

  // Collect (value, points) anchors for this column, sorted by value ascending.
  const anchors: { val: number; pts: number }[] = [];
  for (const row of event.rows) {
    const val = cellValue(row[ci], event.isTime);
    if (val === null) continue;
    anchors.push({ val, pts: row[0] as number });
  }
  if (anchors.length === 0) return 0;
  anchors.sort((a, b) => a.val - b.val);
  if (anchors.length === 1) return clamp(anchors[0].pts, event.max);

  // Find the bracketing pair, or the outermost pair for extrapolation.
  let lo = 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    if (raw >= anchors[i].val && raw <= anchors[i + 1].val) {
      lo = i;
      break;
    }
    if (raw > anchors[anchors.length - 1].val) lo = anchors.length - 2;
    else if (raw < anchors[0].val) lo = 0;
    else lo = i;
  }
  const a = anchors[lo];
  const b = anchors[lo + 1];
  const pts = a.pts + ((raw - a.val) / (b.val - a.val)) * (b.pts - a.pts);
  return clamp(Math.round(pts), event.max);
}

function clamp(pts: number, max: number): number {
  return Math.max(0, Math.min(max, pts));
}
