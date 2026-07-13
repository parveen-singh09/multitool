

import type { GanttProject, Task, Dependency, DepType } from './types';
import { newId } from './types';
import { DEFAULT_CALENDAR, finishOf } from './calendar';
import { schedule } from './schedule';

export function toJSON(p: GanttProject): string {
  return JSON.stringify(p, null, 2);
}

export function fromJSON(str: string): GanttProject {
  const o = JSON.parse(str);
  if (!o || !Array.isArray(o.tasks)) throw new Error('Not a Gantt file');
  return normalizeProject(o);
}

function normalizeProject(o: any): GanttProject {
  const cal = o.calendar && Array.isArray(o.calendar.workdays)
    ? { workdays: o.calendar.workdays.map(Boolean), holidays: Array.isArray(o.calendar.holidays) ? o.calendar.holidays.map(String) : [] }
    : { workdays: [...DEFAULT_CALENDAR.workdays], holidays: [] };
  return {
    title: String(o.title ?? 'Project'),
    start: /^\d{4}-\d{2}-\d{2}$/.test(o.start) ? o.start : '2026-01-05',
    zoom: ['day', 'week', 'month'].includes(o.zoom) ? o.zoom : 'week',
    themeId: String(o.themeId ?? 'linear-dark'),
    sizeId: String(o.sizeId ?? 'landscape'),
    calendar: cal,
    tasks: o.tasks.map((t: any, i: number) => normalizeTask(t, i)),
  };
}

function normalizeTask(t: any, i: number): Task {
  const deps: Dependency[] = Array.isArray(t.deps)
    ? t.deps.filter((d: any) => d && d.pred).map((d: any) => ({
        pred: String(d.pred),
        type: (['FS', 'SS', 'FF', 'SF'].includes(d.type) ? d.type : 'FS') as DepType,
        lag: Number(d.lag) || 0,
      }))
    : [];
  return {
    id: t.id ? String(t.id) : `t${i}`,
    name: String(t.name ?? ''),
    start: /^\d{4}-\d{2}-\d{2}$/.test(t.start) ? t.start : '2026-01-05',
    duration: Math.max(0, Math.round(Number(t.duration) || 0)),
    progress: Math.max(0, Math.min(100, Math.round(Number(t.progress) || 0))),
    deps,
    outline: Math.max(0, Math.round(Number(t.outline) || 0)),
    assignee: t.assignee ? String(t.assignee) : undefined,
    group: t.group ? String(t.group) : undefined,
    color: t.color ? String(t.color) : undefined,
  };
}

// --- CSV --------------------------------------------------------------------
// Columns: name,start,end,duration,progress,assignee,dependencies,outline
// `dependencies` = ;-separated 1-based predecessor row numbers (MS-Project-style).
// `end` is derived on export (informational); start+duration+deps are the source
// of truth on import.
const CSV_COLS = ['name', 'start', 'end', 'duration', 'progress', 'assignee', 'dependencies', 'outline'];

export function toCSV(p: GanttProject): string {
  const rowOf = new Map(p.tasks.map((t, i) => [t.id, i + 1]));
  const lines = [CSV_COLS.join(',')];
  for (const t of p.tasks) {
    const end = finishOf(t.start, t.duration, p.calendar);
    const deps = t.deps.map((d) => {
      const n = rowOf.get(d.pred);
      if (!n) return '';
      return `${n}${d.type}${d.lag ? (d.lag > 0 ? '+' + d.lag : d.lag) : ''}`;
    }).filter(Boolean).join(';');
    lines.push([
      t.name, t.start, end, String(t.duration), String(t.progress),
      t.assignee ?? '', deps, String(t.outline),
    ].map(csvCell).join(','));
  }
  return lines.join('\r\n');
}

export function fromCSV(text: string): GanttProject {
  const rows = parseCSV(text);
  if (!rows.length) throw new Error('Empty CSV');
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);
  const ci = {
    name: col('name'), start: col('start'), duration: col('duration'),
    progress: col('progress'), assignee: col('assignee'),
    deps: col('dependencies'), outline: col('outline'),
  };
  const body = rows.slice(1).filter((r) => r.some((c) => c.trim() !== ''));
  // First pass: create tasks with placeholder ids so row numbers resolve.
  const ids = body.map(() => newId());
  const tasks: Task[] = body.map((r, i) => {
    const rawDeps = ci.deps >= 0 ? (r[ci.deps] ?? '') : '';
    const deps: Dependency[] = rawDeps.split(';').map((s) => s.trim()).filter(Boolean).map((tok) => {
      // token like "2FS+3" / "2" / "2SS-1"
      const m = tok.match(/^(\d+)\s*(FS|SS|FF|SF)?\s*([+-]\d+)?$/i);
      if (!m) return null;
      const rowNum = parseInt(m[1], 10);
      const predId = ids[rowNum - 1];
      if (!predId) return null;
      return { pred: predId, type: (m[2]?.toUpperCase() as DepType) || 'FS', lag: m[3] ? parseInt(m[3], 10) : 0 };
    }).filter(Boolean) as Dependency[];
    const startRaw = ci.start >= 0 ? (r[ci.start] ?? '').trim() : '';
    return {
      id: ids[i],
      name: ci.name >= 0 ? (r[ci.name] ?? '').trim() : `Task ${i + 1}`,
      start: /^\d{4}-\d{2}-\d{2}$/.test(startRaw) ? startRaw : '2026-01-05',
      duration: ci.duration >= 0 ? Math.max(0, Math.round(Number(r[ci.duration]) || 0)) : 1,
      progress: ci.progress >= 0 ? Math.max(0, Math.min(100, Math.round(Number(r[ci.progress]) || 0))) : 0,
      assignee: ci.assignee >= 0 && r[ci.assignee]?.trim() ? r[ci.assignee].trim() : undefined,
      deps,
      outline: ci.outline >= 0 ? Math.max(0, Math.round(Number(r[ci.outline]) || 0)) : 0,
    };
  });
  const firstStart = tasks.find((t) => t.start)?.start ?? '2026-01-05';
  return {
    title: 'Imported project', start: firstStart, zoom: 'week',
    themeId: 'linear-dark', sizeId: 'landscape',
    calendar: { workdays: [...DEFAULT_CALENDAR.workdays], holidays: [] },
    tasks,
  };
}

function csvCell(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else inQuotes = false;
      } else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c === '\r') {  }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const TYPE_TO_NUM: Record<DepType, number> = { FF: 0, FS: 1, SF: 2, SS: 3 };
const NUM_TO_TYPE: Record<number, DepType> = { 0: 'FF', 1: 'FS', 2: 'SF', 3: 'SS' };
const LAG_PER_DAY = 4800; 

function xmlEsc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'));
}

export function durationToPT(days: number): string {
  return `PT${Math.max(0, Math.round(days * 8))}H0M0S`;
}

export function ptToDuration(pt: string): number {
  const m = /PT(\d+(?:\.\d+)?)H/i.exec(pt || '');
  return m ? Math.round(parseFloat(m[1]) / 8) : 0;
}

export function toMSProjectXML(p: GanttProject): string {
  const uidOf = new Map(p.tasks.map((t, i) => [t.id, i + 1]));
  const sched = schedule(p);

  const taskXml = p.tasks.map((t, i) => {
    const st = sched.byId.get(t.id);
    const start = st?.start ?? t.start;
    const finish = st?.end ?? t.start;
    const isMs = t.duration === 0;
    const isSum = st?.isSummary ?? false;
    const preds = t.deps.map((d) => {
      const puid = uidOf.get(d.pred);
      if (!puid) return '';
      return `<PredecessorLink><PredecessorUID>${puid}</PredecessorUID><Type>${TYPE_TO_NUM[d.type]}</Type><LinkLag>${d.lag * LAG_PER_DAY}</LinkLag><LagFormat>7</LagFormat></PredecessorLink>`;
    }).join('');
    return (
      `<Task>` +
      `<UID>${i + 1}</UID><ID>${i + 1}</ID>` +
      `<Name>${xmlEsc(t.name)}</Name>` +
      `<Start>${start}T08:00:00</Start><Finish>${finish}T17:00:00</Finish>` +
      `<Duration>${durationToPT(t.duration)}</Duration><DurationFormat>7</DurationFormat>` +
      `<Work>${durationToPT(t.duration)}</Work>` +
      `<PercentComplete>${t.progress}</PercentComplete>` +
      `<OutlineLevel>${t.outline + 1}</OutlineLevel>` +
      `<Milestone>${isMs ? 1 : 0}</Milestone><Summary>${isSum ? 1 : 0}</Summary>` +
      (t.assignee ? `<Notes>${xmlEsc('Assignee: ' + t.assignee)}</Notes>` : '') +
      preds +
      `</Task>`
    );
  }).join('');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<Project xmlns="http://schemas.microsoft.com/project">` +
    `<Name>${xmlEsc(p.title)}</Name>` +
    `<StartDate>${p.start}T08:00:00</StartDate>` +
    `<Tasks>${taskXml}</Tasks>` +
    `</Project>`
  );
}

export function fromMSProjectXML(text: string): GanttProject {
  if (typeof DOMParser === 'undefined') throw new Error('XML import requires a browser');
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Malformed XML');
  const get = (el: Element, tag: string) => el.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';

  const taskEls = Array.from(doc.getElementsByTagName('Task'));
  // Map UID -> generated id first so predecessor links resolve.
  const idByUid = new Map<string, string>();
  for (const el of taskEls) idByUid.set(get(el, 'UID'), newId());

  const tasks: Task[] = taskEls.map((el) => {
    const uid = get(el, 'UID');
    const isMs = get(el, 'Milestone') === '1';
    const start = (get(el, 'Start').split('T')[0]) || '2026-01-05';
    const deps: Dependency[] = Array.from(el.getElementsByTagName('PredecessorLink')).map((pl) => {
      const puid = pl.getElementsByTagName('PredecessorUID')[0]?.textContent?.trim() ?? '';
      const pred = idByUid.get(puid);
      if (!pred) return null;
      const typeNum = parseInt(pl.getElementsByTagName('Type')[0]?.textContent ?? '1', 10);
      const lag = Math.round((parseInt(pl.getElementsByTagName('LinkLag')[0]?.textContent ?? '0', 10) || 0) / LAG_PER_DAY);
      return { pred, type: NUM_TO_TYPE[typeNum] ?? 'FS', lag };
    }).filter(Boolean) as Dependency[];
    return {
      id: idByUid.get(uid)!,
      name: get(el, 'Name') || 'Task',
      start,
      duration: isMs ? 0 : ptToDuration(get(el, 'Duration')),
      progress: Math.max(0, Math.min(100, parseInt(get(el, 'PercentComplete') || '0', 10))),
      deps,
      outline: Math.max(0, (parseInt(get(el, 'OutlineLevel') || '1', 10) || 1) - 1),
    };
  });

  const projStart = (doc.getElementsByTagName('StartDate')[0]?.textContent?.split('T')[0])
    || tasks[0]?.start || '2026-01-05';
  return {
    title: doc.getElementsByTagName('Name')[0]?.textContent?.trim() || 'Imported project',
    start: projStart, zoom: 'week', themeId: 'linear-dark', sizeId: 'landscape',
    calendar: { workdays: [...DEFAULT_CALENDAR.workdays], holidays: [] },
    tasks,
  };
}

// ---------------------------------------------------------------------------
// ponytail: self-check on the pure MS-Project conversions + CSV round-trip.
// The XML *parse* half needs DOMParser (browser only), so it's checked in the
// manual E2E pass, not here. Run:  npx tsx src/lib/gantt/interop.ts
// ---------------------------------------------------------------------------
declare const process: any;
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('interop.ts')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };

  // Duration <-> PT hours at 8h/day.
  assert(durationToPT(5) === 'PT40H0M0S', '5 days -> PT40H0M0S');
  assert(durationToPT(0) === 'PT0H0M0S', 'milestone -> PT0H0M0S');
  assert(ptToDuration('PT40H0M0S') === 5, 'PT40H -> 5 days');
  assert(ptToDuration('PT8H0M0S') === 1, 'PT8H -> 1 day');

  // Dependency type numbering — FS must be 1, not 0.
  assert(TYPE_TO_NUM.FS === 1 && TYPE_TO_NUM.FF === 0 && TYPE_TO_NUM.SF === 2 && TYPE_TO_NUM.SS === 3, 'MS Project type map');
  assert(NUM_TO_TYPE[1] === 'FS', 'inverse type map: 1 -> FS');

  // CSV round-trip (pure string, no DOM).
  const proj: GanttProject = {
    title: 'X', start: '2026-01-05', zoom: 'week', themeId: 'linear-dark', sizeId: 'landscape',
    calendar: { workdays: [...DEFAULT_CALENDAR.workdays], holidays: [] },
    tasks: [
      normalizeTask({ id: 'a', name: 'Plan, scope', start: '2026-01-05', duration: 3, progress: 100 }, 0),
      normalizeTask({ id: 'b', name: 'Build', start: '2026-01-05', duration: 5, deps: [{ pred: 'a', type: 'FS', lag: 2 }] }, 1),
    ],
  };
  const csv = toCSV(proj);
  assert(csv.split('\r\n')[0] === CSV_COLS.join(','), 'CSV header present');
  const back = fromCSV(csv);
  assert(back.tasks.length === 2, 'CSV round-trip: 2 tasks');
  assert(back.tasks[0].name === 'Plan, scope', 'CSV quotes a cell with a comma');
  assert(back.tasks[1].duration === 5, 'CSV duration survives');
  assert(back.tasks[1].deps.length === 1 && back.tasks[1].deps[0].type === 'FS' && back.tasks[1].deps[0].lag === 2, 'CSV dependency (type + lag) survives');
  assert(back.tasks[1].deps[0].pred === back.tasks[0].id, 'CSV dep resolves to row 1');

  // XML export string shape (parse tested manually in browser).
  const xml = toMSProjectXML(proj);
  assert(xml.includes('<Duration>PT24H0M0S</Duration>'), 'XML encodes 3-day duration');
  assert(xml.includes('<Type>1</Type>'), 'XML encodes FS dependency as Type 1');
  assert(xml.includes(`<LinkLag>${2 * LAG_PER_DAY}</LinkLag>`), 'XML encodes lag 2 as 9600 tenth-minutes');
  assert(xml.includes('<OutlineLevel>1</OutlineLevel>'), 'XML outline is 1-based');

  console.log('interop.ts self-check passed');
}
