import { setSeed } from './src/lib/random';
import { profile } from './src/lib/fakegen';
import { LOCALES } from './src/lib/locales';
import assert from 'node:assert';

setSeed('project-x');
const a = profile({ nat: 'fr', sex: 'female' });
setSeed('project-x');
const b = profile({ nat: 'fr', sex: 'female' });
assert.deepStrictEqual(a, b, 'same seed must reproduce identical profile');

setSeed('other');
const c = profile({ nat: 'fr', sex: 'female' });
assert.notDeepStrictEqual(a, c, 'different seed should differ');

setSeed(null);
const de = profile({ nat: 'de' });
assert.ok('land' in de.location, 'de uses Land region key: ' + Object.keys(de.location));
assert.match(de.uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'uuid v4');
assert.ok(de.age >= 18 && de.age <= 80, 'age in range: ' + de.age);
assert.ok(de.nat === 'DE' && de.nationality === 'Germany');

for (const l of LOCALES) {
  const p = profile({ nat: l.key });
  assert.ok(p.location.street && p.location.postcode && p.phone, 'complete: ' + l.key);
}
assert.equal(LOCALES.length, 25, 'expected 25 locales, got ' + LOCALES.length);

console.log('OK profile checks passed —', LOCALES.length, 'locales');
console.log('sample (fr, seed project-x):', JSON.stringify(a).slice(0, 320));
