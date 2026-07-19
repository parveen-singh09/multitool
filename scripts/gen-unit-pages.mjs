import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = resolve(__dirname, '../src/pages/tools');

const cats = [
  ['length-converter', 'length converter', 'converts between metric and imperial units of length — metres, kilometres, centimetres, miles, yards, feet and inches — with a live reference table. Every conversion runs entirely in your browser, so nothing you type is uploaded.'],
  ['weight-converter', 'weight and mass converter', 'converts weight and mass between kilograms, grams, tonnes, pounds, ounces and stone. Type a value, pick your units, and the result plus a quick reference table update instantly. All maths happens locally in your browser.'],
  ['temperature-converter', 'temperature converter', 'converts temperatures between Celsius, Fahrenheit, Kelvin and Rankine using exact offset formulas. Unlike simple multiplication, temperature needs offset handling, which this converter does correctly. Runs entirely in your browser.'],
  ['area-converter', 'area converter', 'converts area between square metres, square feet, square kilometres, square miles, acres and hectares — ideal for land, flooring and real-estate work. All conversions run locally in your browser with no uploads.'],
  ['volume-converter', 'volume converter', 'converts volume between litres, millilitres, cubic metres, US and imperial gallons, quarts, pints, cups and fluid ounces. US and imperial measures differ, and this converter keeps them separate. Runs in your browser.'],
  ['speed-converter', 'speed converter', 'converts speed between kilometres per hour, miles per hour, metres per second, feet per second and knots. Handy for travel, sport and physics. Every calculation runs locally in your browser.'],
  ['time-converter', 'time converter', 'converts durations between milliseconds, seconds, minutes, hours, days, weeks, months and years. Useful for scheduling, timeouts and quick estimates. All conversion happens in your browser — nothing is uploaded.'],
  ['pressure-converter', 'pressure converter', 'converts pressure between pascals, kilopascals, bar, psi, atmospheres and mmHg (torr). Great for engineering, weather and tyre pressures. Runs entirely in your browser with no server round-trips.'],
  ['energy-converter', 'energy converter', 'converts energy between joules, kilojoules, calories, kilocalories, watt-hours, kilowatt-hours and BTU. Useful for nutrition, physics and utility bills. All maths runs locally in your browser.'],
  ['power-converter', 'power converter', 'converts power between watts, kilowatts, megawatts, mechanical and metric horsepower and BTU per hour. Handy for engines, appliances and HVAC. Every conversion runs in your browser.'],
  ['data-storage-converter', 'data storage converter', 'converts digital storage between bits, bytes, kilobytes, megabytes, gigabytes and terabytes, in both SI (1000-based) and binary (1024-based) units — so you can see the difference marketing and operating systems create. Runs in your browser.'],
  ['fuel-economy-converter', 'fuel economy converter', 'converts fuel economy between US MPG, imperial MPG, litres per 100 km and kilometres per litre. Because L/100km is an inverse measure, this converter uses the correct reciprocal maths. Runs entirely in your browser.'],
  ['cooking-converter', 'cooking and recipe converter', 'converts recipe measurements between cups, tablespoons, teaspoons, millilitres, litres and fluid ounces, with US and imperial spoons and cups kept separate. Perfect for following recipes from anywhere. Runs in your browser.'],
  ['angle-converter', 'angle converter', 'converts angles between degrees, radians, gradians, arcminutes, arcseconds and full revolutions using exact math — handy for geometry, trigonometry and programming. All conversion runs in your browser.'],
  ['frequency-converter', 'frequency converter', 'converts frequency between hertz, kilohertz, megahertz, gigahertz, revolutions per minute and radians per second. Useful for audio, radio and rotational speed. Runs entirely in your browser.'],
];

for (const [slug, label, about] of cats) {
  const page = `---
import ToolLayout from '../../layouts/ToolLayout.astro';
import UnitConverter from '../../components/UnitConverter.astro';
---

<ToolLayout slug="${slug}">
  <UnitConverter slug="${slug}" />

  <div slot="about" class="flex flex-col gap-4 text-[15px] leading-relaxed text-ink-subtle">
    <p>
      This free ${label} ${about}
    </p>
  </div>
</ToolLayout>
`;
  writeFileSync(resolve(pagesDir, `${slug}.astro`), page);
  console.log('wrote', `${slug}.astro`);
}
