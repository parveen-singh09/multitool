

export type CsvRow = Record<string, string> | string[];

export interface CsvOptions {

  separator?: string;

  delimiter?: string;

  quote?: string;

  escape?: string;

  headers?: boolean | string[];

  mapHeaders?: (args: { header: string; index: number }) => string | null | false | undefined;

  mapValues?: (args: { header: string; index: number; value: string }) => unknown;

  newline?: string;

  skipLines?: number;

  skipComments?: boolean | string;

  strict?: boolean;

  maxRowBytes?: number;

  trim?: boolean;

  cast?: boolean;

  detect?: boolean;

  bom?: boolean;
}

interface Resolved {
  separator: string;
  quote: string;
  escape: string;
  headers: boolean | string[];
  mapHeaders?: CsvOptions['mapHeaders'];
  mapValues?: CsvOptions['mapValues'];
  skipLines: number;
  comment: string | null;
  strict: boolean;
  maxRowBytes: number;
  trim: boolean;
  cast: boolean;
}

function resolve(text: string, opts: CsvOptions): Resolved {
  const detect = opts.detect ?? true;
  const sep = opts.separator ?? opts.delimiter ?? (detect ? detectDelimiter(text) : ',');
  const quote = opts.quote ?? '"';
  return {
    separator: sep,
    quote,
    escape: opts.escape ?? quote,
    headers: opts.headers ?? true,
    mapHeaders: opts.mapHeaders,
    mapValues: opts.mapValues,
    skipLines: opts.skipLines ?? 0,
    comment: opts.skipComments === true ? '#' : (opts.skipComments || null),
    strict: opts.strict ?? false,
    maxRowBytes: opts.maxRowBytes ?? Number.MAX_SAFE_INTEGER,
    trim: opts.trim ?? false,
    cast: opts.cast ?? false,
  };
}

const COMMON_DELIMS = [',', ';', '\t', '|'];

export function detectDelimiter(text: string): string {
  const nl = /\r\n|\n|\r/;
  let line = '';
  for (const raw of text.split(nl)) {
    if (raw.trim() !== '') { line = raw; break; }
  }
  let best = ',';
  let bestCount = 0;
  for (const d of COMMON_DELIMS) {
    let count = 0;
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') inQ = !inQ;
      else if (c === d && !inQ) count++;
    }
    if (count > bestCount) { bestCount = count; best = d; }
  }
  return best;
}

class Machine {
  private field = '';
  private row: string[] = [];
  private inQuotes = false;
  private afterQuote = false; 
  private pendingCR = false; 
  private rowChars = 0;
  private started = false;

  constructor(private o: Resolved, private onRow: (row: string[]) => void) {}

  write(chunk: string): void {
    const { separator, quote, escape } = this.o;
    for (let i = 0; i < chunk.length; i++) {
      const c = chunk[i];

      if (this.pendingCR) {
        this.pendingCR = false;
        if (c === '\n') { continue; } 
      }

      if (this.inQuotes) {
        if (c === escape && escape !== quote) {

          const next = chunk[i + 1];
          if (next !== undefined) { this.push(next); i++; }
          else this.field += c; 
          continue;
        }
        if (c === quote) {
          if (chunk[i + 1] === quote) { this.push(quote); i++; } 
          else { this.inQuotes = false; this.afterQuote = true; }
          continue;
        }
        this.push(c);
        continue;
      }

      if (c === quote && this.field === '' && !this.afterQuote) {
        this.inQuotes = true;
        continue;
      }
      if (c === separator) {
        this.endField();
        continue;
      }
      if (c === '\n') { this.endRow(); continue; }
      if (c === '\r') { this.endRow(); this.pendingCR = true; continue; }
      this.push(c);
    }
  }

  end(): void {
    if (this.pendingCR) this.pendingCR = false;

    if (this.field !== '' || this.row.length > 0 || this.inQuotes) {
      this.endRow();
    }
  }

  private push(c: string): void {
    this.field += c;
    if (++this.rowChars > this.o.maxRowBytes) {
      throw new Error(`Row exceeds maxRowBytes (${this.o.maxRowBytes})`);
    }
  }

  private endField(): void {
    this.row.push(this.finishField());
    this.field = '';
    this.afterQuote = false;
  }

  private finishField(): string {
    let v = this.field;
    if (this.o.trim && !this.afterQuote) v = v.trim();
    return v;
  }

  private endRow(): void {
    this.row.push(this.finishField());
    this.field = '';
    this.afterQuote = false;
    this.rowChars = 0;
    const out = this.row;
    this.row = [];
    this.started = true;
    this.onRow(out);
  }
}

/* ─────────────────────── header + value application ─────────────────────── */

// Wraps a Machine to apply skipLines, comments, header extraction, mapHeaders,
// mapValues, casting, and strict checking — turning raw string[] rows into the
// caller's chosen row shape (objects or arrays).
class RowShaper {
  private skipLeft: number;
  private headerNames: string[] | null = null;
  private headerFromFirstRow: boolean;
  private colMask: number[] | null = null; // surviving column indices after mapHeaders
  rowCount = 0;

  constructor(private o: Resolved, private emit: (row: CsvRow) => void) {
    this.skipLeft = o.skipLines;
    if (Array.isArray(o.headers)) {
      this.headerFromFirstRow = false;
      this.setHeaders(o.headers);
    } else {
      this.headerFromFirstRow = o.headers === true;
    }
  }

  get headers(): string[] | null {
    return this.headerNames;
  }

  feed(cells: string[]): void {
    if (this.skipLeft > 0) { this.skipLeft--; return; }
    if (this.o.comment !== null && cells.length > 0 && cells[0].startsWith(this.o.comment)) return;

    if (this.headerFromFirstRow && this.headerNames === null) {
      this.setHeaders(cells);
      return;
    }

    if (this.headerNames === null) {
      // No headers: emit arrays (optionally cast).
      this.emit(this.o.cast ? (cells.map((v) => String(castValue(v))) as string[]) : cells);
      this.rowCount++;
      return;
    }

    if (this.o.strict && cells.length !== (this.colMask ? this.colMask.length : this.headerNames.length)) {
      throw new Error(
        `Row ${this.rowCount + 1} has ${cells.length} columns; expected ${this.headerNames.length}`,
      );
    }

    const obj: Record<string, unknown> = {};
    const idxs = this.colMask ?? this.headerNames.map((_, i) => i);
    for (let h = 0; h < this.headerNames.length; h++) {
      const srcIdx = idxs[h];
      const name = this.headerNames[h];
      let value: unknown = cells[srcIdx] ?? '';
      if (this.o.mapValues) {
        value = this.o.mapValues({ header: name, index: srcIdx, value: value as string });
      } else if (this.o.cast) {
        value = castValue(value as string);
      }
      obj[name] = value;
    }
    this.emit(obj as CsvRow);
    this.rowCount++;
  }

  private setHeaders(raw: string[]): void {
    const names: string[] = [];
    const mask: number[] = [];
    raw.forEach((h, index) => {
      let name: string | null | false | undefined = h;
      if (this.o.mapHeaders) name = this.o.mapHeaders({ header: h, index });
      if (name === null || name === false || name === undefined) return; // dropped column
      names.push(String(name));
      mask.push(index);
    });
    this.headerNames = names;
    this.colMask = mask;
  }
}

// Coerce an unquoted cell into number/boolean where unambiguous, else keep the string.
export function castValue(v: string): string | number | boolean {
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v !== '' && /^[+-]?\d+$/.test(v)) {
    const n = Number(v);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?$/.test(v) && /[.eE]/.test(v)) {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return v;
}

/* ──────────────────────────── public: parse ──────────────────────────── */

/** Parse a whole CSV string into an array of rows (objects by default, arrays if `headers:false`). */
export function parse<T extends CsvRow = CsvRow>(text: string, opts: CsvOptions = {}): T[] {
  let s = text;
  if ((opts.bom ?? true) && s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = resolve(s, opts);
  const out: T[] = [];
  const shaper = new RowShaper(o, (r) => out.push(r as T));
  const machine = new Machine(o, (cells) => shaper.feed(cells));
  machine.write(s);
  machine.end();
  return out;
}

/** Parse into a raw matrix of string cells — no header/casting logic. Handy for grids. */
export function parseMatrix(text: string, opts: CsvOptions = {}): string[][] {
  let s = text;
  if ((opts.bom ?? true) && s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = resolve(s, opts);
  const out: string[][] = [];
  const machine = new Machine(o, (cells) => out.push(cells));
  machine.write(s);
  machine.end();
  return out;
}

/* ──────────────────────── public: incremental push ──────────────────────── */

export interface PushParser {
  /** Feed a chunk of CSV text. Rows complete inside a chunk are emitted immediately. */
  write(chunk: string): void;
  /** Flush the final buffered row. Call once when input is done. */
  end(): void;
  /** Headers seen so far (null until the header row is parsed). */
  readonly headers: string[] | null;
}

/**
 * Create an incremental parser that calls `onRow` for each completed row.
 * Chunk boundaries may fall anywhere — mid-field, mid-quote, mid-\r\n.
 * This is the framework-free analogue of csv-parser's stream, usable with
 * fetch() ReadableStream readers, File.stream(), etc.
 */
export function createParser(
  onRow: (row: CsvRow) => void,
  opts: CsvOptions = {},
): PushParser {
  // Without a full sample we can't auto-detect reliably; default to ',' unless told.
  const o = resolve('', { ...opts, detect: opts.separator || opts.delimiter ? false : (opts.detect ?? false) });
  let bomChecked = !(opts.bom ?? true);
  const shaper = new RowShaper(o, onRow);
  const machine = new Machine(o, (cells) => shaper.feed(cells));
  return {
    write(chunk: string) {
      if (!bomChecked) {
        bomChecked = true;
        if (chunk.charCodeAt(0) === 0xfeff) chunk = chunk.slice(1);
      }
      machine.write(chunk);
    },
    end() {
      machine.end();
    },
    get headers() {
      return shaper.headers;
    },
  };
}

/* ─────────────────────── public: Web Streams + async ─────────────────────── */

/**
 * A TransformStream<string, CsvRow> for the modern streaming pipeline, e.g.:
 *   file.stream().pipeThrough(new TextDecoderStream()).pipeThrough(csvTransform())
 */
export function csvTransform(opts: CsvOptions = {}): TransformStream<string, CsvRow> {
  let parser: PushParser;
  return new TransformStream<string, CsvRow>({
    start(controller) {
      parser = createParser((row) => controller.enqueue(row), opts);
    },
    transform(chunk) {
      parser.write(chunk);
    },
    flush() {
      parser.end();
    },
  });
}

/** Async-iterate rows from any async iterable of text chunks (fetch bodies, files, generators). */
export async function* parseStream(
  chunks: AsyncIterable<string>,
  opts: CsvOptions = {},
): AsyncGenerator<CsvRow> {
  const queue: CsvRow[] = [];
  const parser = createParser((row) => queue.push(row), opts);
  for await (const chunk of chunks) {
    parser.write(chunk);
    while (queue.length) yield queue.shift()!;
  }
  parser.end();
  while (queue.length) yield queue.shift()!;
}

/* ──────────────────────────── public: stringify ──────────────────────────── */

export interface StringifyOptions {
  separator?: string;
  delimiter?: string;
  quote?: string;
  /** Newline between rows. Default '\n'. */
  newline?: string;
  /** Write a header row from object keys. Default true for object input. */
  header?: boolean;
  /** Explicit column order / header names. */
  columns?: string[];
  /** Quote every field, not just those that need it. Default false. */
  quoteAll?: boolean;
  /** Value used for null/undefined. Default ''. */
  nullValue?: string;
  /** Append a trailing newline. Default false. */
  eof?: boolean;
}

function needsQuote(s: string, sep: string, quote: string): boolean {
  return s.includes(sep) || s.includes(quote) || s.includes('\n') || s.includes('\r');
}

function encodeField(v: unknown, sep: string, quote: string, quoteAll: boolean, nullValue: string): string {
  let s: string;
  if (v === null || v === undefined) s = nullValue;
  else if (typeof v === 'object') s = JSON.stringify(v);
  else s = String(v);
  if (quoteAll || needsQuote(s, sep, quote)) {
    return quote + s.split(quote).join(quote + quote) + quote;
  }
  return s;
}

/** Serialize rows (array of objects, or array of arrays) back into CSV text. */
export function stringify(
  rows: Array<Record<string, unknown>> | unknown[][],
  opts: StringifyOptions = {},
): string {
  const sep = opts.separator ?? opts.delimiter ?? ',';
  const quote = opts.quote ?? '"';
  const nl = opts.newline ?? '\n';
  const quoteAll = opts.quoteAll ?? false;
  const nullValue = opts.nullValue ?? '';
  const out: string[] = [];

  const isArrayRows = rows.length > 0 && Array.isArray(rows[0]);

  if (isArrayRows) {
    for (const row of rows as unknown[][]) {
      out.push(row.map((v) => encodeField(v, sep, quote, quoteAll, nullValue)).join(sep));
    }
  } else {
    const objRows = rows as Array<Record<string, unknown>>;
    // Column union preserving first-seen order, unless explicit columns given.
    let cols = opts.columns;
    if (!cols) {
      const seen = new Set<string>();
      cols = [];
      for (const r of objRows) for (const k of Object.keys(r)) if (!seen.has(k)) { seen.add(k); cols.push(k); }
    }
    if (opts.header ?? true) {
      out.push(cols.map((c) => encodeField(c, sep, quote, quoteAll, nullValue)).join(sep));
    }
    for (const r of objRows) {
      out.push(cols.map((c) => encodeField(r[c], sep, quote, quoteAll, nullValue)).join(sep));
    }
  }

  let text = out.join(nl);
  if (opts.eof) text += nl;
  return text;
}
