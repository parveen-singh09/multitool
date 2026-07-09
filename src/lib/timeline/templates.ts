// Ready-made timelines. Mirrors the collage template gallery: authored consts +
// TEMPLATES / templateGroups() / getTemplate() helpers. Every event uses a real
// parseable date so loading a template immediately demonstrates auto-sorting and
// range bars.

import type { Timeline, TimelineEvent, TimelineLayout } from './types';
import { parseDate } from './types';

export interface TimelineTemplate {
  id: string;
  label: string;
  icon: string;
  group: string;
  layout: TimelineLayout;
  themeId: string;
  sizeId: string;
  events: TimelineEvent[];
}

let seq = 0;
// Concise event builder: e(date, title, desc?, end?) -> TimelineEvent.
function e(date: string, title: string, desc?: string, end?: string): TimelineEvent {
  const start = parseDate(date)!;
  return {
    id: `t${seq++}`, start, end: end ? parseDate(end)! : undefined,
    displayDate: date, title, desc,
  };
}

const T = (t: Omit<TimelineTemplate, 'events'> & { events: TimelineEvent[] }) => t;

export const TEMPLATES: TimelineTemplate[] = [
  T({
    id: 'company-history', label: 'Company history', icon: '🏢', group: 'Business',
    layout: 'alternating', themeId: 'linear-dark', sizeId: 'portrait',
    events: [
      e('2016', 'Founded', 'Two co-founders start the company in a garage.'),
      e('2018', 'Seed round', 'Raised $2M to build the first product.'),
      e('2020', 'Series A', 'Scaled the team to 40 people.'),
      e('2022', '1M users', 'Crossed one million active users.'),
      e('2024', 'Global expansion', 'Opened offices in three continents.'),
    ],
  }),
  T({
    id: 'product-roadmap', label: 'Product roadmap', icon: '🗺️', group: 'Business',
    layout: 'horizontal', themeId: 'roadmap', sizeId: 'wide',
    events: [
      e('2025 Q1', 'Discovery', 'User research and scoping.', '2025 Q2'),
      e('2025 Q2', 'Beta', 'Private beta with design partners.'),
      e('2025 Q3', 'GA launch', 'General availability.'),
      e('2025 Q4', 'Mobile apps', 'iOS and Android release.'),
    ],
  }),
  T({
    id: 'product-launch', label: 'Product launch plan', icon: '🚀', group: 'Business',
    layout: 'vertical', themeId: 'linear-dark', sizeId: 'portrait',
    events: [
      e('2026-01-05', 'Kickoff', 'Align teams and lock the launch date.'),
      e('2026-02-01', 'Content ready', 'Landing page, docs and demo video done.'),
      e('2026-02-20', 'Press embargo', 'Brief journalists under embargo.'),
      e('2026-03-01', 'Launch day', 'Ship to everyone and go loud.'),
    ],
  }),
  T({
    id: 'biography', label: 'Biography / life story', icon: '📖', group: 'Personal',
    layout: 'alternating', themeId: 'sepia', sizeId: 'portrait',
    events: [
      e('1990', 'Born', 'Born in a small coastal town.'),
      e('2008', 'Graduated high school'),
      e('2012', 'University degree', 'BSc in Computer Science.'),
      e('2015', 'First job', 'Joined a startup as engineer #4.'),
      e('2021', 'Started a company'),
    ],
  }),
  T({
    id: 'resume', label: 'Résumé / career', icon: '💼', group: 'Personal',
    layout: 'vertical', themeId: 'paper', sizeId: 'portrait',
    events: [
      e('2015', 'Junior Developer', 'Acme Corp — front-end team.', '2018'),
      e('2018', 'Senior Developer', 'Globex — led the platform team.', '2022'),
      e('2022', 'Engineering Manager', 'Initech — managing 8 engineers.', '2026'),
    ],
  }),
  T({
    id: 'wedding', label: 'Wedding day', icon: '💍', group: 'Personal',
    layout: 'vertical', themeId: 'wedding', sizeId: 'story',
    events: [
      e('2 PM', 'Ceremony', 'Guests seated, vows exchanged.'),
      e('3 PM', 'Cocktails', 'Drinks and photos on the terrace.'),
      e('5 PM', 'Dinner', 'Three-course meal and speeches.'),
      e('8 PM', 'First dance', 'The party begins.'),
    ],
  }),
  T({
    id: 'course-syllabus', label: 'Course syllabus', icon: '🎓', group: 'Education',
    layout: 'vertical', themeId: 'corporate', sizeId: 'portrait',
    events: [
      e('2026-09-01', 'Week 1: Intro', 'Fundamentals and setup.'),
      e('2026-09-15', 'Week 3: Core concepts'),
      e('2026-10-06', 'Week 6: Midterm'),
      e('2026-11-10', 'Week 11: Project'),
      e('2026-12-08', 'Week 15: Finals'),
    ],
  }),
  T({
    id: 'ancient-rome', label: 'Ancient history', icon: '🏛️', group: 'History',
    layout: 'horizontal', themeId: 'sepia', sizeId: 'wide',
    events: [
      e('753 BC', 'Rome founded', 'Traditional founding date.'),
      e('509 BC', 'Republic', 'Roman Republic established.'),
      e('44 BC', 'Caesar assassinated'),
      e('27 BC', 'Empire', 'Augustus becomes first emperor.'),
      e('476', 'Fall of Rome', 'Western Roman Empire ends.'),
    ],
  }),
  T({
    id: 'space-race', label: 'Space race', icon: '🛰️', group: 'History',
    layout: 'horizontal', themeId: 'corporate', sizeId: 'wide',
    events: [
      e('1957-10-04', 'Sputnik', 'First artificial satellite.'),
      e('1961-04-12', 'First human', 'Gagarin orbits Earth.'),
      e('1969-07-20', 'Moon landing', 'Apollo 11.'),
      e('1981-04-12', 'Space Shuttle', 'First shuttle launch.'),
    ],
  }),
  T({
    id: 'project-plan', label: 'Project plan', icon: '📋', group: 'Business',
    layout: 'horizontal', themeId: 'linear-dark', sizeId: 'wide',
    events: [
      e('2026-01', 'Planning', 'Requirements and design.', '2026-02'),
      e('2026-02', 'Build', 'Core development.', '2026-05'),
      e('2026-05', 'Testing', 'QA and hardening.', '2026-06'),
      e('2026-06', 'Release'),
    ],
  }),
  T({
    id: 'film-chronology', label: 'Story / film chronology', icon: '🎬', group: 'Creative',
    layout: 'alternating', themeId: 'linear-dark', sizeId: 'portrait',
    events: [
      e('Act 1', 'Setup', 'Introduce the world and hero.'),
      e('Act 2', 'Rising action', 'Conflict escalates.'),
      e('Act 3', 'Climax', 'The decisive confrontation.'),
      e('Act 4', 'Resolution', 'Loose ends tied up.'),
    ],
  }),
  T({
    id: 'sports-season', label: 'Sports season', icon: '🏆', group: 'Creative',
    layout: 'horizontal', themeId: 'roadmap', sizeId: 'wide',
    events: [
      e('2026-03', 'Pre-season', 'Training camp.'),
      e('2026-04', 'Opening day'),
      e('2026-07', 'All-star break'),
      e('2026-10', 'Playoffs'),
      e('2026-11', 'Finals'),
    ],
  }),
];

export function templateGroups(): { label: string; items: TimelineTemplate[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, TimelineTemplate[]>();
  for (const t of TEMPLATES) {
    if (!byGroup.has(t.group)) { byGroup.set(t.group, []); order.push(t.group); }
    byGroup.get(t.group)!.push(t);
  }
  return order.map((label) => ({ label, items: byGroup.get(label)! }));
}

export function getTemplate(id: string): TimelineTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

// Turn a template into a fresh Timeline (fresh event ids so edits don't alias
// the shared template objects).
export function templateToTimeline(t: TimelineTemplate): Timeline {
  return {
    title: t.label,
    layout: t.layout,
    themeId: t.themeId,
    sizeId: t.sizeId,
    events: t.events.map((ev, i) => ({ ...ev, id: `e${Date.now()}_${i}` })),
  };
}
