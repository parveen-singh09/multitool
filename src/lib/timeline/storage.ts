// Autosave the working timeline to localStorage so a reload restores the draft.
// ponytail: separate file only to keep the page script readable.

import type { Timeline } from './types';

const KEY = 'toolcities:timeline-creator';

export function saveDraft(tl: Timeline): void {
  try { localStorage.setItem(KEY, JSON.stringify(tl)); } catch { /* quota/private mode */ }
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
