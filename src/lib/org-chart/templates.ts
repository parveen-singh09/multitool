

import type { OrgChart, Person } from './types';
import { newId } from './types';

interface TplPerson {
  id: string; 
  name: string;
  title?: string;
  dept?: string;
  managerId: string | null; 
}

export interface OrgTemplate {
  id: string;
  label: string;
  icon: string;
  group: string;
  themeId: string;
  layoutId: string;
  sizeId: string;
  people: TplPerson[];
}

const p = (id: string, name: string, title: string, managerId: string | null, dept?: string): TplPerson =>
  ({ id, name, title, managerId, dept });

export const TEMPLATES: OrgTemplate[] = [
  {
    id: 'company', label: 'Company', icon: '🏢', group: 'Business',
    themeId: 'linear-dark', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Alex Morgan', 'CEO', null),
      p('b', 'Jordan Lee', 'VP Engineering', 'a', 'Engineering'),
      p('c', 'Sam Rivera', 'VP Marketing', 'a', 'Marketing'),
      p('d', 'Priya Shah', 'VP Sales', 'a', 'Sales'),
      p('e', 'Chris Kim', 'Backend Lead', 'b', 'Engineering'),
      p('f', 'Dana Fox', 'Frontend Lead', 'b', 'Engineering'),
      p('g', 'Robin Patel', 'Content Manager', 'c', 'Marketing'),
      p('h', 'Taylor Brooks', 'SEO Specialist', 'c', 'Marketing'),
    ],
  },
  {
    id: 'startup', label: 'Startup', icon: '🚀', group: 'Business',
    themeId: 'slate', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Founder', 'CEO & Co-founder', null),
      p('b', 'Co-founder', 'CTO', 'a', 'Product'),
      p('c', 'Head of Growth', 'Growth', 'a', 'Growth'),
      p('d', 'Engineer', 'Full-stack Engineer', 'b', 'Product'),
      p('e', 'Designer', 'Product Designer', 'b', 'Product'),
      p('f', 'Marketer', 'Content & Social', 'c', 'Growth'),
    ],
  },
  {
    id: 'nonprofit', label: 'Non-profit', icon: '🤝', group: 'Organisation',
    themeId: 'forest', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Board of Directors', 'Governance', null),
      p('b', 'Executive Director', 'Leadership', 'a'),
      p('c', 'Programs Director', 'Programs', 'b'),
      p('d', 'Development Director', 'Fundraising', 'b'),
      p('e', 'Operations Manager', 'Operations', 'b'),
      p('f', 'Volunteer Coordinator', 'Programs', 'c'),
    ],
  },
  {
    id: 'school', label: 'School', icon: '🎓', group: 'Organisation',
    themeId: 'paper', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Principal', 'Head of School', null),
      p('b', 'Vice Principal', 'Academics', 'a'),
      p('c', 'Vice Principal', 'Student Affairs', 'a'),
      p('d', 'Dept Head — Science', 'Faculty', 'b'),
      p('e', 'Dept Head — Arts', 'Faculty', 'b'),
      p('f', 'Counsellor', 'Student Affairs', 'c'),
    ],
  },
  {
    id: 'sales-team', label: 'Sales team', icon: '📈', group: 'Team',
    themeId: 'linear-dark', layoutId: 'left-right', sizeId: 'compact',
    people: [
      p('a', 'VP Sales', 'Sales Leadership', null),
      p('b', 'Regional Manager — East', 'East', 'a'),
      p('c', 'Regional Manager — West', 'West', 'a'),
      p('d', 'Account Executive', 'East', 'b'),
      p('e', 'Account Executive', 'East', 'b'),
      p('f', 'Account Executive', 'West', 'c'),
      p('g', 'Sales Development Rep', 'West', 'c'),
    ],
  },
  {
    id: 'engineering-team', label: 'Engineering team', icon: '💻', group: 'Team',
    themeId: 'slate', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'VP Engineering', 'Engineering Leadership', null),
      p('b', 'Eng Manager — Platform', 'Platform', 'a'),
      p('c', 'Eng Manager — Product', 'Product', 'a'),
      p('d', 'Staff Engineer', 'Platform', 'b'),
      p('e', 'Senior Engineer', 'Platform', 'b'),
      p('f', 'Senior Engineer', 'Product', 'c'),
      p('g', 'Software Engineer', 'Product', 'c'),
      p('h', 'QA Engineer', 'Product', 'c'),
    ],
  },
  {
    id: 'product-team', label: 'Product team', icon: '🧭', group: 'Team',
    themeId: 'sunset', layoutId: 'left-right', sizeId: 'compact',
    people: [
      p('a', 'Head of Product', 'Product Leadership', null),
      p('b', 'Product Manager', 'Core', 'a'),
      p('c', 'Design Lead', 'Design', 'a'),
      p('d', 'UX Researcher', 'Design', 'c'),
      p('e', 'Product Designer', 'Design', 'c'),
      p('f', 'Data Analyst', 'Core', 'b'),
    ],
  },
  {
    id: 'agency', label: 'Agency', icon: '🎨', group: 'Business',
    themeId: 'sunset', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Managing Director', 'Leadership', null),
      p('b', 'Creative Director', 'Creative', 'a'),
      p('c', 'Account Director', 'Accounts', 'a'),
      p('d', 'Art Director', 'Creative', 'b'),
      p('e', 'Copywriter', 'Creative', 'b'),
      p('f', 'Account Manager', 'Accounts', 'c'),
      p('g', 'Project Manager', 'Accounts', 'c'),
    ],
  },
  {
    id: 'restaurant', label: 'Restaurant', icon: '🍽️', group: 'Business',
    themeId: 'forest', layoutId: 'top-down', sizeId: 'compact',
    people: [
      p('a', 'Owner', 'Ownership', null),
      p('b', 'General Manager', 'Front of House', 'a'),
      p('c', 'Head Chef', 'Kitchen', 'a'),
      p('d', 'Floor Manager', 'Front of House', 'b'),
      p('e', 'Sous Chef', 'Kitchen', 'c'),
      p('f', 'Server', 'Front of House', 'd'),
      p('g', 'Line Cook', 'Kitchen', 'e'),
    ],
  },
  {
    id: 'hospital', label: 'Hospital', icon: '🏥', group: 'Organisation',
    themeId: 'paper', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Chief Medical Officer', 'Executive', null),
      p('b', 'Head of Nursing', 'Nursing', 'a'),
      p('c', 'Head of Surgery', 'Surgery', 'a'),
      p('d', 'Head of Radiology', 'Diagnostics', 'a'),
      p('e', 'Charge Nurse', 'Nursing', 'b'),
      p('f', 'Surgeon', 'Surgery', 'c'),
      p('g', 'Radiologist', 'Diagnostics', 'd'),
    ],
  },
  {
    id: 'government', label: 'Government', icon: '🏛️', group: 'Organisation',
    themeId: 'mono', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Mayor', 'Executive', null),
      p('b', 'City Manager', 'Administration', 'a'),
      p('c', 'Director of Public Works', 'Public Works', 'b'),
      p('d', 'Director of Finance', 'Finance', 'b'),
      p('e', 'Chief of Police', 'Public Safety', 'b'),
      p('f', 'Parks Superintendent', 'Public Works', 'c'),
    ],
  },
  {
    id: 'family-tree', label: 'Family tree', icon: '🌳', group: 'Personal',
    themeId: 'forest', layoutId: 'top-down', sizeId: 'comfortable',
    people: [
      p('a', 'Grandparents', '', null),
      p('b', 'Parent', '', 'a'),
      p('c', 'Aunt / Uncle', '', 'a'),
      p('d', 'You', '', 'b'),
      p('e', 'Sibling', '', 'b'),
      p('f', 'Cousin', '', 'c'),
    ],
  },
];

export function templateGroups(): { label: string; items: OrgTemplate[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, OrgTemplate[]>();
  for (const t of TEMPLATES) {
    if (!byGroup.has(t.group)) { byGroup.set(t.group, []); order.push(t.group); }
    byGroup.get(t.group)!.push(t);
  }
  return order.map((label) => ({ label, items: byGroup.get(label)! }));
}

export function getTemplate(id: string): OrgTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function templateToChart(t: OrgTemplate): OrgChart {
  const idMap = new Map<string, string>();
  for (const person of t.people) idMap.set(person.id, newId());
  const people: Person[] = t.people.map((person) => ({
    id: idMap.get(person.id)!,
    name: person.name,
    title: person.title,
    dept: person.dept,
    managerId: person.managerId ? idMap.get(person.managerId) ?? null : null,
  }));
  return { title: t.label, themeId: t.themeId, layoutId: t.layoutId, sizeId: t.sizeId, people };
}
