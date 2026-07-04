#!/usr/bin/env python
"""Regenerate the affected rows of src/data/aftStandards.ts from the official PDF.

Reuses verify_aft.py's PDF parser (same column snapping that was validated), so
the corrected cells come straight from ACFT_scoring_scales_220323.pdf. Only rows
that contain at least one mismatch are rewritten (whole-row, to fix column
shifts); a point row present in the PDF but missing from the TS file is inserted
in descending-points order. Unaffected rows are left byte-for-byte identical.

Run:  python scripts/fix_aft.py        # writes the file
      python scripts/verify_aft.py     # confirm 0 discrepancies
"""
import re
import importlib.util

spec = importlib.util.spec_from_file_location("v", "scripts/verify_aft.py")
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)

TS = "src/data/aftStandards.ts"
ARR_MAP = [
    ("MDL_ROWS", "MDL"),
    ("SPT_ROWS", "SPT"),
    ("HRP_ROWS", "HRP"),
    ("SDC_ROWS", "SDC"),
    ("PLK_ROWS", "PLK"),
    ("RUN_ROWS", "2MR"),
]


def fmt_cell(event, key, pdf_raw):
    """Format one cell for the TS source from the PDF's raw word (or None)."""
    entry = pdf_raw.get(key)
    if entry is None:
        return "null"
    text = str(entry[0]).strip()
    if text in ("---", "--", "—", ""):
        return "null"
    if event in v.TIME_EVENTS:
        m = re.match(r"^0?(\d{1,2}):(\d{2})$", text)  # drop leading zero on minutes
        return f"'{int(m.group(1))}:{m.group(2)}'"
    # SPT floats and integer events: keep the PDF's own numeric text verbatim
    return text


def build_row(event, points, pdf_raw):
    cells = [str(points)]
    for age in range(10):
        for sex in ("M", "F"):
            cells.append(fmt_cell(event, (event, points, age, sex), pdf_raw))
    return "[" + ", ".join(cells) + "]"


def main():
    pdf_data, pdf_raw, pdf_counts = v.parse_pdf()
    ts_data, ts_counts = v.parse_ts()

    # Which (event, points) rows contain at least one mismatch?
    affected = {}   # event -> set(points)
    for key in set(pdf_data) | set(ts_data):
        ev, pts, age, sex = key
        if pdf_data.get(key) != ts_data.get(key):
            affected.setdefault(ev, set()).add(pts)

    src = open(TS, encoding="utf-8").read()
    total_rewritten = total_inserted = 0

    for arr, event in ARR_MAP:
        aff = affected.get(event, set())
        if not aff:
            continue
        m = re.search(arr + r"\s*:\s*Cell\[\]\[\]\s*=\s*\[(.*?)\n\];", src, re.S)
        block = m.group(1)
        block_start = m.start(1)

        # Collect existing row spans + their points, in file order.
        rows = []  # (start, end, points)
        for rowm in re.finditer(r"\[([^\[\]]*)\]", block):
            inner = rowm.group(1)
            pts = int(float(inner.split(",")[0].strip()))
            rows.append((rowm.start(), rowm.end(), pts))

        existing_pts = {r[2] for r in rows}
        edits = []  # (start, end, text) in block coordinates

        # Rewrite affected rows that already exist.
        for start, end, pts in rows:
            if pts in aff:
                edits.append((start, end, build_row(event, pts, pdf_raw)))
                total_rewritten += 1

        # Insert affected rows that exist in the PDF but not in the TS file
        # (a genuinely-dropped row), in descending-points order.
        to_insert = sorted(aff - existing_pts, reverse=True)
        for pts in to_insert:
            # find the first existing row whose points is < pts; insert before it
            anchor = None
            for start, end, rpts in rows:
                if rpts < pts:
                    anchor = start
                    break
            new_line = "\n  " + build_row(event, pts, pdf_raw) + ","
            if anchor is None:
                # append at end of block (before closing) — rare
                edits.append((len(block), len(block), new_line))
            else:
                edits.append((anchor, anchor, build_row(event, pts, pdf_raw) + ",\n  "))
            total_inserted += 1

        # Apply edits to the block in reverse so offsets stay valid.
        new_block = block
        for start, end, text in sorted(edits, key=lambda e: e[0], reverse=True):
            new_block = new_block[:start] + text + new_block[end:]

        src = src[:block_start] + new_block + src[block_start + len(block):]

    open(TS, "w", encoding="utf-8").write(src)
    print(f"rewrote {total_rewritten} rows, inserted {total_inserted} rows")


if __name__ == "__main__":
    main()
