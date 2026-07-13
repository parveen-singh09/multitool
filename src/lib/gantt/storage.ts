

import type { GanttProject } from './types';

const KEY = 'toolsilk:gantt-chart-creator';

export function saveDraft(p: GanttProject): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {  }
}

export function loadDraft(): GanttProject | null {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return null;
    const o = JSON.parse(s);
    return o && Array.isArray(o.tasks) ? o : null;
  } catch {
    return null;
  }
}
