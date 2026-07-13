

import type { OrgChart } from './types';

const KEY = 'toolsilk:org-chart-creator';

export function saveDraft(c: OrgChart): void {
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {  }
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
