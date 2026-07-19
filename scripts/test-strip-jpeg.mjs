import assert from 'node:assert';

function stripJpeg(buf) {
  const src = new Uint8Array(buf);
  if (src[0] !== 0xff || src[1] !== 0xd8) return null;
  const out = [0xff, 0xd8];
  let i = 2;
  while (i < src.length) {
    if (src[i] !== 0xff) { out.push(src[i++]); continue; }
    const marker = src[i + 1];
    if (marker === 0xda) { for (; i < src.length; i++) out.push(src[i]); break; }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { out.push(0xff, marker); i += 2; continue; }
    const len = (src[i + 2] << 8) | src[i + 3];
    const strip = marker === 0xe1 || marker === 0xed || marker === 0xfe;
    if (!strip) for (let j = 0; j < len + 2; j++) out.push(src[i + j]);
    i += len + 2;
  }
  return new Uint8Array(out);
}

const seg = (m, payload) => {
  const len = payload.length + 2;
  return [0xff, m, (len >> 8) & 0xff, len & 0xff, ...payload];
};

const app0 = seg(0xe0, [0x4a, 0x46, 0x49, 0x46, 0x00, 1, 1, 0, 0, 1, 0, 1, 0, 0]);
const app1 = seg(0xe1, [0x45, 0x78, 0x69, 0x66, 0, 0, 1, 2, 3, 4]);
const app2 = seg(0xe2, [0x49, 0x43, 0x43, 0]);
const app13 = seg(0xed, [0x50, 0x68, 0x6f, 0x74, 0x6f, 9, 9]);
const com = seg(0xfe, [0x68, 0x69]);
const sos = [0xff, 0xda, 0, 3, 1, /*scan data, may contain 0xff00*/ 0x12, 0xff, 0x00, 0x34, 0xff, 0xd9];

const jpeg = new Uint8Array([0xff, 0xd8, ...app0, ...app1, ...app2, ...app13, ...com, ...sos]);
const clean = stripJpeg(jpeg.buffer);
const bytes = Array.from(clean);

assert(!bytes.join(',').includes([0x45, 0x78, 0x69, 0x66].join(',')), 'EXIF not stripped');
assert(!bytes.join(',').includes([0x50, 0x68, 0x6f, 0x74, 0x6f].join(',')), 'IPTC not stripped');
assert(clean.indexOf(0xfe) === -1 || bytes[clean.indexOf(0xff)] !== 0xfe, 'comment marker present');

assert(bytes.join(',').includes([0x4a, 0x46, 0x49, 0x46].join(',')), 'JFIF dropped');
assert(bytes.join(',').includes([0x49, 0x43, 0x43].join(',')), 'ICC dropped');
assert(bytes.slice(-11).join(',') === sos.join(','), 'scan data altered');

assert(clean[0] === 0xff && clean[1] === 0xd8, 'SOI missing');
assert(clean.length < jpeg.length, 'nothing was removed');

assert(stripJpeg(new Uint8Array([0x89, 0x50]).buffer) === null, 'PNG should return null');

console.log(`OK — ${jpeg.length} bytes -> ${clean.length} bytes, metadata stripped, image data intact`);
