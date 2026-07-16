import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync('git ls-files "src/**/*.ts" "src/**/*.tsx"', { encoding: "utf8" })
  .split("\n").map(s => s.trim()).filter(Boolean);

const parse = (text, file) =>
  ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

// count only real syntax errors (parseDiagnostics), not type errors
const synErrors = sf => sf.parseDiagnostics?.length ?? 0;

let changed = 0, skipped = [];
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const sf = parse(src, file);
  const before = synErrors(sf);

  // collect all comment ranges via the parser (regex/strings/JSX aware)
  const ranges = [];
  const seen = new Set();
  const add = r => { const k = r.pos + ":" + r.end; if (!seen.has(k)) { seen.add(k); ranges.push(r); } };
  const visit = node => {
    (ts.getLeadingCommentRanges(src, node.getFullStart()) || []).forEach(add);
    (ts.getTrailingCommentRanges(src, node.getEnd()) || []).forEach(add);
    node.forEachChild(visit);
  };
  visit(sf);
  if (!ranges.length) continue;

  ranges.sort((a, b) => b.pos - a.pos); // splice right-to-left
  let out = src;
  for (const r of ranges) {
    let end = r.end;
    // a line comment consumes the rest of the line; drop trailing newline only if the
    // line is now blank (comment was the whole line) to avoid leaving empty lines
    const lineStart = out.lastIndexOf("\n", r.pos) + 1;
    const onlyComment = out.slice(lineStart, r.pos).trim() === "";
    if (onlyComment && out[end] === "\r") end++;
    if (onlyComment && out[end] === "\n") end++;
    out = out.slice(0, onlyComment ? lineStart : r.pos) + out.slice(end);
  }

  const after = synErrors(parse(out, file));
  if (after > before) { skipped.push(file); continue; }
  if (out !== src) { writeFileSync(file, out); changed++; }
}

console.log(`changed: ${changed}, skipped (would break): ${skipped.length}`);
if (skipped.length) console.log(skipped.join("\n"));
