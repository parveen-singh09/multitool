// Fancy / stylish text engine used by the nickname generator.
// Turns plain ASCII into Unicode font variants + decorated symbol frames.
// Pure functions, no deps — every style works from copy/paste alone (no fonts
// to install), which is the whole point of these Unicode tricks.

const UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LO = 'abcdefghijklmnopqrstuvwxyz';
const DG = '0123456789';

type Overrides = Record<string, string>;

/**
 * Offset each ASCII letter/digit to a contiguous Unicode block.
 * `overrides` patches the holes in the Math-Alphanumeric blocks where a few
 * codepoints live in the older "Letterlike Symbols" block instead.
 */
function offsetMap(
  upStart: number | null,
  loStart: number | null,
  dgStart: number | null,
  overrides: Overrides = {},
) {
  return (text: string) =>
    [...text]
      .map((ch) => {
        if (overrides[ch]) return overrides[ch];
        const c = ch.charCodeAt(0);
        if (upStart != null && c >= 65 && c <= 90) return String.fromCodePoint(upStart + (c - 65));
        if (loStart != null && c >= 97 && c <= 122) return String.fromCodePoint(loStart + (c - 97));
        if (dgStart != null && c >= 48 && c <= 57) return String.fromCodePoint(dgStart + (c - 48));
        return ch;
      })
      .join('');
}

/** Map from an explicit ordered target alphabet (must be full A-Z / a-z). */
function tableMap(upTable: string, loTable = upTable) {
  const up = [...upTable];
  const lo = [...loTable];
  return (text: string) =>
    [...text]
      .map((ch) => {
        const c = ch.charCodeAt(0);
        if (c >= 65 && c <= 90) return up[c - 65] ?? ch;
        if (c >= 97 && c <= 122) return lo[c - 97] ?? ch;
        return ch;
      })
      .join('');
}

/** Append a combining mark to every non-space char (strike / underline / slash). */
function combine(mark: string) {
  return (text: string) => [...text].map((ch) => (ch === ' ' ? ch : ch + mark)).join('');
}

const FLIP: Overrides = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
  k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
  u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'B', C: 'Ɔ', D: 'D', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ',
  K: 'K', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'R', S: 'S', T: '┴',
  U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
  '8': '8', '9': '6', '.': '˙', ',': "'", '?': '¿', '!': '¡', "'": ',', '"': ',,',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '_': '‾', '&': '⅋',
};

function upsideDown(text: string) {
  return [...text.toLowerCase()].map((ch) => FLIP[ch] ?? ch).reverse().join('');
}

// Math-Alphanumeric hole patches (letters that live in Letterlike Symbols).
const SCRIPT_O: Overrides = { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' };
const FRAKTUR_O: Overrides = { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' };
const DBL_O: Overrides = { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' };

// ── Font styles ────────────────────────────────────────────────────────────
export interface FontStyle {
  id: string;
  name: string;
  apply: (t: string) => string;
}

export const FONT_STYLES: FontStyle[] = [
  { id: 'bold', name: 'Bold', apply: offsetMap(0x1d400, 0x1d41a, 0x1d7ce) },
  { id: 'italic', name: 'Italic', apply: offsetMap(0x1d434, 0x1d44e, null) },
  { id: 'bolditalic', name: 'Bold Italic', apply: offsetMap(0x1d468, 0x1d482, null) },
  { id: 'script', name: 'Script', apply: offsetMap(0x1d49c, 0x1d4b6, null, SCRIPT_O) },
  { id: 'boldscript', name: 'Bold Script', apply: offsetMap(0x1d4d0, 0x1d4ea, null) },
  { id: 'fraktur', name: 'Fraktur', apply: offsetMap(0x1d504, 0x1d51e, null, FRAKTUR_O) },
  { id: 'boldfraktur', name: 'Bold Fraktur', apply: offsetMap(0x1d56c, 0x1d586, null) },
  { id: 'double', name: 'Double-struck', apply: offsetMap(0x1d538, 0x1d552, 0x1d7d8, DBL_O) },
  { id: 'sans', name: 'Sans', apply: offsetMap(0x1d5a0, 0x1d5ba, 0x1d7e2) },
  { id: 'sansbold', name: 'Sans Bold', apply: offsetMap(0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { id: 'sansitalic', name: 'Sans Italic', apply: offsetMap(0x1d608, 0x1d622, null) },
  { id: 'sansbolditalic', name: 'Sans Bold Italic', apply: offsetMap(0x1d63c, 0x1d656, null) },
  { id: 'mono', name: 'Monospace', apply: offsetMap(0x1d670, 0x1d68a, 0x1d7f6) },
  { id: 'fullwidth', name: 'Fullwidth', apply: offsetMap(0xff21, 0xff41, 0xff10) },
  { id: 'circled', name: 'Circled', apply: offsetMap(0x24b6, 0x24d0, null, { '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨' }) },
  { id: 'circledneg', name: 'Circled Black', apply: offsetMap(0x1f150, 0x1f150, null, { '0': '⓿', '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺', '6': '❻', '7': '❼', '8': '❽', '9': '❾' }) },
  { id: 'squared', name: 'Squared', apply: offsetMap(0x1f130, 0x1f130, null) },
  { id: 'squaredneg', name: 'Squared Black', apply: offsetMap(0x1f170, 0x1f170, null) },
  { id: 'smallcaps', name: 'Small Caps', apply: tableMap(UP, 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀsᴛᴜᴠᴡxʏᴢ') },
  { id: 'superscript', name: 'Superscript', apply: tableMap('ᴬᴮꟲᴰᴱꟳᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾꟴᴿˢᵀᵁⱽᵂˣʸᶻ', 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛʷˣʸᶻ') },
  { id: 'subscript', name: 'Subscript', apply: tableMap('ₐBCDₑFGₕᵢⱼₖₗₘₙₒₚQᵣₛₜᵤᵥWₓYZ', 'ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz') },
  { id: 'inverted', name: 'Upside Down', apply: upsideDown },
  { id: 'strike', name: 'Strikethrough', apply: combine('̶') },
  { id: 'underline', name: 'Underline', apply: combine('̲') },
  { id: 'slashed', name: 'Slashed', apply: combine('̸') },
  { id: 'doubleunder', name: 'Double Underline', apply: combine('̳') },
  { id: 'overline', name: 'Overline', apply: combine('̅') },
  { id: 'wide', name: 'Aesthetic', apply: (t) => [...t].join(' ') },
];

// ── Decorative frames ────────────────────────────────────────────────────────
// `{}` is the placeholder for the styled/plain name. Mix of gaming (꧁꧂),
// hearts, arrows, sparkles and bracket art — the stuff people put on PUBG /
// Free Fire / Discord handles.
export const FRAMES: string[] = [
  '꧁༺ {} ༻꧂', '꧁☬ {} ☬꧂', '༺ {} ༻', '⚡{}⚡', '★彡 {} 彡★', '๛ {}', '꧁ᶜᴿᴬᶻᵞ {} ꧂',
  '▄︻デ {} ══━一', '☠ {} ☠', '♛ {} ♛', '⚔️ {} ⚔️', '☬ {} ☬', '༒ {} ༒', '⸸ {} ⸸',
  '❤ {} ❤', '♡ {} ♡', '✿ {} ✿', '❀ {} ❀', '⁀➷ {}', '❥ {}', '🥀 {} 🥀', '♪ {} ♪',
  '✦ {} ✦', '✧ {} ✧', '⋆ {} ⋆', '˚ {} ˚', '✨ {} ✨', '⭐ {} ⭐', '🌟 {} 🌟', '° {} °',
  '『 {} 』', '「 {} 」', '【 {} 】', '〖 {} 〗', '﴾ {} ﴿', '⟪ {} ⟫', '⟨ {} ⟩', '《 {} 》',
  '-`♡´- {}', '↳ {} ↲', '⇜ {} ⇝', '»»——— {} ———««', '›› {} ‹‹', '➶ {} ➷',
  '☾ {} ☽', '★ {} ★', '☆ {} ☆', '✰ {} ✰', '♆ {} ♆', '⚝ {} ⚝', '⊹ {} ⊹', '⟢ {} ⟣',
];

export function decorate(name: string): string[] {
  return FRAMES.map((f) => f.replace('{}', name));
}

/** All font variants of a name as {name,value} rows. */
export function fontVariants(text: string): { name: string; value: string }[] {
  return FONT_STYLES.map((s) => ({ name: s.name, value: s.apply(text) }));
}
