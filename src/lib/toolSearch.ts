const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function matchesQuery(text: string, query: string): boolean {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  return terms.every((t) => new RegExp(`\\b${esc(t)}`, 'i').test(text));
}

export function compareByQuery(aName: string, bName: string, query: string): number {
  const first = query.toLowerCase().trim().split(/\s+/)[0] ?? '';
  const starts = (n: string) => n.toLowerCase().startsWith(first);
  return Number(starts(bName)) - Number(starts(aName)) || aName.localeCompare(bName);
}

export function toolHaystack(t: {
  name: string;
  tagline?: string;
  category: string;
  keywords?: string[];
}): string {
  return [t.name, t.tagline ?? '', t.category, ...(t.keywords ?? [])]
    .join(' ')
    .toLowerCase();
}
