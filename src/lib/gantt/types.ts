

export type DepType = 'FS' | 'SS' | 'FF' | 'SF'; 

export interface Dependency {
  pred: string; 
  type: DepType;
  lag: number; 
}

export interface Task {
  id: string;
  name: string;
  start: string; 
  duration: number; 
  progress: number; 
  deps: Dependency[]; 
  outline: number; 
  assignee?: string;
  group?: string; 
  color?: string; 

}

export interface Calendar {
  workdays: boolean[]; 
  holidays: string[]; 
}

export type ZoomLevel = 'day' | 'week' | 'month';

export interface GanttProject {
  title: string;
  start: string; 
  zoom: ZoomLevel;
  themeId: string;
  sizeId: string;
  calendar: Calendar;
  tasks: Task[];
}

export interface GanttTheme {
  id: string;
  label: string;
  bg: string;
  grid: string;
  ink: string;
  inkSubtle: string;
  bar: string; 
  barCritical: string; 
  progress: string; 
  summary: string; 
  milestone: string; 
  today: string; 

}

export function newId(): string {
  return `t${Math.random().toString(36).slice(2, 9)}`;
}

export function isMilestone(t: Task): boolean {
  return t.duration === 0;
}

// A task is a summary if the NEXT task in display order sits at a deeper outline
// level — it "owns" the contiguous run of following deeper tasks. This mirrors
// MS Project's positional outline, so import/export is a trivial outline<->level
// shift with no re-parenting bookkeeping.
export function isSummary(tasks: Task[], i: number): boolean {
  const next = tasks[i + 1];
  return !!next && next.outline > tasks[i].outline;
}

// Indices of the contiguous descendants a summary task owns (all following tasks
// with a strictly greater outline, until outline returns to <= the summary's).
export function childrenOf(tasks: Task[], i: number): number[] {
  const base = tasks[i].outline;
  const kids: number[] = [];
  for (let j = i + 1; j < tasks.length && tasks[j].outline > base; j++) kids.push(j);
  return kids;
}

// ---------------------------------------------------------------------------
// ponytail: one self-check on the only non-trivial logic here — positional
// summary/child detection. Run:  npx tsx src/lib/gantt/types.ts
// Guard is a no-op in the browser (process is undefined), so it never runs in
// the Astro bundle.
// ---------------------------------------------------------------------------
declare const process: any;
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('types.ts')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  const t = (outline: number): Task => ({ id: newId(), name: '', start: '2026-01-05', duration: 1, progress: 0, deps: [], outline });
  const tasks = [t(0), t(1), t(1), t(0)]; // parent, child, child, sibling
  assert(isSummary(tasks, 0) === true, 'task followed by deeper outline is a summary');
  assert(isSummary(tasks, 1) === false, 'task followed by same outline is a leaf');
  assert(isSummary(tasks, 2) === false, 'task followed by shallower outline is a leaf');
  assert(isSummary(tasks, 3) === false, 'last task is a leaf');
  assert(JSON.stringify(childrenOf(tasks, 0)) === '[1,2]', 'summary owns its two children');
  assert(childrenOf(tasks, 3).length === 0, 'leaf owns nothing');
  console.log('types.ts self-check passed');
}
