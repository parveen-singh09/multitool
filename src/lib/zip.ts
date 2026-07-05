// Minimal store-only (no compression) ZIP encoder. Audio/video/image outputs
// are already compressed, so storing them raw keeps the ZIP small enough while
// avoiding a heavyweight deflate dependency. Enough for batch downloads of a
// handful of converted files, entirely in the browser.

interface ZipEntry {
  name: string;
  data: Uint8Array;
  crc: number;
}

// Standard CRC-32 (IEEE 802.3) with a lazily-built lookup table.
let CRC_TABLE: Uint32Array | null = null;
function crcTable(): Uint32Array {
  if (CRC_TABLE) return CRC_TABLE;
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  CRC_TABLE = t;
  return t;
}

function crc32(buf: Uint8Array): number {
  const t = crcTable();
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const enc = new TextEncoder();

/** Build a ZIP archive (store method) from named byte arrays. */
export function makeZip(files: { name: string; data: Uint8Array }[]): Blob {
  const entries: (ZipEntry & { offset: number; nameBytes: Uint8Array })[] = [];
  const chunks: Uint8Array[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const crc = crc32(f.data);
    // Local file header
    const header = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(header.buffer);
    dv.setUint32(0, 0x04034b50, true); // local file header signature
    dv.setUint16(4, 20, true); // version needed
    dv.setUint16(6, 0, true); // flags
    dv.setUint16(8, 0, true); // method 0 = store
    dv.setUint16(10, 0, true); // mod time
    dv.setUint16(12, 0, true); // mod date
    dv.setUint32(14, crc, true);
    dv.setUint32(18, f.data.length, true); // compressed size
    dv.setUint32(22, f.data.length, true); // uncompressed size
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true); // extra length
    header.set(nameBytes, 30);
    chunks.push(header, f.data);
    entries.push({ name: f.name, data: f.data, crc, offset, nameBytes });
    offset += header.length + f.data.length;
  }

  // Central directory
  const cdStart = offset;
  for (const e of entries) {
    const cd = new Uint8Array(46 + e.nameBytes.length);
    const dv = new DataView(cd.buffer);
    dv.setUint32(0, 0x02014b50, true); // central dir signature
    dv.setUint16(4, 20, true); // version made by
    dv.setUint16(6, 20, true); // version needed
    dv.setUint16(8, 0, true); // flags
    dv.setUint16(10, 0, true); // method
    dv.setUint16(12, 0, true); // time
    dv.setUint16(14, 0, true); // date
    dv.setUint32(16, e.crc, true);
    dv.setUint32(20, e.data.length, true);
    dv.setUint32(24, e.data.length, true);
    dv.setUint16(28, e.nameBytes.length, true);
    dv.setUint16(30, 0, true); // extra
    dv.setUint16(32, 0, true); // comment
    dv.setUint16(34, 0, true); // disk
    dv.setUint16(36, 0, true); // internal attrs
    dv.setUint32(38, 0, true); // external attrs
    dv.setUint32(42, e.offset, true); // local header offset
    cd.set(e.nameBytes, 46);
    chunks.push(cd);
    offset += cd.length;
  }
  const cdSize = offset - cdStart;

  // End of central directory
  const eocd = new Uint8Array(22);
  const edv = new DataView(eocd.buffer);
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(8, entries.length, true);
  edv.setUint16(10, entries.length, true);
  edv.setUint32(12, cdSize, true);
  edv.setUint32(16, cdStart, true);
  chunks.push(eocd);

  return new Blob(chunks as BlobPart[], { type: 'application/zip' });
}
