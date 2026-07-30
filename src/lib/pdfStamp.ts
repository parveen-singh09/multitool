// Corner-anchored text stamping for pdf-lib pages (Bates numbers, page numbers, headers/footers).
//
// Why this exists: the obvious `const {width, height} = page.getSize(); page.drawText({x: 24, y: 24})`
// is wrong on a large minority of real PDFs, and it fails *silently* — the text is written into the
// file but never displayed. Two reasons, both routine in scanned and imposed documents (exactly the
// legal-discovery sets Bates numbering is for), and both invisible on a clean single-origin PDF:
//
//  1. getSize() returns the MediaBox's width/height and DISCARDS its x/y origin, while viewers clip
//     to the CropBox. A page with CropBox {x:50, y:100, w:400, h:500} reports 612x792 from getSize(),
//     so y=24 lands 76pt below the visible region.
//  2. /Rotate is display-only: pdf-lib draws in unrotated page space, so on a /Rotate 90 page an
//     unadjusted stamp appears sideways in the wrong corner.
//
// A document that mixes such pages with normal ones stamps some pages visibly and some not — which
// reads as "the tool skipped pages on my big PDF".
import { degrees, type PDFFont, type PDFPage, type Color } from 'pdf-lib';

export type Corner = 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';

export interface Box { x: number; y: number; width: number; height: number }

/** CropBox clipped to MediaBox — the region a viewer actually shows, in unrotated page space. */
export function visibleBox(page: Pick<PDFPage, 'getCropBox' | 'getMediaBox'>): Box {
  const m = page.getMediaBox();
  const c = page.getCropBox();
  // Per spec the CropBox is intersected with the MediaBox; a malformed larger CropBox is clipped.
  const x0 = Math.max(m.x, c.x), y0 = Math.max(m.y, c.y);
  const x1 = Math.min(m.x + m.width, c.x + c.width);
  const y1 = Math.min(m.y + m.height, c.y + c.height);
  // Degenerate boxes (zero/negative overlap) fall back to the MediaBox rather than divide by zero.
  if (!(x1 > x0) || !(y1 > y0)) return { x: m.x, y: m.y, width: m.width, height: m.height };
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

/** /Rotate normalized to 0/90/180/270. Negative and out-of-range multiples are legal in the wild. */
export function pageRotation(page: Pick<PDFPage, 'getRotation'>): number {
  const a = page.getRotation().angle || 0;
  return ((Math.round(a / 90) * 90) % 360 + 360) % 360;
}

/**
 * Where to draw `textWidth`-wide text so it lands in `corner` of the page AS DISPLAYED, inset by
 * `margin`, reading upright. Returns pdf-lib coordinates plus the rotation to pass to drawText.
 *
 * Pure geometry, no pdf-lib page needed, so it's unit-testable — see pdfStamp.test.mjs.
 */
/**
 * Baseline start in DISPLAYED space — what the reader sees after /Rotate, origin at the visible
 * box's bottom-left, y up. Also returns the displayed page dimensions.
 *
 * Split out from cornerPlacement because the on-screen preview needs exactly this: the viewer
 * renders pages already CropBox-clipped and rotated, so a preview overlay positioned in displayed
 * space needs no counter-rotation at all.
 */
export function displayedPlacement(
  box: Box, rotation: number, corner: Corner, textWidth: number, size: number, margin: number,
): { x: number; y: number; width: number; height: number } {
  const { width: W, height: H } = box;
  const turned = rotation === 90 || rotation === 270;
  // Displayed dimensions: a quarter-turn swaps them.
  const dW = turned ? H : W, dH = turned ? W : H;

  const side = corner[1], vert = corner[0];
  const slack = dW - textWidth;
  // Text wider than the page can't fit any corner; center it so it overflows evenly on both sides
  // rather than disappearing off one edge. Otherwise clamp the margin so it never pushes text off.
  const mx = Math.min(margin, Math.max(0, slack) / 2);
  const x = slack < 0 ? slack / 2
    : side === 'l' ? mx
    : side === 'r' ? dW - textWidth - mx
    : slack / 2;
  // Top anchors sit a full font size below the edge so the glyphs, not the baseline, clear the margin.
  const y = vert === 't' ? dH - margin - size : margin;
  return { x, y, width: dW, height: dH };
}

export function cornerPlacement(
  box: Box, rotation: number, corner: Corner, textWidth: number, size: number, margin: number,
): { x: number; y: number; rotate: number } {
  const { width: W, height: H } = box;
  const d = displayedPlacement(box, rotation, corner, textWidth, size, margin);
  const X = d.x, Y = d.y, dW = d.width, dH = d.height;

  // Map displayed (X, Y) back into unrotated page space, then offset by the visible box's origin.
  let u: number, v: number;
  if (rotation === 90)       { u = dH - Y; v = X; }
  else if (rotation === 180) { u = W - X;  v = H - Y; }
  else if (rotation === 270) { u = Y;      v = dW - X; }
  else                       { u = X;      v = Y; }

  return { x: box.x + u, y: box.y + v, rotate: rotation };
}

// Helvetica's descender as a fraction of font size. pdf-lib positions text by baseline; CSS
// positions by box edge, so the preview shifts by this to line the two up.
const DESCENT = 0.2445;

export interface PageGeom { box: Box; rot: number }

/** Read the geometry stampCorner will use. Collect once per page at load; reuse for every repaint. */
export function pageGeom(page: Pick<PDFPage, 'getCropBox' | 'getMediaBox' | 'getRotation'>): PageGeom {
  return { box: visibleBox(page), rot: pageRotation(page) };
}

/**
 * Position a preview span inside a pdfViewer page slot so it matches where stampCorner will draw.
 *
 * The slot must be a CSS container (`container-type: inline-size`) — sizes are in cqw so the stamp
 * scales with the viewer's zoom. No counter-rotation needed: pdf.js already renders the page rotated
 * and CropBox-clipped, so the slot IS displayed space, which is what displayedPlacement returns.
 */
export function placeStamp(
  el: HTMLElement, geom: PageGeom,
  o: { text: string; corner: Corner; size: number; margin?: number; textWidth: number },
): void {
  el.textContent = o.text;
  const margin = o.margin ?? 24;
  const p = displayedPlacement(geom.box, geom.rot, o.corner, o.textWidth, o.size, margin);
  el.style.position = 'absolute';
  el.style.whiteSpace = 'nowrap';
  el.style.lineHeight = '1';
  el.style.fontSize = `${(o.size / p.width) * 100}cqw`;
  el.style.left = `${(p.x / p.width) * 100}%`;
  // p.y is a baseline; shift down to the text box's bottom edge so glyphs line up with the output.
  el.style.bottom = `${((p.y - DESCENT * o.size) / p.height) * 100}%`;
  el.style.top = '';
}

/**
 * Where to draw an image so it exactly covers the visible page area, upright as displayed.
 * For full-page overlays (watermarks) — same CropBox/rotation trap as text stamping.
 *
 * Derived from pdf-lib's transform order (translate(x,y) -> rotate -> scale(w,h) over a unit square),
 * so the anchor is a corner that shifts with the angle rather than always the bottom-left.
 */
export function fillPlacement(
  box: Box, rotation: number,
): { x: number; y: number; width: number; height: number; rotate: number } {
  const { x: bx, y: by, width: W, height: H } = box;
  const turned = rotation === 90 || rotation === 270;
  const width = turned ? H : W, height = turned ? W : H; // pre-rotation image size
  if (rotation === 90)  return { x: bx + W, y: by,     width, height, rotate: 90 };
  if (rotation === 180) return { x: bx + W, y: by + H, width, height, rotate: 180 };
  if (rotation === 270) return { x: bx,     y: by + H, width, height, rotate: 270 };
  return { x: bx, y: by, width, height, rotate: 0 };
}

export interface StampOptions {
  text: string;
  font: PDFFont;
  size: number;
  corner: Corner;
  margin?: number;
  color?: Color;
}

/** Draw `text` in a corner of `page`, correct across CropBox origin and /Rotate. */
export function stampCorner(page: PDFPage, opts: StampOptions): void {
  const { text, font, size, corner } = opts;
  if (!text) return;
  const margin = opts.margin ?? 24;
  const p = cornerPlacement(visibleBox(page), pageRotation(page), corner, font.widthOfTextAtSize(text, size), size, margin);
  page.drawText(text, {
    x: p.x, y: p.y, size, font,
    rotate: degrees(p.rotate),
    ...(opts.color ? { color: opts.color } : {}),
  });
}
