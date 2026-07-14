// Length-bucketed word pools for the domain-name generator's prefix/suffix
// sliders. Generic short words work in either position (starcloud / cloudstar),
// so one pool per length serves both prefix and suffix.
//
// 2- and 3-letter pools are hand-curated (English simply has no ~300 usable
// 2-letter words). 4- and 5-letter pools are sliced from the existing word
// lists rather than retyped.
import { WORDS } from './wordlist';
import { WORDS5 } from './words5';

const two =
  'go my hi we up on in at it is or so no ok by ex ax ox oz ai io hq co ly re ' +
  'un be do to of um ah oy ay ur us om en el ab ad op iq ez ea qi za pi mu nu';

const three =
  'get pro app hub lab kit box net web dev top max pin key run fly sky sun fox ' +
  'owl cat dog bee ant elk cub joy fun win ace pop zip zap dot bit hey now new ' +
  'one duo eco bio geo neo lux orb arc ray gem zen fit hot big red air oak elm ' +
  'ice fog dew sea bay ash oat pea nut fig yam ram ewe hen jay koi doe roe cod ' +
  'eel gnu asp bat rat hog jam log map cap tag tab pod peg rig cog day eve ' +
  'ink pen pad cup mug jar can tin pot pan wok keg vat bin bag lid oil gas ore ' +
  'hue dye gel wax mud sip tap dab rub mix add sum raw hex ' +
  'api sdk cli gui url uri ssl tcp udp dns cdn vpn lan wan orm mvc dom css rgb ' +
  'hsl ada rex leo rio zoe ivy jet ski yak emu roc pug';

const dedup = (s: string, len: number) =>
  [...new Set(s.split(/\s+/).filter((w) => new RegExp(`^[a-z]{${len}}$`).test(w)))];

export const AFFIX2 = dedup(two, 2);
export const AFFIX3 = dedup(three, 3);
export const AFFIX4 = WORDS.filter((w) => w.length === 4).slice(0, 300);
export const AFFIX5 = WORDS5.slice(0, 300);

// Pools keyed by length. Slider range is 1–6; lengths outside 2–5 clamp to the
// nearest available bucket. ponytail: no 1- or 6-letter pools — a single letter
// makes no affix and 6+ is better served by the AI path.
export const AFFIX_BY_LEN: Record<number, string[]> = { 2: AFFIX2, 3: AFFIX3, 4: AFFIX4, 5: AFFIX5 };

export function affixPool(len: number): string[] {
  const n = Math.max(2, Math.min(5, len));
  return AFFIX_BY_LEN[n];
}

// ponytail self-check: the sliced buckets must actually hold the right lengths
// and hit their targets; the hand pools must be non-trivial.
if (import.meta.env.DEV) {
  console.assert(AFFIX4.length === 300 && AFFIX4.every((w) => w.length === 4), 'AFFIX4: 300 four-letter words');
  console.assert(AFFIX5.length === 300 && AFFIX5.every((w) => w.length === 5), 'AFFIX5: 300 five-letter words');
  console.assert(AFFIX2.length >= 40 && AFFIX2.every((w) => w.length === 2), 'AFFIX2: 40+ two-letter words');
  console.assert(AFFIX3.length >= 120 && AFFIX3.every((w) => w.length === 3), 'AFFIX3: 120+ three-letter words');
  console.assert(affixPool(1) === AFFIX2 && affixPool(6) === AFFIX5, 'affixPool clamps to 2..5');
}
