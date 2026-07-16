

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export function coerceScalar(raw: string): Json {
  const t = raw.trim();
  if (t === '' || t === '~' || t === 'null' || t === 'Null' || t === 'NULL') return null;
  if (t === 'true' || t === 'True' || t === 'TRUE') return true;
  if (t === 'false' || t === 'False' || t === 'FALSE') return false;

  if ((t.startsWith('"') && t.endsWith('"') && t.length >= 2) ||
      (t.startsWith("'") && t.endsWith("'") && t.length >= 2)) {
    return unquote(t);
  }

  if (/^[+-]?\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?$/.test(t) && /[.eE]/.test(t)) {
    const n = Number(t);
    if (!Number.isNaN(n)) return n;
  }
  return t;
}

export function unquote(t: string): string {
  const q = t[0];
  const body = t.slice(1, -1);
  if (q === "'") return body.replace(/''/g, "'"); 

  return body.replace(/\\(["\\/nrtbf]|u[0-9a-fA-F]{4})/g, (_m, esc: string) => {
    switch (esc[0]) {
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      case 'b': return '\b';
      case 'f': return '\f';
      case '/': return '/';
      case '"': return '"';
      case '\\': return '\\';
      case 'u': return String.fromCharCode(parseInt(esc.slice(1), 16));
      default: return esc;
    }
  });
}

interface YamlLine {
  indent: number;
  content: string;
  raw: string;
  lineNo: number;
}

export function parseYaml(text: string): Json {
  const lines: YamlLine[] = [];
  const src = text.replace(/\r\n?/g, '\n').split('\n');
  for (let i = 0; i < src.length; i++) {
    const raw = src[i];
    const stripped = stripYamlComment(raw);
    if (stripped.trim() === '' || stripped.trim() === '---') continue;
    const indent = raw.length - raw.replace(/^\s+/, '').length;
    lines.push({ indent, content: stripped.trim(), raw, lineNo: i + 1 });
  }
  if (lines.length === 0) return null;
  const [value] = parseYamlBlock(lines, 0, lines[0].indent);
  return value;
}

function stripYamlComment(line: string): string {
  let inS = false, inD = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD && (i === 0 || /\s/.test(line[i - 1]))) {
      return line.slice(0, i);
    }
  }
  return line;
}

function parseYamlBlock(lines: YamlLine[], start: number, indent: number): [Json, number] {
  if (start >= lines.length) return [null, start];
  const first = lines[start];
  if (first.content.startsWith('- ') || first.content === '-') {
    return parseYamlList(lines, start, indent);
  }
  return parseYamlMap(lines, start, indent);
}

function parseYamlList(lines: YamlLine[], start: number, indent: number): [Json[], number] {
  const arr: Json[] = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < indent) break;
    if (line.indent > indent) throw yamlError(line, 'unexpected indentation in list');
    if (!(line.content === '-' || line.content.startsWith('- '))) break;
    const rest = line.content === '-' ? '' : line.content.slice(2).trim();
    if (rest === '') {

      const [val, next] = parseYamlBlock(lines, i + 1, lines[i + 1]?.indent ?? indent + 1);
      arr.push(val);
      i = next;
    } else if (/^[^:\s"'{[][^:]*:(\s|$)/.test(rest) || /^["'].*["']\s*:/.test(rest)) {

      const itemIndent = line.indent + 2;
      const synthetic: YamlLine[] = [{ ...line, indent: itemIndent, content: rest }];
      let j = i + 1;
      while (j < lines.length && lines[j].indent > line.indent) { synthetic.push(lines[j]); j++; }
      const [val] = parseYamlMap(synthetic, 0, itemIndent);
      arr.push(val);
      i = j;
    } else {
      arr.push(parseYamlScalar(rest));
      i++;
    }
  }
  return [arr, i];
}

function parseYamlMap(lines: YamlLine[], start: number, indent: number): [{ [k: string]: Json }, number] {
  const obj: { [k: string]: Json } = {};
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < indent) break;
    if (line.indent > indent) throw yamlError(line, 'unexpected indentation in map');
    if (line.content.startsWith('- ') || line.content === '-') break;
    const { key, rest } = splitYamlKey(line);
    if (rest === '') {
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.indent > indent) {
        const [val, next] = parseYamlBlock(lines, i + 1, nextLine.indent);
        obj[key] = val;
        i = next;
      } else {
        obj[key] = null;
        i++;
      }
    } else {
      obj[key] = parseYamlScalar(rest);
      i++;
    }
  }
  return [obj, i];
}

function splitYamlKey(line: YamlLine): { key: string; rest: string } {
  const s = line.content;
  let inS = false, inD = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === ':' && !inS && !inD && (i + 1 >= s.length || /\s/.test(s[i + 1]))) {
      const rawKey = s.slice(0, i).trim();
      const key = (rawKey.startsWith('"') || rawKey.startsWith("'")) ? unquote(rawKey) : rawKey;
      return { key, rest: s.slice(i + 1).trim() };
    }
  }
  throw yamlError(line, 'expected "key: value"');
}

function parseYamlScalar(token: string): Json {
  const t = token.trim();
  if (t.startsWith('[') || t.startsWith('{')) return parseYamlFlow(t);
  if (t === '|' || t === '>') return ''; 
  return coerceScalar(t);
}

function parseYamlFlow(t: string): Json {

  try {
    return JSON.parse(t) as Json;
  } catch {

    if (t.startsWith('[')) {
      const inner = t.slice(1, -1).trim();
      if (inner === '') return [];
      return splitFlow(inner).map((s) => parseYamlScalar(s));
    }
    const inner = t.slice(1, -1).trim();
    if (inner === '') return {};
    const obj: { [k: string]: Json } = {};
    for (const part of splitFlow(inner)) {
      const idx = part.indexOf(':');
      if (idx === -1) continue;
      const k = part.slice(0, idx).trim();
      const key = (k.startsWith('"') || k.startsWith("'")) ? unquote(k) : k;
      obj[key] = parseYamlScalar(part.slice(idx + 1));
    }
    return obj;
  }
}

function splitFlow(s: string): string[] {
  const out: string[] = [];
  let depth = 0, inS = false, inD = false, cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (!inS && !inD && (c === '[' || c === '{')) depth++;
    else if (!inS && !inD && (c === ']' || c === '}')) depth--;
    else if (c === ',' && !inS && !inD && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() !== '') out.push(cur);
  return out;
}

function yamlError(line: YamlLine, msg: string): Error {
  return new Error(`YAML error on line ${line.lineNo}: ${msg}`);
}


export function detectDelimiter(text: string): ',' | ';' | '\t' {
  const line = text.replace(/\r\n?/g, '\n').split('\n').find((l) => l.trim() !== '') ?? '';
  const counts: [string, number][] = [
    [',', (line.match(/,/g) || []).length],
    [';', (line.match(/;/g) || []).length],
    ['\t', (line.match(/\t/g) || []).length],
  ];
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? (counts[0][0] as ',' | ';' | '\t') : ',';
}

export function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const s = text.replace(/\r\n?/g, '\n');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r, idx) => !(idx === rows.length - 1 && r.length === 1 && r[0] === ''));
}

export function csvToJson(text: string, delimiter: string, hasHeader: boolean): Json {
  const matrix = parseCsv(text, delimiter);
  if (matrix.length === 0) return [];
  if (!hasHeader) {
    return matrix.map((row) => row.map((cell) => csvCell(cell)));
  }
  const header = matrix[0];
  return matrix.slice(1).map((row) => {
    const obj: { [k: string]: Json } = {};
    header.forEach((h, idx) => { obj[h] = csvCell(row[idx] ?? ''); });
    return obj;
  });
}

function csvCell(v: string): Json {
  if (v === '') return '';
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^[+-]?\d+$/.test(v)) {
    const n = Number(v);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?$/.test(v) && /[.eE]/.test(v)) {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return v;
}


function flattenOneLevel(obj: { [k: string]: Json }): { [k: string]: Json } {
  const out: { [k: string]: Json } = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v)) out[`${k}.${k2}`] = v2;
    } else {
      out[k] = v;
    }
  }
  return out;
}

function csvValue(v: Json): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function quoteField(s: string, delimiter: string): string {
  if (s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(delimiter)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function jsonToCsv(data: Json, delimiter: string): string {
  if (!Array.isArray(data)) {
    throw new Error('Input must be a JSON array of objects.');
  }
  const rows = data.map((item) => {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      return { value: item } as { [k: string]: Json };
    }
    return flattenOneLevel(item as { [k: string]: Json });
  });
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    for (const k of Object.keys(r)) {
      if (!seen.has(k)) { seen.add(k); keys.push(k); }
    }
  }
  const lines: string[] = [];
  lines.push(keys.map((k) => quoteField(k, delimiter)).join(delimiter));
  for (const r of rows) {
    lines.push(keys.map((k) => quoteField(csvValue(r[k] ?? null), delimiter)).join(delimiter));
  }
  return lines.join('\n');
}


export function jsonToYaml(data: Json, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (Array.isArray(data)) {
    if (!data.length) return `${pad}[]\n`;
    return data.map((v) => {
      if (v !== null && typeof v === 'object' && (Array.isArray(v) ? v.length : Object.keys(v).length))
        return `${pad}-\n${jsonToYaml(v, indent + 1)}`;
      return `${pad}- ${yamlScalar(v)}\n`;
    }).join('');
  }
  if (data !== null && typeof data === 'object') {
    const keys = Object.keys(data);
    if (!keys.length) return `${pad}{}\n`;
    return keys.map((k) => {
      const v = (data as { [k: string]: Json })[k];
      const key = /^[\w.-]+$/.test(k) ? k : JSON.stringify(k);
      if (v !== null && typeof v === 'object' && (Array.isArray(v) ? v.length : Object.keys(v).length))
        return `${pad}${key}:\n${jsonToYaml(v, indent + 1)}`;
      if (v !== null && typeof v === 'object')
        return `${pad}${key}: ${Array.isArray(v) ? '[]' : '{}'}\n`;
      return `${pad}${key}: ${yamlScalar(v)}\n`;
    }).join('');
  }
  return `${pad}${yamlScalar(data)}\n`;
}

function yamlScalar(v: Json): string {
  if (v === null) return 'null';
  if (typeof v === 'string') return /[:#\-{}[\],&*!|>'"%@`]|^\s|\s$|^$|^(true|false|null|~)$|^[+-]?\d/.test(v) ? JSON.stringify(v) : v;
  return String(v);
}

const xmlEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function xmlBody(obj: Json, indent: number): string {
  const pad = '  '.repeat(indent);
  if (obj === null) return '';
  if (Array.isArray(obj)) return obj.map((v) => `${pad}<item>\n${xmlBody(v, indent + 1)}${pad}</item>\n`).join('');
  if (typeof obj === 'object') {
    return Object.entries(obj).map(([k, v]) => {
      const tag = k.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/^[^a-zA-Z_]/, '_');
      if (v !== null && typeof v === 'object') return `${pad}<${tag}>\n${xmlBody(v, indent + 1)}${pad}</${tag}>\n`;
      return `${pad}<${tag}>${xmlEsc(String(v))}</${tag}>\n`;
    }).join('');
  }
  return `${pad}${xmlEsc(String(obj))}\n`;
}

export function jsonToXml(data: Json): string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' + xmlBody(data, 1) + '</root>';
}


export function parseToml(text: string): Json {
  const root: { [k: string]: Json } = {};
  let current = root;
  const src = text.replace(/\r\n?/g, '\n').split('\n');
  for (let i = 0; i < src.length; i++) {
    const line = stripTomlComment(src[i]).trim();
    if (line === '') continue;
    const lineNo = i + 1;
    if (line.startsWith('[[') && line.endsWith(']]')) {
      const path = parseTablePath(line.slice(2, -2).trim(), lineNo);
      current = descendArrayTable(root, path, lineNo);
    } else if (line.startsWith('[') && line.endsWith(']')) {
      const path = parseTablePath(line.slice(1, -1).trim(), lineNo);
      current = descendTable(root, path, lineNo);
    } else {
      const eq = findTomlEquals(line);
      if (eq === -1) throw new Error(`TOML error on line ${lineNo}: expected "key = value"`);
      const rawKey = line.slice(0, eq).trim();
      const key = tomlKey(rawKey);
      const val = parseTomlValue(line.slice(eq + 1).trim(), lineNo);
      current[key] = val;
    }
  }
  return root;
}

function stripTomlComment(line: string): string {
  let inS = false, inD = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD) return line.slice(0, i);
  }
  return line;
}

function findTomlEquals(line: string): number {
  let inS = false, inD = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '=' && !inS && !inD) return i;
  }
  return -1;
}

function tomlKey(raw: string): string {
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return unquote(raw);
  }
  return raw;
}

function parseTablePath(raw: string, lineNo: number): string[] {
  if (raw === '') throw new Error(`TOML error on line ${lineNo}: empty table name`);
  const parts: string[] = [];
  let cur = '', inS = false, inD = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    if (c === '.' && !inS && !inD) { parts.push(cur.trim()); cur = ''; }
    else cur += c;
  }
  parts.push(cur.trim());
  return parts.map((p) => tomlKey(p));
}

function descendTable(root: { [k: string]: Json }, path: string[], lineNo: number): { [k: string]: Json } {
  let node: { [k: string]: Json } = root;
  for (const key of path) {
    if (!(key in node)) node[key] = {};
    const child = node[key];
    if (Array.isArray(child)) {
      const last = child[child.length - 1];
      if (last === null || typeof last !== 'object' || Array.isArray(last)) {
        throw new Error(`TOML error on line ${lineNo}: cannot redefine "${key}"`);
      }
      node = last as { [k: string]: Json };
    } else if (child !== null && typeof child === 'object') {
      node = child as { [k: string]: Json };
    } else {
      throw new Error(`TOML error on line ${lineNo}: key "${key}" is not a table`);
    }
  }
  return node;
}

function descendArrayTable(root: { [k: string]: Json }, path: string[], lineNo: number): { [k: string]: Json } {
  const parent = descendTable(root, path.slice(0, -1), lineNo);
  const key = path[path.length - 1];
  if (!(key in parent)) parent[key] = [];
  const arr = parent[key];
  if (!Array.isArray(arr)) throw new Error(`TOML error on line ${lineNo}: "${key}" is not an array of tables`);
  const entry: { [k: string]: Json } = {};
  arr.push(entry);
  return entry;
}

function parseTomlValue(raw: string, lineNo: number): Json {
  const t = raw.trim();
  if (t === '') throw new Error(`TOML error on line ${lineNo}: missing value`);
  if (t.startsWith('[')) {
    if (!t.endsWith(']')) throw new Error(`TOML error on line ${lineNo}: unterminated array`);
    const inner = t.slice(1, -1).trim();
    if (inner === '') return [];
    return splitFlow(inner).map((s) => parseTomlValue(s.trim(), lineNo));
  }
  if (t.startsWith('{')) {
    if (!t.endsWith('}')) throw new Error(`TOML error on line ${lineNo}: unterminated inline table`);
    const inner = t.slice(1, -1).trim();
    const obj: { [k: string]: Json } = {};
    if (inner === '') return obj;
    for (const part of splitFlow(inner)) {
      const eq = findTomlEquals(part);
      if (eq === -1) throw new Error(`TOML error on line ${lineNo}: bad inline table entry`);
      obj[tomlKey(part.slice(0, eq).trim())] = parseTomlValue(part.slice(eq + 1).trim(), lineNo);
    }
    return obj;
  }
  if ((t.startsWith('"') && t.endsWith('"') && t.length >= 2) ||
      (t.startsWith("'") && t.endsWith("'") && t.length >= 2)) {
    return unquote(t);
  }
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (/^\d{4}-\d{2}-\d{2}([Tt ].*)?$/.test(t) || /^\d{2}:\d{2}:\d{2}/.test(t)) return t;
  const cleaned = t.replace(/_/g, ''); 
  if (/^[+-]?\d+$/.test(cleaned)) {
    const n = Number(cleaned);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?$/.test(cleaned) && /[.eE]/.test(cleaned)) {
    const n = Number(cleaned);
    if (!Number.isNaN(n)) return n;
  }
  if (t === 'inf' || t === '+inf') return Infinity as unknown as Json;
  if (t === '-inf') return -Infinity as unknown as Json;
  throw new Error(`TOML error on line ${lineNo}: cannot parse value "${t}"`);
}
