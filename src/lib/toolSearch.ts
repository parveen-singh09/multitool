// Shared tool-search logic used by the header dropdown, the explore grid,
// and the sidebar so all three behave EXACTLY the same.
//
// Matcher: multi-term, word-boundary. Every whitespace-separated term must
// match at a word start in `text`, so "dom" matches "Domain" but not "ran*dom*".
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function matchesQuery(text: string, query: string): boolean {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  return terms.every((t) => new RegExp(`\\b${esc(t)}`, 'i').test(text));
}

// Ranking used by every search: tools whose NAME starts with the query come
// first, then everything else; each tier alphabetical by name. `query`'s first
// term drives the prefix test (mirrors the header dropdown's original sort).
export function compareByQuery(aName: string, bName: string, query: string): number {
  const first = query.toLowerCase().trim().split(/\s+/)[0] ?? '';
  const starts = (n: string) => n.toLowerCase().startsWith(first);
  return Number(starts(bName)) - Number(starts(aName)) || aName.localeCompare(bName);
}

// The exact fields every search matches against: name, tagline, category, keywords.
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
