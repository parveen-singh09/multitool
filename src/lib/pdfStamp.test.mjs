// Geometry checks for pdfStamp.ts. Run: node src/lib/pdfStamp.test.mjs
//
// The property that matters: a corner stamp must land INSIDE the visible (CropBox) region for every
// combination of /Rotate and corner. The old code failed this silently — text written outside the
// CropBox is in the file but never displayed, which is why pages looked "skipped".
import assert from 'node:assert/strict';
import { cornerPlacement, visibleBox, pageRotation } from './pdfStamp.ts';

const CORNERS = ['tl', 'tc', 'tr', 'bl', 'bc', 'br'];
const ROTS = [0, 90, 180, 270];

// Text rect in unrotated page space, given the baseline start and pdf-lib's rotate angle (CCW).
function textRect(x, y, rotate, tw, size) {
  const r = (rotate * Math.PI) / 180;
  const ax = Math.cos(r), ay = Math.sin(r);        // advance direction
  const px = -Math.sin(r), py = Math.cos(r);       // ascent direction
  const pts = [];
  for (const alongFrac of [0, 1]) {
    for (const upFrac of [0, 1]) {
      pts.push([
        x + ax * tw * alongFrac + px * size * upFrac,
        y + ay * tw * alongFrac + py * size * upFrac,
      ]);
    }
  }
  return pts;
}

function assertInside(box, pts, label) {
  const EPS = 1e-6;
  for (const [px, py] of pts) {
    assert.ok(px >= box.x - EPS && px <= box.x + box.width + EPS, `${label}: x=${px} outside [${box.x}, ${box.x + box.width}]`);
    assert.ok(py >= box.y - EPS && py <= box.y + box.height + EPS, `${label}: y=${py} outside [${box.y}, ${box.y + box.height}]`);
  }
}

// 1. Every rotation x corner keeps the stamp inside the visible box — including a CropBox with a
//    non-zero origin, the case that broke Bates numbering.
for (const box of [
  { x: 0, y: 0, width: 612, height: 792 },      // clean letter
  { x: 50, y: 100, width: 400, height: 500 },   // inset CropBox, non-zero origin
  { x: -20, y: -30, width: 300, height: 400 },  // negative origin (legal, seen in imposed files)
]) {
  for (const rot of ROTS) {
    for (const corner of CORNERS) {
      const tw = 60, size = 10, margin = 24;
      const p = cornerPlacement(box, rot, corner, tw, size, margin);
      assertInside(box, textRect(p.x, p.y, p.rotate, tw, size), `box${box.x},${box.y} rot${rot} ${corner}`);
    }
  }
}

// 2. On an unrotated clean page the numbers match the obvious hand-computed values.
{
  const box = { x: 0, y: 0, width: 612, height: 792 };
  assert.deepEqual(cornerPlacement(box, 0, 'bl', 60, 10, 24), { x: 24, y: 24, rotate: 0 });
  assert.deepEqual(cornerPlacement(box, 0, 'br', 60, 10, 24), { x: 612 - 60 - 24, y: 24, rotate: 0 });
  assert.deepEqual(cornerPlacement(box, 0, 'bc', 60, 10, 24), { x: (612 - 60) / 2, y: 24, rotate: 0 });
  // Top anchors drop a full font size so glyphs clear the margin, not just the baseline.
  assert.deepEqual(cornerPlacement(box, 0, 'tl', 60, 10, 24), { x: 24, y: 792 - 24 - 10, rotate: 0 });
}

// 3. A CropBox origin shifts the stamp by exactly that origin (the actual Bates bug).
{
  const shifted = cornerPlacement({ x: 50, y: 100, width: 400, height: 500 }, 0, 'bl', 60, 10, 24);
  assert.deepEqual(shifted, { x: 74, y: 124, rotate: 0 });
  assert.ok(shifted.y > 100, 'stamp must sit above the CropBox floor, not at y=24');
}

// 4. Rotation is carried through so the text reads upright, and quarter-turns swap the axes.
{
  const box = { x: 0, y: 0, width: 612, height: 792 };
  assert.equal(cornerPlacement(box, 90, 'br', 60, 10, 24).rotate, 90);
  // Displayed width on a 90-turned letter page is 792, so a centered stamp uses that span.
  assert.equal(cornerPlacement(box, 90, 'bc', 60, 10, 24).x, 612 - 24);
}

// 5. Long text never runs off the page: margins collapse instead of pushing it outside.
{
  const box = { x: 0, y: 0, width: 100, height: 200 };
  for (const corner of CORNERS) {
    const p = cornerPlacement(box, 0, corner, 120, 10, 24); // text wider than the page
    const xs = textRect(p.x, p.y, p.rotate, 120, 10).map(([x]) => x);
    // It overflows (unavoidable), but stays centered rather than skewed off one edge.
    assert.ok(Math.min(...xs) <= 0 && Math.max(...xs) >= 100, `${corner}: expected symmetric overflow`);
    assert.equal(p.x, -10, `${corner}: overflow should center, giving x=-10`);
  }
}

// 6. visibleBox clips a malformed oversized CropBox to the MediaBox, and survives a degenerate one.
{
  const page = (media, crop) => ({ getMediaBox: () => media, getCropBox: () => crop });
  const media = { x: 0, y: 0, width: 612, height: 792 };
  assert.deepEqual(visibleBox(page(media, { x: -100, y: -100, width: 2000, height: 2000 })), media);
  assert.deepEqual(visibleBox(page(media, { x: 0, y: 0, width: 0, height: 0 })), media, 'degenerate falls back');
  assert.deepEqual(
    visibleBox(page(media, { x: 10, y: 20, width: 100, height: 200 })),
    { x: 10, y: 20, width: 100, height: 200 });
}

// 7. fillPlacement covers the visible box exactly, for every rotation.
//    pdf-lib's drawImage is translate(x,y) -> rotate -> scale(w,h) over the unit square, so the
//    anchor corner moves with the angle. Replaying that transform must reproduce the box.
{
  const { fillPlacement } = await import('./pdfStamp.ts');
  for (const box of [
    { x: 0, y: 0, width: 612, height: 792 },
    { x: 50, y: 100, width: 400, height: 500 },
  ]) {
    for (const rot of ROTS) {
      const p = fillPlacement(box, rot);
      const r = (p.rotate * Math.PI) / 180, c = Math.round(Math.cos(r)), s = Math.round(Math.sin(r));
      const xs = [], ys = [];
      for (const u of [0, 1]) for (const v of [0, 1]) {
        // R(theta) * (w*u, h*v), then translate.
        xs.push(p.x + c * p.width * u - s * p.height * v);
        ys.push(p.y + s * p.width * u + c * p.height * v);
      }
      const label = `fill box${box.x},${box.y} rot${rot}`;
      assert.equal(Math.min(...xs), box.x, `${label}: min x`);
      assert.equal(Math.max(...xs), box.x + box.width, `${label}: max x`);
      assert.equal(Math.min(...ys), box.y, `${label}: min y`);
      assert.equal(Math.max(...ys), box.y + box.height, `${label}: max y`);
    }
  }
  // A quarter-turn feeds drawImage the swapped (pre-rotation) size.
  const q = fillPlacement({ x: 0, y: 0, width: 612, height: 792 }, 90);
  assert.equal(q.width, 792);
  assert.equal(q.height, 612);
}

// 8. Odd /Rotate values normalize instead of producing a bogus angle.
{
  const rot = (a) => pageRotation({ getRotation: () => ({ angle: a }) });
  assert.equal(rot(-90), 270);
  assert.equal(rot(450), 90);
  assert.equal(rot(0), 0);
  assert.equal(rot(360), 0);
}

console.log('pdfStamp: all geometry checks passed');
