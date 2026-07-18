// Minimal ZIP reader — the counterpart to zip.ts's makeZip writer.
// Handles stored (0) and deflate (8) entries; deflate uses the native
// DecompressionStream('deflate-raw'), so no dependency is added.
// Enough to read EPUB / .docx / .xlsx / .pptx (all ZIP containers).

export interface UnzipEntry { name: string; data: Uint8Array }

const dec = new TextDecoder();

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot decompress ZIP data (no DecompressionStream).');
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Parse via the End-of-Central-Directory + central directory (robust ordering).
export async function unzip(buf: ArrayBuffer): Promise<UnzipEntry[]> {
  const u8 = new Uint8Array(buf);
  const dv = new DataView(buf);

  // Find EOCD (0x06054b50) scanning back from the end (comment may follow).
  let eocd = -1;
  for (let i = u8.length - 22; i >= 0 && i >= u8.length - 22 - 65535; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a valid ZIP file (no end-of-central-directory record).');

  const count = dv.getUint16(eocd + 10, true);
  let ptr = dv.getUint32(eocd + 16, true); // central directory offset
  const entries: UnzipEntry[] = [];

  for (let i = 0; i < count; i++) {
    if (dv.getUint32(ptr, true) !== 0x02014b50) break; // central file header signature
    const method = dv.getUint16(ptr + 10, true);
    const compSize = dv.getUint32(ptr + 20, true);
    const nameLen = dv.getUint16(ptr + 28, true);
    const extraLen = dv.getUint16(ptr + 30, true);
    const commentLen = dv.getUint16(ptr + 32, true);
    const localOff = dv.getUint32(ptr + 42, true);
    const name = dec.decode(u8.subarray(ptr + 46, ptr + 46 + nameLen));

    // Jump to the local header to find the true data start (its extra field
    // length can differ from the central one).
    const lNameLen = dv.getUint16(localOff + 26, true);
    const lExtraLen = dv.getUint16(localOff + 28, true);
    const dataStart = localOff + 30 + lNameLen + lExtraLen;
    const comp = u8.subarray(dataStart, dataStart + compSize);

    let data: Uint8Array;
    if (method === 0) data = comp.slice();
    else if (method === 8) data = await inflateRaw(comp);
    else throw new Error(`Unsupported ZIP compression method ${method} for "${name}".`);

    entries.push({ name, data });
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

// Convenience: read one text entry (returns null if absent).
export async function unzipText(buf: ArrayBuffer, name: string): Promise<string | null> {
  const e = (await unzip(buf)).find((x) => x.name === name);
  return e ? dec.decode(e.data) : null;
}
