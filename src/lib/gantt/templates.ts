// Ready-made projects. Mirrors the timeline template gallery: authored consts +
// TEMPLATES / templateGroups() / getTemplate() / templateToProject(). Every task
// uses working-day durations and real FS dependencies so loading a template
// immediately demonstrates auto-scheduling, the critical path and rollups.
//
// Within a template, tasks carry short local ids ('a','b',…) and deps reference
// those ids. templateToProject() regenerates fresh unique ids and rewrites the
// dependency references, so loading a template twice never aliases ids.

import type { GanttProject, Task, Dependency, ZoomLevel } from './types';
import { newId } from './types';
import { DEFAULT_CALENDAR } from './calendar';

export interface GanttTemplate {
  id: string;
  label: string;
  icon: string;
  group: string;
  zoom: ZoomLevel;
  themeId: string;
  sizeId: string;
  start: string;
  tasks: Task[];
}

// Concise task builder. deps: array of predecessor local-ids (FS lag 0) or full
// Dependency objects.
function e(
  id: string, name: string, duration: number,
  opts: { deps?: (string | Dependency)[]; outline?: number; progress?: number; group?: string; assignee?: string; color?: string } = {},
): Task {
  const deps: Dependency[] = (opts.deps ?? []).map((d) =>
    typeof d === 'string' ? { pred: d, type: 'FS', lag: 0 } : d);
  return {
    id, name, start: '2026-01-05', duration,
    progress: opts.progress ?? 0, deps,
    outline: opts.outline ?? 0,
    assignee: opts.assignee, group: opts.group, color: opts.color,
  };
}

const START = '2026-01-05'; // a Monday

export const TEMPLATES: GanttTemplate[] = [
  {
    id: 'software-sprint', label: 'Software sprint', icon: '💻', group: 'Software',
    zoom: 'day', themeId: 'linear-dark', sizeId: 'landscape', start: START,
    tasks: [
      e('p', 'Sprint 12', 0, { outline: 0 }),
      e('a', 'Planning & grooming', 2, { outline: 1, progress: 100 }),
      e('b', 'API endpoints', 5, { outline: 1, deps: ['a'], progress: 60, assignee: 'Sam' }),
      e('c', 'UI components', 5, { outline: 1, deps: ['a'], progress: 40, assignee: 'Riya' }),
      e('d', 'Integration', 3, { outline: 1, deps: ['b', 'c'], assignee: 'Sam' }),
      e('e', 'QA & bugfix', 3, { outline: 1, deps: ['d'] }),
      e('m', 'Release', 0, { outline: 1, deps: ['e'] }),
    ],
  },
  {
    id: 'product-launch', label: 'Product launch', icon: '🚀', group: 'Business',
    zoom: 'week', themeId: 'linear-dark', sizeId: 'landscape', start: START,
    tasks: [
      e('a', 'Market research', 10, { progress: 100 }),
      e('b', 'Positioning & messaging', 5, { deps: ['a'], progress: 80 }),
      e('c', 'Landing page', 8, { deps: ['b'], assignee: 'Web team' }),
      e('d', 'Demo video', 6, { deps: ['b'], assignee: 'Creative' }),
      e('e', 'Press outreach', 7, { deps: ['c', 'd'] }),
      e('f', 'Beta program', 12, { deps: ['b'] }),
      e('m', 'Launch day', 0, { deps: ['e', 'f'] }),
    ],
  },
  {
    id: 'marketing-campaign', label: 'Marketing campaign', icon: '📣', group: 'Business',
    zoom: 'week', themeId: 'sunset', sizeId: 'landscape', start: START,
    tasks: [
      e('a', 'Campaign brief', 3, { progress: 100 }),
      e('b', 'Creative concepts', 6, { deps: ['a'], progress: 50 }),
      e('c', 'Copywriting', 5, { deps: ['a'] }),
      e('d', 'Design assets', 8, { deps: ['b', 'c'] }),
      e('e', 'Ad setup', 4, { deps: ['d'] }),
      e('f', 'Launch & monitor', 15, { deps: ['e'] }),
      e('m', 'Wrap report', 0, { deps: ['f'] }),
    ],
  },
  {
    id: 'construction', label: 'Construction project', icon: '🏗️', group: 'Operations',
    zoom: 'week', themeId: 'corporate', sizeId: 'wide', start: START,
    tasks: [
      e('p', 'Site build', 0, { outline: 0 }),
      e('a', 'Site prep & permits', 10, { outline: 1, progress: 100 }),
      e('b', 'Foundation', 8, { outline: 1, deps: ['a'], progress: 30 }),
      e('c', 'Framing', 12, { outline: 1, deps: ['b'] }),
      e('d', 'Roofing', 6, { outline: 1, deps: ['c'] }),
      e('e', 'Electrical & plumbing', 10, { outline: 1, deps: ['c'] }),
      e('f', 'Interior finish', 12, { outline: 1, deps: ['d', 'e'] }),
      e('m', 'Final inspection', 0, { outline: 1, deps: ['f'] }),
    ],
  },
  {
    id: 'event-planning', label: 'Event planning', icon: '🎪', group: 'Operations',
    zoom: 'week', themeId: 'forest', sizeId: 'landscape', start: START,
    tasks: [
      e('a', 'Set date & budget', 3, { progress: 100 }),
      e('b', 'Book venue', 5, { deps: ['a'], progress: 100 }),
      e('c', 'Invite speakers', 10, { deps: ['a'] }),
      e('d', 'Catering & AV', 6, { deps: ['b'] }),
      e('e', 'Marketing & tickets', 20, { deps: ['b', 'c'] }),
      e('f', 'Run of show', 4, { deps: ['d', 'e'] }),
      e('m', 'Event day', 0, { deps: ['f'] }),
    ],
  },
  {
    id: 'research-project', label: 'Research project', icon: '🔬', group: 'Academic',
    zoom: 'week', themeId: 'paper', sizeId: 'landscape', start: START,
    tasks: [
      e('a', 'Literature review', 15, { progress: 70 }),
      e('b', 'Hypothesis & design', 6, { deps: ['a'] }),
      e('c', 'Data collection', 20, { deps: ['b'] }),
      e('d', 'Analysis', 12, { deps: ['c'] }),
      e('e', 'Write-up', 10, { deps: ['d'] }),
      e('f', 'Peer review', 8, { deps: ['e'] }),
      e('m', 'Submission', 0, { deps: ['f'] }),
    ],
  },
  {
    id: 'website-redesign', label: 'Website redesign', icon: '🎨', group: 'Software',
    zoom: 'week', themeId: 'linear-dark', sizeId: 'landscape', start: START,
    tasks: [
      e('a', 'Audit & goals', 4, { progress: 100 }),
      e('b', 'Wireframes', 6, { deps: ['a'], progress: 60 }),
      e('c', 'Visual design', 8, { deps: ['b'] }),
      e('d', 'Content migration', 10, { deps: ['a'] }),
      e('e', 'Front-end build', 12, { deps: ['c'] }),
      e('f', 'QA & launch', 5, { deps: ['d', 'e'] }),
      e('m', 'Go live', 0, { deps: ['f'] }),
    ],
  },
  {
    id: 'home-renovation', label: 'Home renovation', icon: '🏠', group: 'Personal',
    zoom: 'week', themeId: 'sunset', sizeId: 'landscape', start: START,
    tasks: [
      e('a', 'Design & budget', 7, { progress: 100 }),
      e('b', 'Demolition', 4, { deps: ['a'] }),
      e('c', 'Plumbing & wiring', 8, { deps: ['b'] }),
      e('d', 'Drywall & paint', 6, { deps: ['c'] }),
      e('e', 'Flooring', 5, { deps: ['d'] }),
      e('f', 'Fixtures & cleanup', 4, { deps: ['e'] }),
      e('m', 'Move back in', 0, { deps: ['f'] }),
    ],
  },
];

export function templateGroups(): { label: string; items: GanttTemplate[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, GanttTemplate[]>();
  for (const t of TEMPLATES) {
    if (!byGroup.has(t.group)) { byGroup.set(t.group, []); order.push(t.group); }
    byGroup.get(t.group)!.push(t);
  }
  return order.map((label) => ({ label, items: byGroup.get(label)! }));
}

export function getTemplate(id: string): GanttTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

// Turn a template into a fresh GanttProject: new unique ids, dep references
// rewritten to match.
export function templateToProject(t: GanttTemplate): GanttProject {
  const idMap = new Map<string, string>();
  for (const task of t.tasks) idMap.set(task.id, newId());
  const tasks: Task[] = t.tasks.map((task) => ({
    ...task,
    id: idMap.get(task.id)!,
    deps: task.deps.map((d) => ({ ...d, pred: idMap.get(d.pred) ?? d.pred })),
  }));
  return {
    title: t.label, start: t.start, zoom: t.zoom,
    themeId: t.themeId, sizeId: t.sizeId,
    calendar: { workdays: [...DEFAULT_CALENDAR.workdays], holidays: [] },
    tasks,
  };
}
