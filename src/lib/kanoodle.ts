// Kanoodle (flat 2D puzzle) piece data + exact-cover solver.
//
// The board is 5 rows × 11 columns = 55 holes. The 12 standard pieces cover
// exactly 55 cells between them, so a full solution is a perfect tiling that
// uses every piece once. A puzzle gives you some pieces already placed as
// clues; the solver fits the remaining pieces into the empty cells.
//
// Piece shapes and colors match the physical Kanoodle set. Shapes are authored
// as row-major 0/1 matrices for legibility, then compiled to cell-coordinate
// lists on load.

export type Cell = [number, number]; // [row, col]

export interface Piece {
  /** Single-character id, also used as the letter drawn on cells. */
  id: string;
  /** Human-friendly label. */
  name: string;
  /** Fill color (matches the real piece). */
  color: string;
  /** Base cells, normalized so the bounding box starts at (0,0). */
  cells: Cell[];
}

export const ROWS = 5;
export const COLS = 11;

// Authored shapes → the canonical Kanoodle color for each piece. These are the
// 12 standard pieces; their cells sum to exactly 55 = the full board.
const RAW: { id: string; name: string; color: string; shape: number[][] }[] = [
  { id: 'A', name: 'Orange',     color: '#FA430A', shape: [[1, 1, 1], [1, 0, 0]] },              // 4
  { id: 'B', name: 'Dark blue',  color: '#033699', shape: [[1, 1, 1, 1], [0, 0, 0, 1]] },        // 5 (L)
  { id: 'C', name: 'Green',      color: '#72E946', shape: [[1, 1], [1, 1]] },                    // 4 (O)
  { id: 'D', name: 'Tan',        color: '#A3987F', shape: [[1, 1], [1, 0]] },                    // 3 (corner)
  { id: 'E', name: 'Dark green', color: '#10783A', shape: [[1, 1, 0, 0], [0, 1, 1, 1]] },        // 5 (N)
  { id: 'F', name: 'Light teal', color: '#A2DDD7', shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },   // 5 (V)
  { id: 'G', name: 'Red',        color: '#B90006', shape: [[1, 1], [1, 1], [1, 0]] },            // 5 (P)
  { id: 'H', name: 'Yellow',     color: '#FEE01F', shape: [[1, 1], [1, 0], [1, 1]] },            // 5 (U)
  { id: 'I', name: 'Magenta',    color: '#F13679', shape: [[1, 0, 0], [1, 1, 0], [0, 1, 1]] },   // 5 (W)
  { id: 'J', name: 'Silver',     color: '#7A8184', shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },   // 5 (X/plus)
  { id: 'K', name: 'Peach',      color: '#FDD7CB', shape: [[0, 1], [1, 1], [0, 1], [0, 1]] },    // 5 (Y)
  { id: 'L', name: 'Purple',     color: '#612690', shape: [[1], [1], [1], [1]] },                // 4 (I)
];

/** Normalize a set of cells so the bounding box starts at (0,0); sorted row-major. */
function normalize(cells: Cell[]): Cell[] {
  const minR = Math.min(...cells.map((p) => p[0]));
  const minC = Math.min(...cells.map((p) => p[1]));
  return cells
    .map(([r, c]) => [r - minR, c - minC] as Cell)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function shapeToCells(shape: number[][]): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++) if (shape[r][c]) cells.push([r, c]);
  return normalize(cells);
}

export const PIECES: Piece[] = RAW.map((p) => ({
  id: p.id,
  name: p.name,
  color: p.color,
  cells: shapeToCells(p.shape),
}));

export const PIECE_BY_ID: Record<string, Piece> = Object.fromEntries(
  PIECES.map((p) => [p.id, p]),
);

const key = (cells: Cell[]) => cells.map((p) => p.join(',')).join(';');

/**
 * All unique orientations of a piece (4 rotations × 2 reflections, deduped),
 * each normalized to the (0,0) origin and sorted row-major so orient[0] is the
 * topmost-leftmost cell.
 */
export function orientations(cells: Cell[]): Cell[][] {
  const seen = new Set<string>();
  const out: Cell[][] = [];
  let cur: Cell[] = cells.map(([r, c]) => [r, c]);
  for (let refl = 0; refl < 2; refl++) {
    for (let rot = 0; rot < 4; rot++) {
      const n = normalize(cur);
      const k = key(n);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(n);
      }
      cur = cur.map(([r, c]) => [c, -r] as Cell); // rotate 90°
    }
    cur = cur.map(([r, c]) => [r, -c] as Cell); // reflect horizontally
  }
  return out;
}

const ORIENTS: Record<string, Cell[][]> = Object.fromEntries(
  PIECES.map((p) => [p.id, orientations(p.cells)]),
);

export function orientationsOf(id: string): Cell[][] {
  return ORIENTS[id] ?? [];
}

/**
 * Apply an explicit flip (mirror across the vertical axis) then `rot` × 90°
 * clockwise rotations, normalized to the origin. Used by the UI so each piece
 * can carry its own {rot, flip} state driven by dedicated Rotate/Flip buttons.
 */
export function transformCells(cells: Cell[], rot: number, flip: boolean): Cell[] {
  let pts: Cell[] = cells.map(([r, c]) => (flip ? [r, -c] : [r, c]));
  const turns = ((rot % 4) + 4) % 4;
  for (let i = 0; i < turns; i++) pts = pts.map(([r, c]) => [c, -r] as Cell);
  return normalize(pts);
}

/**
 * A board is ROWS×COLS. Each cell is either null (empty) or a piece id string
 * (already placed). The solver leaves placed pieces untouched and fills the
 * empties using the pieces that aren't on the board yet.
 */
export type Board = (string | null)[][];

export function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<string | null>(COLS).fill(null));
}

export function cloneBoard(b: Board): Board {
  return b.map((row) => row.slice());
}

function firstEmpty(b: Board): Cell | null {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (b[r][c] === null) return [r, c];
  return null;
}

export interface SolveOptions {
  /** Abort after this many search nodes (guards against pathological inputs). */
  nodeLimit?: number;
  /** Piece order to try (defaults to the natural order). */
  order?: string[];
}

export interface SolveResult {
  /** Filled board if solved, else null. */
  board: Board | null;
  /** Whether the search hit its node limit before finishing. */
  timedOut: boolean;
  nodes: number;
}

/**
 * Fill every empty cell using the pieces not already on the board. Returns the
 * first complete tiling found, or null if none exists.
 */
export function solve(board: Board, opts: SolveOptions = {}): SolveResult {
  const nodeLimit = opts.nodeLimit ?? 5_000_000;
  const b = cloneBoard(board);

  // Pieces already on the board are considered used.
  const onBoard = new Set<string>();
  for (const row of b) for (const v of row) if (v) onBoard.add(v);

  const order = (opts.order ?? PIECES.map((p) => p.id)).filter((id) => !onBoard.has(id));

  let nodes = 0;
  let timedOut = false;

  function place(id: string, orient: Cell[], r: number, c: number, ar: number, ac: number): Cell[] | null {
    const put: Cell[] = [];
    for (const [pr, pc] of orient) {
      const gr = r + (pr - ar);
      const gc = c + (pc - ac);
      if (gr < 0 || gr >= ROWS || gc < 0 || gc >= COLS || b[gr][gc] !== null) return null;
      put.push([gr, gc]);
    }
    for (const [gr, gc] of put) b[gr][gc] = id;
    return put;
  }

  function recurse(remaining: string[]): boolean {
    if (nodes++ > nodeLimit) {
      timedOut = true;
      return false;
    }
    const spot = firstEmpty(b);
    if (!spot) return true; // fully tiled
    const [r, c] = spot;

    for (let i = 0; i < remaining.length; i++) {
      const id = remaining[i];
      const rest = remaining.slice(0, i).concat(remaining.slice(i + 1));
      for (const orient of ORIENTS[id]) {
        // orient[0] is the topmost-leftmost cell — the one that must cover the
        // first empty cell (any earlier cell would land on an already-filled spot).
        const [ar, ac] = orient[0];
        const put = place(id, orient, r, c, ar, ac);
        if (!put) continue;
        if (recurse(rest)) return true;
        for (const [gr, gc] of put) b[gr][gc] = null;
      }
    }
    return false;
  }

  const solved = recurse(order);
  return { board: solved ? b : null, timedOut, nodes };
}

/** True if the current board can be completed with the remaining pieces. */
export function isSolvable(board: Board, opts: SolveOptions = {}): boolean {
  return solve(board, opts).board !== null;
}

/**
 * Solve, then return one piece placement that isn't on the board yet — the set
 * of cells to fill and which piece fills them. Null if unsolvable or complete.
 */
export interface Hint {
  id: string;
  cells: Cell[];
}

export function hint(board: Board, opts: SolveOptions = {}): Hint | null {
  const res = solve(board, opts);
  if (!res.board) return null;
  const onBoard = new Set<string>();
  for (const row of board) for (const v of row) if (v) onBoard.add(v);

  // Find a solution piece not already placed; return its cells.
  const cellsById = new Map<string, Cell[]>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const id = res.board[r][c];
      if (id && !onBoard.has(id)) {
        if (!cellsById.has(id)) cellsById.set(id, []);
        cellsById.get(id)!.push([r, c]);
      }
    }
  }
  const first = cellsById.entries().next().value;
  return first ? { id: first[0], cells: first[1] } : null;
}
