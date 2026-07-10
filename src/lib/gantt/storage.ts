// Autosave the working project to localStorage so a reload restores the draft.
// ponytail: separate file only to keep the page script readable.

import type { GanttProject } from './types';

const KEY = 'toolcities:gantt-chart-creator';

export function saveDraft(p: GanttProject): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* quota/private mode */ }
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
