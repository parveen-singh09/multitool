import { format, type SqlLanguage } from 'sql-formatter';

export interface Issue {
  level: 'error' | 'warning';
  msg: string;
  line?: number;
}

export interface Result {
  issues: Issue[];
  statementCount: number;
}

export const DIALECTS: { value: SqlLanguage; label: string }[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'transactsql', label: 'SQL Server (T-SQL)' },
  { value: 'plsql', label: 'Oracle (PL/SQL)' },
  { value: 'db2', label: 'DB2' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'redshift', label: 'Redshift' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'spark', label: 'Spark SQL' },
  { value: 'hive', label: 'Hive' },
  { value: 'trino', label: 'Trino / Presto' },
  { value: 'duckdb', label: 'DuckDB' },
  { value: 'clickhouse', label: 'ClickHouse' },
  { value: 'tidb', label: 'TiDB' },
  { value: 'singlestoredb', label: 'SingleStore' },
  { value: 'n1ql', label: 'Couchbase N1QL' },
];

const lineAt = (s: string, i: number) => s.slice(0, i).split('\n').length;

function scan(sql: string): { code: string; issues: Issue[] } {
  const issues: Issue[] = [];
  let code = '';
  let i = 0;
  const n = sql.length;
  while (i < n) {
    const ch = sql[i];
    const two = sql.slice(i, i + 2);
    if (two === '--') {
      const end = sql.indexOf('\n', i);
      const skipped = (end === -1 ? sql.slice(i) : sql.slice(i, end)).replace(/[^\n]/g, ' ');
      code += skipped;
      i = end === -1 ? n : end;
      continue;
    }
    if (two === '/*') {
      const end = sql.indexOf('*/', i + 2);
      if (end === -1) { issues.push({ level: 'error', msg: 'Unclosed block comment ( /* … ).', line: lineAt(sql, i) }); break; }
      i = end + 2;
      code += ' ';
      continue;
    }
    if (ch === "'") {
      const start = i; i++;
      let closed = false;
      while (i < n) {
        if (sql[i] === "'" && sql[i + 1] === "'") { i += 2; continue; }
        if (sql[i] === "'") { i++; closed = true; break; }
        i++;
      }
      if (!closed) issues.push({ level: 'error', msg: "Unterminated string literal — a single quote (') is not closed.", line: lineAt(sql, start) });
      code += ' ';
      continue;
    }
    if (ch === '"') {
      const start = i; i++;
      let closed = false;
      while (i < n) { if (sql[i] === '"') { i++; closed = true; break; } i++; }
      if (!closed) issues.push({ level: 'error', msg: 'Unterminated quoted identifier/string — a double quote (") is not closed.', line: lineAt(sql, start) });
      code += ' ';
      continue;
    }
    if (ch === '`') {
      const start = i; i++;
      let closed = false;
      while (i < n) { if (sql[i] === '`') { i++; closed = true; break; } i++; }
      if (!closed) issues.push({ level: 'error', msg: 'Unterminated backtick identifier (`).', line: lineAt(sql, start) });
      code += ' ';
      continue;
    }
    code += ch;
    i++;
  }
  return { code, issues };
}

function balanceCheck(code: string): Issue[] {
  const issues: Issue[] = [];
  let depth = 0;
  for (const ch of code) {
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth < 0) { issues.push({ level: 'error', msg: 'Unbalanced parentheses — a closing ) has no matching (.' }); depth = 0; } }
  }
  if (depth > 0) issues.push({ level: 'error', msg: `Unbalanced parentheses — ${depth} opening ( ${depth === 1 ? 'is' : 'are'} never closed.` });
  return issues;
}

// Supplementary lint notes over the stripped skeleton. These catch things a
// formatter tolerates (SELECT with no FROM, clause misordering, trailing commas).
function structureCheck(code: string): Issue[] {
  const issues: Issue[] = [];
  const statements = code.split(';').map((s) => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    const upper = ' ' + stmt.toUpperCase().replace(/\s+/g, ' ') + ' ';
    if (/,\s*(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|\))/i.test(stmt))
      issues.push({ level: 'error', msg: 'Trailing comma — a comma directly precedes a clause keyword or closing parenthesis.' });
    if (/\bIN\s*\(\s*\)/i.test(stmt))
      issues.push({ level: 'warning', msg: 'Empty IN ( ) list.' });
    if (/^\s*SELECT\b/i.test(stmt) && !/\bFROM\b/i.test(upper))
      issues.push({ level: 'warning', msg: 'SELECT has no FROM clause — fine for constant expressions, but check if a table was intended.' });
    const order = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'];
    const present = order.map((k) => ({ k, pos: upper.indexOf(' ' + k + ' ') })).filter((p) => p.pos !== -1);
    for (let j = 1; j < present.length; j++) {
      if (present[j].pos < present[j - 1].pos) {
        issues.push({ level: 'error', msg: `Clause order looks wrong — ${present[j].k} appears before ${present[j - 1].k}.` });
        break;
      }
    }
  }
  if (/,\s*$/.test(code.trim())) issues.push({ level: 'error', msg: 'Query ends with a trailing comma.' });
  return issues;
}

// sql-formatter throws e.g. "Parse error: Unexpected \"foo\" ... at line 2 column 5".
// Normalize that into a single error Issue with a line number when present.
function parseError(sql: string, dialect: SqlLanguage): Issue | null {
  try {
    format(sql, { language: dialect });
    return null;
  } catch (e) {
    const raw = (e as Error).message || 'Invalid SQL.';
    const m = raw.match(/line (\d+)/i);
    return { level: 'error', msg: raw.replace(/\s+/g, ' ').trim(), line: m ? Number(m[1]) : undefined };
  }
}

export function validate(sql: string, dialect: SqlLanguage): Result {
  const trimmed = sql.trim();
  if (!trimmed) return { issues: [], statementCount: 0 };

  const { code, issues } = scan(sql);
  const scanErrors = issues.some((x) => x.level === 'error');

  // Only ask sql-formatter to parse if the literals/comments are terminated —
  // an unterminated string produces a confusing lexer error otherwise.
  if (!scanErrors) {
    const pe = parseError(sql, dialect);
    if (pe) issues.push(pe);
  }

  issues.push(...balanceCheck(code));
  issues.push(...structureCheck(code));

  // De-dupe identical messages (scan + parser can both flag e.g. unbalanced parens).
  const seen = new Set<string>();
  const deduped = issues.filter((x) => {
    const k = x.level + x.msg;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const statementCount = code.split(';').map((s) => s.trim()).filter(Boolean).length;
  return { issues: deduped, statementCount };
}

// ponytail: node self-check — `npx tsx src/lib/sqlvalidate.ts`.
// Guarded so it never runs in the browser bundle.
if (typeof process !== 'undefined' && process.argv?.[1]?.includes('sqlvalidate')) {
  const err = (r: Result) => r.issues.filter((i) => i.level === 'error').length;
  console.assert(err(validate('SELECT id, name FROM users WHERE age > 21', 'sql')) === 0, 'valid query should have no errors');
  console.assert(err(validate('SELECT id, name, FROM users', 'sql')) > 0, 'trailing comma should error');
  console.assert(err(validate("SELECT 'unterminated FROM t", 'sql')) > 0, 'unterminated string should error');
  console.assert(err(validate('SELECT (1 + 2 FROM t', 'sql')) > 0, 'unbalanced paren should error');
  console.assert(err(validate('SELECT id FROM t WHERE x = 1 GROUP BY id ORDER BY id', 'postgresql')) === 0, 'well-ordered clauses ok');
  console.assert(err(validate('SELECT id FROM t GROUP BY id WHERE x = 1', 'sql')) > 0, 'WHERE after GROUP BY should error');
  console.assert(err(validate('SELECT `col` FROM `tbl`', 'mysql')) === 0, 'mysql backticks ok');
  console.assert(err(validate('/* open comment', 'sql')) > 0, 'unclosed block comment should error');
  console.log('sqlvalidate self-check passed');
}
