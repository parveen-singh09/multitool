#!/usr/bin/env python
"""Verify src/data/aftStandards.ts against public/ACFT_scoring_scales_220323.pdf, cell by cell.

Parses both sources into a canonical dict {(event, points, age_index, sex): normalized_value}
and diffs them. Normalizes times to total seconds (int), SPT to float, other numeric to int,
null stays None.

Run:  python scripts/verify_aft.py
"""
import re
import sys
import pdfplumber

PDF = "public/ACFT_scoring_scales_220323.pdf"
TS = "src/data/aftStandards.ts"

# page -> event; pages with two entries are continuation pages of the same event
PAGE_EVENT = {
    0: "MDL",
    1: "SPT", 2: "SPT",
    3: "HRP",
    4: "SDC", 5: "SDC",
    6: "PLK", 7: "PLK",
    8: "2MR", 9: "2MR",
}
TIME_EVENTS = {"SDC", "PLK", "2MR"}
FLOAT_EVENTS = {"SPT"}

AGE_LABELS = ["17-21","22-26","27-31","32-36","37-41","42-46","47-51","52-56","57-61","62+"]


def norm_value(event, raw):
    """Normalize a raw string cell to canonical comparable value."""
    if raw is None:
        return None
    s = str(raw).strip()
    if s in ("---", "--", "—", ""):
        return None
    if event in TIME_EVENTS:
        # mm:ss  (with or without leading zero)
        m = re.match(r"^(\d{1,2}):(\d{2})$", s)
        if not m:
            raise ValueError(f"bad time {s!r} for {event}")
        return int(m.group(1)) * 60 + int(m.group(2))
    if event in FLOAT_EVENTS:
        return round(float(s), 3)
    # integer reps / lbs
    return int(float(s))


# ---------------------------------------------------------------------------
# PDF parsing
# ---------------------------------------------------------------------------
def cluster_rows(words, tol=3.0):
    """Group words into rows by their 'top' coordinate."""
    rows = {}
    for w in words:
        key = None
        for k in rows:
            if abs(k - w["top"]) <= tol:
                key = k
                break
        if key is None:
            rows[w["top"]] = [w]
        else:
            rows[key].append(w)
    return [(t, sorted(ws, key=lambda x: x["x0"])) for t, ws in sorted(rows.items())]


def find_column_centers(words):
    """Return (subheader_top, [20 x0 centers]) from the M/F subheader row."""
    # group M/F single letters by top
    byt = {}
    for w in words:
        if w["text"] in ("M", "F"):
            byt.setdefault(round(w["top"], 1), []).append(w)
    # the subheader row is the one with exactly 20 M/F letters
    for t, ws in sorted(byt.items()):
        if len(ws) == 20:
            centers = sorted(w["x0"] for w in ws)
            return t, centers
    raise RuntimeError("could not find 20-letter M/F subheader row")


def snap(x0, centers):
    """Return index of nearest column center, or None if outside table body."""
    lo = centers[0] - 12
    hi = centers[-1] + 12
    if x0 < lo or x0 > hi:
        return None
    best, bi = 1e9, None
    for i, c in enumerate(centers):
        d = abs(x0 - c)
        if d < best:
            best, bi = d, i
    return bi


def parse_pdf():
    pdf = pdfplumber.open(PDF)
    data = {}          # (event, points, age_index, sex) -> normalized
    raw_words = {}     # same key -> (raw_text, x0, top, page)  for spot-checking
    row_counts = {}    # event -> set(points)
    for pi, event in PAGE_EVENT.items():
        page = pdf.pages[pi]
        words = page.extract_words()
        sub_top, centers = find_column_centers(words)
        # data rows are below the subheader
        body = [w for w in words if w["top"] > sub_top + 4]
        for top, ws in cluster_rows(body):
            # leftmost word must be the points value
            if not ws:
                continue
            # points value = leftmost word that is left of the first center
            left = ws[0]
            if left["x0"] >= centers[0] - 12:
                continue  # not a data row (no points on the left)
            try:
                points = int(float(left["text"]))
            except ValueError:
                continue
            row_counts.setdefault(event, set()).add(points)
            # assign remaining words to columns
            for w in ws[1:]:
                col = snap(w["x0"], centers)
                if col is None:
                    continue  # right-edge repeated Points value, etc.
                age_index = col // 2
                sex = "M" if col % 2 == 0 else "F"
                key = (event, points, age_index, sex)
                nv = norm_value(event, w["text"])
                # a cell should only be filled once. SPT/PLK duplicate the
                # point-60 boundary row across two pages; accept if the values
                # agree, flag only genuine value conflicts.
                if key in data:
                    if data[key] != nv:
                        raw_words.setdefault("__collisions__", []).append(
                            (key, raw_words.get(key), (w["text"], round(w["x0"],1), round(top,1), pi))
                        )
                    continue
                data[key] = nv
                raw_words[key] = (w["text"], round(w["x0"], 1), round(top, 1), pi)
    return data, raw_words, row_counts


# ---------------------------------------------------------------------------
# TS parsing
# ---------------------------------------------------------------------------
def parse_ts():
    src = open(TS, encoding="utf-8").read()
    data = {}
    row_counts = {}
    arr_map = {
        "MDL_ROWS": "MDL", "SPT_ROWS": "SPT", "HRP_ROWS": "HRP",
        "SDC_ROWS": "SDC", "PLK_ROWS": "PLK", "RUN_ROWS": "2MR",
    }
    for arr, event in arr_map.items():
        m = re.search(arr + r"\s*:\s*Cell\[\]\[\]\s*=\s*\[(.*?)\n\];", src, re.S)
        if not m:
            raise RuntimeError(f"array {arr} not found")
        block = m.group(1)
        # each row is [ ... ] possibly with a leading // comment line; capture bracketed rows
        for rowm in re.finditer(r"\[([^\[\]]*)\]", block):
            inner = rowm.group(1)
            # split respecting quotes
            cells = [c.strip() for c in inner.split(",")]
            # drop trailing empty from trailing comma
            cells = [c for c in cells if c != ""]
            if len(cells) != 21:
                raise RuntimeError(f"{event}: row has {len(cells)} cells, expected 21: {inner[:60]}")
            vals = []
            for c in cells:
                if c == "null":
                    vals.append(None)
                elif c.startswith("'") or c.startswith('"'):
                    vals.append(c.strip("'\""))
                else:
                    vals.append(c)
            points = int(float(vals[0]))
            row_counts.setdefault(event, set()).add(points)
            for idx in range(20):
                raw = vals[1 + idx]
                age_index = idx // 2
                sex = "M" if idx % 2 == 0 else "F"
                data[(event, points, age_index, sex)] = norm_value(event, raw)
    return data, row_counts


def fmt(event, v):
    if v is None:
        return "null"
    if event in TIME_EVENTS:
        return f"{v//60}:{v%60:02d} ({v}s)"
    return str(v)


def main():
    pdf_data, raw_words, pdf_counts = parse_pdf()
    ts_data, ts_counts = parse_ts()

    events = ["MDL", "SPT", "HRP", "SDC", "PLK", "2MR"]

    print("=" * 78)
    print("STRUCTURAL CHECK: points rows per event")
    print("=" * 78)
    for ev in events:
        pc = pdf_counts.get(ev, set())
        tc = ts_counts.get(ev, set())
        print(f"{ev}: PDF rows={len(pc)}  TS rows={len(tc)}", end="")
        only_pdf = sorted(pc - tc, reverse=True)
        only_ts = sorted(tc - pc, reverse=True)
        if only_pdf or only_ts:
            print(f"   MISMATCH  only_in_PDF={only_pdf}  only_in_TS={only_ts}")
        else:
            print("   OK (identical point set)")

    # collisions in PDF parser
    cols = raw_words.get("__collisions__", [])
    if cols:
        print("\n!! PDF PARSER COLLISIONS (same cell filled twice) — investigate parser:")
        for c in cols[:40]:
            print("   ", c)

    print("\n" + "=" * 78)
    print("CELL COMPARISON")
    print("=" * 78)
    all_keys = set(pdf_data) | set(ts_data)
    per_event_total = {ev: 0 for ev in events}
    mismatches = {ev: [] for ev in events}

    # A cell absent on either side is treated as null (the TS file omits point
    # rows that are entirely "---" in the PDF; blank cells inside an existing
    # PDF row are already recorded as None). A real error is any case where the
    # two normalized values differ, including PDF=value vs TS=null.
    for key in all_keys:
        ev, points, age, sex = key
        per_event_total[ev] += 1
        pv = pdf_data.get(key, None)
        tv = ts_data.get(key, None)
        if pv != tv:
            mismatches[ev].append((key, pv, tv, key in pdf_data, key in ts_data))

    for ev in events:
        print(f"\n----- {ev} -----  cells compared: {per_event_total[ev]}")
        if not mismatches[ev]:
            print("  no discrepancies found")
            continue
        for key, pv, tv, inp, ints in sorted(
            mismatches[ev], key=lambda k: (-k[0][1], k[0][2], k[0][3])
        ):
            _, points, age, sex = key
            rw = raw_words.get(key)
            tag = ""
            if not ints:
                tag = " (TS row omitted)"
            elif not inp:
                tag = " (no PDF cell)"
            print(f"  MISMATCH  pts={points:>4}  age={AGE_LABELS[age]:<6} {sex}  "
                  f"PDF={fmt(ev,pv):<14} TS={fmt(ev,tv):<14}{tag}  [pdf raw word: {rw}]")

    # Verify every TS-omitted point row is genuinely all-null in the PDF
    print("\n" + "=" * 78)
    print("OMITTED-ROW SANITY CHECK (TS drops rows that are all '---' in PDF)")
    print("=" * 78)
    for ev in events:
        omitted = sorted(pdf_counts.get(ev, set()) - ts_counts.get(ev, set()), reverse=True)
        if not omitted:
            continue
        bad = []
        for pts in omitted:
            nonnull = [(AGE_LABELS[a], s, pdf_data[(ev, pts, a, s)])
                       for a in range(10) for s in ("M", "F")
                       if pdf_data.get((ev, pts, a, s)) is not None]
            if nonnull:
                bad.append((pts, nonnull))
        if bad:
            print(f"  {ev}: !! these omitted rows have real data in PDF: {bad}")
        else:
            print(f"  {ev}: OK — all {len(omitted)} omitted rows are entirely '---' in PDF: {omitted}")

    total_mis = sum(len(v) for v in mismatches.values())
    print("\n" + "=" * 78)
    print(f"TOTAL confirmed value discrepancies: {total_mis}")
    print("=" * 78)


if __name__ == "__main__":
    main()
