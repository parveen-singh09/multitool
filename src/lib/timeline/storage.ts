

import type { Timeline } from './types';

const KEY = 'toolsilk:timeline-creator';

export function saveDraft(tl: Timeline): void {
  try { localStorage.setItem(KEY, JSON.stringify(tl)); } catch {  }
}

export function loadDraft(): Timeline | null {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return null;
    const o = JSON.parse(s);
    return o && Array.isArray(o.events) ? o : null;
  } catch {
    return null;
  }
}
