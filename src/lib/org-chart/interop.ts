

import type { OrgChart, Person } from './types';
import { newId } from './types';

const DEFAULTS = { themeId: 'linear-dark', layoutId: 'top-down', sizeId: 'comfortable' };

export function toJSON(c: OrgChart): string {
  return JSON.stringify(c, null, 2);
}

export function fromJSON(str: string): OrgChart {
  const o = JSON.parse(str);
  if (!o || !Array.isArray(o.people)) throw new Error('Not an org chart file');
  return normalizeChart(o);
}

function normalizeChart(o: any): OrgChart {
  const people: Person[] = o.people.map((p: any, i: number) => ({
    id: p.id ? String(p.id) : `o${i}`,
    name: String(p.name ?? ''),
    title: p.title ? String(p.title) : undefined,
    dept: p.dept ? String(p.dept) : undefined,
    managerId: p.managerId == null ? null : String(p.managerId),
    photo: typeof p.photo === 'string' && p.photo.startsWith('data:') ? p.photo : undefined,
    color: typeof p.color === 'string' ? p.color : undefined,
  }));
  const ids = new Set(people.map((p) => p.id));
  for (const p of people) if (p.managerId && !ids.has(p.managerId)) p.managerId = null;
  return {
    title: String(o.title ?? 'Org chart'),
    themeId: String(o.themeId ?? DEFAULTS.themeId),
    layoutId: String(o.layoutId ?? DEFAULTS.layoutId),
    sizeId: String(o.sizeId ?? DEFAULTS.sizeId),
    logo: typeof o.logo === 'string' && o.logo.startsWith('data:') ? o.logo : undefined,
    people,
  };
}

const CSV_COLS = ['Name', 'Title', 'Department', 'Reports To'];

export function toCSV(c: OrgChart): string {
  const nameById = new Map(c.people.map((p) => [p.id, p.name]));
  const lines = [CSV_COLS.join(',')];
  for (const p of c.people) {
    lines.push([
      p.name,
      p.title ?? '',
      p.dept ?? '',
      p.managerId ? (nameById.get(p.managerId) ?? '') : '',
    ].map(csvCell).join(','));
  }
  return lines.join('\r\n');
}

export function fromCSV(text: string): OrgChart {
  const rows = parseCSV(text.replace(/^﻿/, '')); 
  if (!rows.length) throw new Error('Empty CSV');
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const find = (...names: string[]) => { for (const n of names) { const i = header.indexOf(n); if (i >= 0) return i; } return -1; };
  const ci = {
    name: find('name', 'employee', 'full name'),
    title: find('title', 'role', 'job title', 'position'),
    dept: find('department', 'dept', 'team'),
    mgr: find('reports to', 'manager', 'reportsto', 'supervisor'),
  };
  if (ci.name < 0) throw new Error('CSV needs a "Name" column');

  const body = rows.slice(1).filter((r) => r.some((c) => c.trim() !== ''));
  const people: Person[] = body.map((r) => ({
    id: newId(),
    name: (r[ci.name] ?? '').trim(),
    title: ci.title >= 0 && r[ci.title]?.trim() ? r[ci.title].trim() : undefined,
    dept: ci.dept >= 0 && r[ci.dept]?.trim() ? r[ci.dept].trim() : undefined,
    managerId: null, // resolved below
  }));

  const idByName = new Map<string, string>();
  people.forEach((p) => { const k = p.name.toLowerCase(); if (k && !idByName.has(k)) idByName.set(k, p.id); });
  body.forEach((r, i) => {
    const mgrName = ci.mgr >= 0 ? (r[ci.mgr] ?? '').trim().toLowerCase() : '';
    const mgrId = mgrName ? idByName.get(mgrName) : undefined;
    if (mgrId && mgrId !== people[i].id) people[i].managerId = mgrId;
  });

  return { title: 'Imported org chart', ...DEFAULTS, people };
}

function csvCell(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else inQuotes = false; }
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c === '\r') {  }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

export function fromOutline(text: string): OrgChart {
  const lines = text.split('\n').filter((l) => l.trim() !== '');
  const people: Person[] = [];
  const stack: { id: string; indent: number }[] = [];

  for (const line of lines) {
    const m = line.match(/^[\t ]*/);
    const indent = m ? m[0].replace(/\t/g, '  ').length : 0;
    const raw = line.trim();
    const [name, title] = raw.split(/\s*[,|]\s*/, 2);
    const person: Person = { id: newId(), name: name.trim(), title: title?.trim() || undefined, managerId: null };

    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    person.managerId = stack.length ? stack[stack.length - 1].id : null;
    people.push(person);
    stack.push({ id: person.id, indent });
  }

  return { title: 'Org chart', ...DEFAULTS, people };
}
