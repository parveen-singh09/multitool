

export interface Person {
  id: string;
  name: string;
  title?: string; 
  dept?: string; 
  managerId: string | null; 
  photo?: string; 
  color?: string; 
}

export interface OrgChart {
  title: string;
  themeId: string;
  layoutId: string; 
  sizeId: string;
  logo?: string; 
  people: Person[];
}

export interface OrgTheme {
  id: string;
  label: string;
  bg: string;
  box: string; 
  boxRoot: string; 
  border: string; 
  ink: string; 
  inkSubtle: string; 
  inkRoot: string; 

}

export function newId(): string {
  return `o${Math.random().toString(36).slice(2, 9)}`;
}

// Direct reports of `id`, in the people-array order (that order is the sibling
// order the layout draws left-to-right).
export function childrenOf(people: Person[], id: string): Person[] {
  return people.filter((p) => p.managerId === id);
}

// Roots = people with no manager, OR whose manager id doesn't resolve to anyone
// (an orphaned reference still renders as a top box rather than vanishing).
export function rootsOf(people: Person[]): Person[] {
  const ids = new Set(people.map((p) => p.id));
  return people.filter((p) => p.managerId === null || !ids.has(p.managerId));
}

// Would setting person `id`'s manager to `newManagerId` create a cycle? True if
// the new manager IS the person, or is somewhere in the person's own subtree
// (making a node report to its own descendant). Guards every re-parent.
export function wouldCreateCycle(people: Person[], id: string, newManagerId: string | null): boolean {
  if (newManagerId === null) return false;
  if (newManagerId === id) return true;
  // Walk up from newManagerId; if we reach `id`, `id` is an ancestor of the
  // proposed manager, so the manager is in id's subtree -> cycle.
  const byId = new Map(people.map((p) => [p.id, p]));
  let cur: string | null = newManagerId;
  const seen = new Set<string>();
  while (cur !== null) {
    if (cur === id) return true;
    if (seen.has(cur)) break; // pre-existing cycle in data — stop rather than loop forever
    seen.add(cur);
    cur = byId.get(cur)?.managerId ?? null;
  }
  return false;
}

// ---------------------------------------------------------------------------
// ponytail: one self-check on the only non-trivial logic here — cycle
// detection. Run:  npx tsx src/lib/org-chart/types.ts
// Guard is a no-op in the browser (process is undefined), so it never runs in
// the Astro bundle.
// ---------------------------------------------------------------------------
declare const process: any;
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('types.ts')) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  const p = (id: string, managerId: string | null): Person => ({ id, name: id, managerId });
  const people = [p('ceo', null), p('vp', 'ceo'), p('lead', 'vp')];
  assert(rootsOf(people).length === 1 && rootsOf(people)[0].id === 'ceo', 'single root');
  assert(childrenOf(people, 'ceo').length === 1, 'ceo has one direct report');
  assert(wouldCreateCycle(people, 'ceo', 'lead') === true, 'ceo reporting to its own grandchild is a cycle');
  assert(wouldCreateCycle(people, 'ceo', 'ceo') === true, 'reporting to self is a cycle');
  assert(wouldCreateCycle(people, 'vp', null) === false, 'promoting to root is never a cycle');
  assert(wouldCreateCycle(people, 'lead', 'ceo') === false, 're-parenting a leaf up the tree is fine');
  assert(rootsOf([p('a', 'ghost')]).length === 1, 'orphaned manager ref renders as a root');
  console.log('types.ts self-check passed');
}
