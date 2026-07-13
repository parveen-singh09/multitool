

import type { GanttProject, Dependency } from './types';
import { isSummary, childrenOf } from './types';
import { toIndex, fromIndex } from './calendar';

export interface ScheduledTask {
  id: string;
  startIdx: number;
  endIdx: number; 
  start: string; 
  end: string; 
  slack: number;
  critical: boolean;
  isSummary: boolean;
  isMilestone: boolean;
  progress: number;
}

export interface Scheduled {
  byId: Map<string, ScheduledTask>;
  ordered: ScheduledTask[]; 
  projectStartIdx: number;
  projectFinishIdx: number;
  cycleEdges: { pred: string; succ: string }[];
}

interface Node {
  id: string;
  anchor: number; 
  dur: number; 
  deps: Dependency[]; 
}

export function schedule(p: GanttProject): Scheduled {
  const epoch = p.start;
  const cal = p.calendar;
  const idx0 = 0; 

  const leafIdx = p.tasks.map((_, i) => i).filter((i) => !isSummary(p.tasks, i));
  const leafIds = new Set(leafIdx.map((i) => p.tasks[i].id));

  const nodes = new Map<string, Node>();
  for (const i of leafIdx) {
    const t = p.tasks[i];
    const anchor = Math.max(idx0, toIndex(t.start, epoch, cal));

    const deps = t.deps.filter((d) => leafIds.has(d.pred) && d.pred !== t.id);
    nodes.set(t.id, { id: t.id, anchor, dur: Math.max(0, t.duration), deps });
  }

  const succ = new Map<string, { succ: string; type: Dependency['type']; lag: number }[]>();
  const indeg = new Map<string, number>();
  for (const id of nodes.keys()) { succ.set(id, []); indeg.set(id, 0); }
  for (const n of nodes.values()) {
    for (const d of n.deps) {
      succ.get(d.pred)!.push({ succ: n.id, type: d.type, lag: d.lag });
      indeg.set(n.id, indeg.get(n.id)! + 1);
    }
  }

  const { order, cycleEdges } = topoSort(nodes, succ, indeg);

  const ES = new Map<string, number>();
  const EF = new Map<string, number>();
  const active = new Set(order); 
  for (const id of order) {
    const n = nodes.get(id)!;
    let es = n.anchor;
    for (const d of n.deps) {
      if (!active.has(d.pred)) continue;
      const pES = ES.get(d.pred)!, pEF = EF.get(d.pred)!;
      const span = n.dur === 0 ? 0 : n.dur - 1;
      let cand = es;
      switch (d.type) {
        case 'FS': cand = pEF + 1 + d.lag; break;
        case 'SS': cand = pES + d.lag; break;
        case 'FF': cand = pEF + d.lag - span; break;
        case 'SF': cand = pES + d.lag - span; break;
      }
      es = Math.max(es, cand);
    }
    ES.set(id, es);
    EF.set(id, n.dur === 0 ? es : es + n.dur - 1);
  }

  const projectFinishIdx = order.length ? Math.max(...order.map((id) => EF.get(id)!)) : idx0;

  const LS = new Map<string, number>();
  const LF = new Map<string, number>();
  for (let k = order.length - 1; k >= 0; k--) {
    const id = order[k];
    const n = nodes.get(id)!;
    const span = n.dur === 0 ? 0 : n.dur - 1;
    let lf = projectFinishIdx;
    const outs = succ.get(id)!.filter((s) => active.has(s.succ));
    if (outs.length) {
      lf = Infinity;
      for (const s of outs) {
        const sLS = LS.get(s.succ)!, sLF = LF.get(s.succ)!;

        let cand: number;
        switch (s.type) {
          case 'FS': cand = sLS - 1 - s.lag; break;            
          case 'SS': cand = (sLS - s.lag) + span; break;        
          case 'FF': cand = sLF - s.lag; break;                 
          case 'SF': cand = (sLF - s.lag) + span; break;        
        }
        lf = Math.min(lf, cand);
      }
    }
    LF.set(id, lf);
    LS.set(id, n.dur === 0 ? lf : lf - n.dur + 1);
  }

  const byId = new Map<string, ScheduledTask>();
  for (const i of leafIdx) {
    const t = p.tasks[i];
    const es = ES.get(t.id) ?? nodes.get(t.id)!.anchor;
    const ef = EF.get(t.id) ?? es;
    const slack = active.has(t.id) ? Math.max(0, (LS.get(t.id)! - es)) : 0;
    byId.set(t.id, {
      id: t.id,
      startIdx: es,
      endIdx: ef,
      start: fromIndex(es, epoch, cal),
      end: fromIndex(ef, epoch, cal),
      slack,
      critical: active.has(t.id) && slack === 0,
      isSummary: false,
      isMilestone: t.duration === 0,
      progress: clampPct(t.progress),
    });
  }

  for (let i = 0; i < p.tasks.length; i++) {
    if (!isSummary(p.tasks, i)) continue;
    const t = p.tasks[i];
    const kids = childrenOf(p.tasks, i).map((j) => byId.get(p.tasks[j].id)).filter(Boolean) as ScheduledTask[];
    const startIdx = kids.length ? Math.min(...kids.map((k) => k.startIdx)) : idx0;
    const endIdx = kids.length ? Math.max(...kids.map((k) => k.endIdx)) : startIdx;

    let num = 0, den = 0;
    for (const k of kids) { const w = Math.max(1, k.endIdx - k.startIdx + 1); num += k.progress * w; den += w; }
    byId.set(t.id, {
      id: t.id, startIdx, endIdx,
      start: fromIndex(startIdx, epoch, cal), end: fromIndex(endIdx, epoch, cal),
      slack: 0, critical: false, isSummary: true, isMilestone: false,
      progress: den ? Math.round(num / den) : 0,
    });
  }

  const ordered = p.tasks.map((t) => byId.get(t.id)!).filter(Boolean);
  return { byId, ordered, projectStartIdx: idx0, projectFinishIdx, cycleEdges };
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n || 0)));
}

function topoSort(
  nodes: Map<string, Node>,
  succ: Map<string, { succ: string; type: Dependency['type']; lag: number }[]>,
  indegIn: Map<string, number>,
): { order: string[]; cycleEdges: { pred: string; succ: string }[] } {
  const indeg = new Map(indegIn);
  const order: string[] = [];
  const queue: string[] = [];
  for (const [id, d] of indeg) if (d === 0) queue.push(id);

  const cycleEdges: { pred: string; succ: string }[] = [];
  const done = new Set<string>();
  while (order.length < nodes.size) {
    while (queue.length) {
      const id = queue.shift()!;
      order.push(id); done.add(id);
      for (const s of succ.get(id)!) {
        indeg.set(s.succ, indeg.get(s.succ)! - 1);
        if (indeg.get(s.succ)! === 0) queue.push(s.succ);
      }
    }
    if (order.length >= nodes.size) break;

    let victim = '';
    let best = Infinity;
    for (const [id, d] of indeg) {
      if (done.has(id)) continue;
      if (d < best) { best = d; victim = id; }
    }
    if (!victim) break;

    for (const [pid, outs] of succ) {
      if (pid === victim) continue;
      for (const s of outs) {
        if (s.succ === victim && !done.has(pid)) {
          cycleEdges.push({ pred: pid, succ: victim });
          indeg.set(victim, indeg.get(victim)! - 1);
        }
      }
    }
    indeg.set(victim, 0);
    queue.push(victim);
  }
  return { order, cycleEdges };
}

declare const process: any;
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('schedule.ts')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  const { DEFAULT_CALENDAR } = await import('./calendar');
  const mk = (over: Partial<import('./types').Task>): import('./types').Task => ({
    id: over.id!, name: over.id!, start: '2026-01-05', duration: 1, progress: 0, deps: [], outline: 0, ...over,
  });
  const base = { title: 'T', start: '2026-01-05', zoom: 'week' as const, themeId: 'x', sizeId: 'y', calendar: DEFAULT_CALENDAR };

  const proj: GanttProject = { ...base, tasks: [
    mk({ id: 'A', duration: 5 }),
    mk({ id: 'B', duration: 3, deps: [{ pred: 'A', type: 'FS', lag: 0 }] }),
    mk({ id: 'C', duration: 2, deps: [{ pred: 'A', type: 'FS', lag: 0 }] }),
    mk({ id: 'D', duration: 1, deps: [{ pred: 'B', type: 'FS', lag: 0 }, { pred: 'C', type: 'FS', lag: 0 }] }),
  ] };
  const s = schedule(proj);
  const g = (id: string) => s.byId.get(id)!;
  assert(g('A').start === '2026-01-05' && g('A').end === '2026-01-09', 'A: Mon..Fri');
  assert(g('B').start === '2026-01-12', 'B starts Mon after A finishes Fri');
  assert(g('C').start === '2026-01-12', 'C starts Mon too');
  assert(g('D').start === '2026-01-15', 'D starts after the later of B(3) and C(2) = after B');
  assert(g('A').critical && g('B').critical && g('D').critical, 'A,B,D on critical path');
  assert(!g('C').critical, 'C has slack, not critical');
  assert(g('A').slack === 0 && g('C').slack === 1, 'slack: A=0, C=1');
  assert(s.projectFinishIdx === g('D').endIdx, 'project finish = D end');

  const lagProj: GanttProject = { ...base, tasks: [
    mk({ id: 'A', duration: 5 }),
    mk({ id: 'B', duration: 3, deps: [{ pred: 'A', type: 'FS', lag: 2 }] }),
  ] };
  assert(schedule(lagProj).byId.get('B')!.start === '2026-01-14', 'FS lag 2 pushes B two working days');

  const msProj: GanttProject = { ...base, tasks: [
    mk({ id: 'A', duration: 5 }),
    mk({ id: 'M', duration: 0, deps: [{ pred: 'A', type: 'FS', lag: 0 }] }),
  ] };
  const ms = schedule(msProj).byId.get('M')!;
  assert(ms.isMilestone && ms.start === ms.end && ms.start === '2026-01-12', 'milestone is a point after A');

  const cyc: GanttProject = { ...base, tasks: [
    mk({ id: 'A', duration: 2, deps: [{ pred: 'B', type: 'FS', lag: 0 }] }),
    mk({ id: 'B', duration: 2, deps: [{ pred: 'A', type: 'FS', lag: 0 }] }),
  ] };
  const cs = schedule(cyc);
  assert(cs.cycleEdges.length >= 1, 'cycle detected and reported');
  assert(!!cs.byId.get('A') && !!cs.byId.get('B'), 'cyclic tasks still resolve (no hang, no throw)');

  const sumProj: GanttProject = { ...base, tasks: [
    mk({ id: 'P', outline: 0 }),
    mk({ id: 'A', outline: 1, duration: 4, progress: 100 }),
    mk({ id: 'B', outline: 1, duration: 2, progress: 0, deps: [{ pred: 'A', type: 'FS', lag: 0 }] }),
  ] };
  const sp = schedule(sumProj);
  assert(sp.byId.get('P')!.isSummary, 'P is a summary');
  assert(sp.byId.get('P')!.start === sp.byId.get('A')!.start, 'summary starts with first child');
  assert(sp.byId.get('P')!.end === sp.byId.get('B')!.end, 'summary ends with last child');

  console.log('schedule.ts self-check passed');
}
