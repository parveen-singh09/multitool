

type Row = Record<string, unknown>;

function flatten(obj: Row, prefix = '', out: Row = {}): Row {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v as Row, key, out);
    else out[key] = Array.isArray(v) ? v.join('; ') : v;
  }
  return out;
}

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV(rows: Row[]): string {
  if (!rows.length) return '';
  const flat = rows.map((r) => flatten(r));
  const cols = [...new Set(flat.flatMap((r) => Object.keys(r)))];
  const head = cols.map(csvCell).join(',');
  const body = flat.map((r) => cols.map((c) => csvCell(r[c])).join(','));
  return [head, ...body].join('\r\n');
}

function xmlEscape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
}

function xmlNode(key: string, val: unknown, indent: string): string {

  const tag = /^[A-Za-z_]/.test(key) ? key : `_${key}`;
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const inner = Object.entries(val as Row)
      .map(([k, v]) => xmlNode(k, v, indent + '  ')).join('\n');
    return `${indent}<${tag}>\n${inner}\n${indent}</${tag}>`;
  }
  return `${indent}<${tag}>${xmlEscape(val == null ? '' : String(val))}</${tag}>`;
}

export function toXML(rows: Row[], root = 'users', item = 'user'): string {
  const body = rows
    .map((r) => `  <${item}>\n${Object.entries(r).map(([k, v]) => xmlNode(k, v, '    ')).join('\n')}\n  </${item}>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${root}>\n${body}\n</${root}>`;
}

function yamlScalar(v: unknown): string {
  if (v == null) return 'null';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  const s = String(v);
  // Quote when the value could be misread as non-string YAML, has specials, or
  // contains control chars (newlines/tabs) that would break block layout.
  return /^\s|\s$|[\n\r\t:#\-?&*!|>'"%@`{}\[\],]|^(true|false|null|~|\d)/i.test(s)
    ? `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`
    : s;
}

function yamlNode(val: unknown, indent: string): string {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return '\n' + Object.entries(val as Row)
      .map(([k, v]) => `${indent}${k}:${
        v && typeof v === 'object' && !Array.isArray(v) ? yamlNode(v, indent + '  ') : ' ' + yamlScalar(v)
      }`).join('\n');
  }
  return ' ' + yamlScalar(val);
}

export function toYAML(rows: Row[]): string {
  return rows.map((r) =>
    '-' + Object.entries(r).map(([k, v], i) =>
      `${i === 0 ? ' ' : '  '}${k}:${
        v && typeof v === 'object' && !Array.isArray(v) ? yamlNode(v, '    ') : ' ' + yamlScalar(v)
      }`).join('\n')
  ).join('\n');
}

// CREATE TABLE + INSERTs. Column SQL type is inferred from the data:
// all-number -> INT/DECIMAL, all-boolean -> BOOLEAN, else VARCHAR(255).
// ponytail: single generic dialect; add per-dialect (MySQL/Postgres) only if asked.
export function toSQL(rows: Row[], table = 'mock_data'): string {
  const flat = rows.map((r) => flatten(r));
  const cols = [...new Set(flat.flatMap((r) => Object.keys(r)))];
  if (!cols.length) return '';

  const sqlType = (c: string): string => {
    const vals = flat.map((r) => r[c]).filter((v) => v != null && v !== '');
    if (vals.length && vals.every((v) => typeof v === 'boolean')) return 'BOOLEAN';
    if (vals.length && vals.every((v) => typeof v === 'number')) {
      return vals.every((v) => Number.isInteger(v)) ? 'INT' : 'DECIMAL(12,4)';
    }
    return 'VARCHAR(255)';
  };
  const ident = (s: string) => `\`${s.replace(/`/g, '')}\``;
  const cell = (v: unknown): string => {
    if (v == null) return 'NULL';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    return `'${String(v).replace(/'/g, "''")}'`;
  };

  const create = `CREATE TABLE ${ident(table)} (\n` +
    cols.map((c) => `  ${ident(c)} ${sqlType(c)}`).join(',\n') + '\n);';
  const colList = cols.map(ident).join(', ');
  const inserts = flat.map((r) =>
    `INSERT INTO ${ident(table)} (${colList}) VALUES (${cols.map((c) => cell(r[c])).join(', ')});`);
  return [create, '', ...inserts].join('\n');
}

export type Format = 'json' | 'csv' | 'xml' | 'yaml' | 'sql';

export function serialize(rows: Row[], fmt: Format, table?: string): string {
  if (fmt === 'csv') return toCSV(rows);
  if (fmt === 'xml') return toXML(rows);
  if (fmt === 'yaml') return toYAML(rows);
  if (fmt === 'sql') return toSQL(rows, table);
  return JSON.stringify(rows, null, 2);
}

export const MIME: Record<Format, string> = {
  json: 'application/json', csv: 'text/csv', xml: 'application/xml', yaml: 'text/yaml', sql: 'text/plain',
};
