// Autosave the working chart to localStorage so a reload restores the draft.
// ponytail: separate file only to keep the page script readable.

import type { OrgChart } from './types';

const KEY = 'toolcities:org-chart-creator';

export function saveDraft(c: OrgChart): void {
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* quota/private mode */ }
}

export function loadDraft(): OrgChart | null {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return null;
    const o = JSON.parse(s);
    return o && Array.isArray(o.people) ? o : null;
  } catch {
    return null;
  }
}
