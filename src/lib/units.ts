// Shared unit-conversion engine. Imported by the client script in
// UnitConverter.astro and by any page that needs the category metadata.
// Linear categories store a factor to a base unit; temperature and fuel
// economy are non-linear and handled by explicit functions.

export interface UnitCategory {
  /** URL slug of the dedicated tool page. */
  slug: string;
  /** Display label + <h1>. */
  name: string;
  /** Card tagline. */
  tagline: string;
  /** ~150-char meta description. */
  description: string;
  keywords: string[];
  /** 24x24 line-icon path. */
  icon: string;
  /** Linear units: name -> factor relative to the base unit. */
  units?: Record<string, number>;
  /** Non-linear engine key. */
  special?: 'temp' | 'fuel';
  /** Default "from" unit label. */
  from?: string;
  /** Default "to" unit label. */
  to?: string;
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    slug: 'length-converter',
    name: 'Length Converter',
    tagline: 'Metres, feet, miles, inches & more.',
    description:
      'Free online length converter. Convert between metres, kilometres, centimetres, millimetres, miles, yards, feet, inches and nautical miles instantly. Runs in your browser.',
    keywords: ['length converter', 'meters to feet', 'cm to inches', 'km to miles', 'distance converter'],
    icon: 'M4 7h16M4 7l3-3M4 7l3 3M20 17H4M20 17l-3-3M20 17l-3 3',
    from: 'Metre',
    to: 'Foot',
    units: {
      Nanometre: 1e-9,
      Micrometre: 1e-6,
      Millimetre: 0.001,
      Centimetre: 0.01,
      Metre: 1,
      Kilometre: 1000,
      Inch: 0.0254,
      Foot: 0.3048,
      Yard: 0.9144,
      Mile: 1609.344,
      'Nautical mile': 1852,
    },
  },
  {
    slug: 'weight-converter',
    name: 'Weight & Mass Converter',
    tagline: 'Kilograms, pounds, ounces, stone & more.',
    description:
      'Free online weight and mass converter. Convert between kilograms, grams, milligrams, tonnes, pounds, ounces, stone and US tons instantly. Runs entirely in your browser.',
    keywords: ['weight converter', 'mass converter', 'kg to lbs', 'grams to ounces', 'pounds to kg'],
    icon: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6 8h12l3 12H3zM9 8l-2 12M15 8l2 12',
    from: 'Kilogram',
    to: 'Pound',
    units: {
      Microgram: 1e-6,
      Milligram: 0.001,
      Gram: 1,
      Kilogram: 1000,
      Tonne: 1e6,
      Ounce: 28.349523125,
      Pound: 453.59237,
      Stone: 6350.29318,
      'US ton': 907184.74,
      'Imperial ton': 1016046.9088,
    },
  },
  {
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    tagline: 'Celsius, Fahrenheit & Kelvin.',
    description:
      'Free online temperature converter. Convert between Celsius, Fahrenheit, Kelvin and Rankine instantly with accurate offset math. Runs in your browser — nothing uploaded.',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'c to f'],
    icon: 'M10 13V5a2 2 0 1 1 4 0v8a4 4 0 1 1-4 0ZM12 13V8',
    special: 'temp',
    from: 'Celsius',
    to: 'Fahrenheit',
  },
  {
    slug: 'area-converter',
    name: 'Area Converter',
    tagline: 'Square metres, acres, hectares & more.',
    description:
      'Free online area converter. Convert between square metres, square feet, square kilometres, square miles, acres and hectares instantly. Runs entirely in your browser.',
    keywords: ['area converter', 'square feet to square meters', 'acres to hectares', 'sq ft converter', 'land area converter'],
    icon: 'M4 4h16v16H4zM4 10h16M10 4v16',
    from: 'Square metre',
    to: 'Square foot',
    units: {
      'Square millimetre': 1e-6,
      'Square centimetre': 1e-4,
      'Square metre': 1,
      Hectare: 1e4,
      'Square kilometre': 1e6,
      'Square inch': 0.00064516,
      'Square foot': 0.09290304,
      'Square yard': 0.83612736,
      Acre: 4046.8564224,
      'Square mile': 2589988.110336,
    },
  },
  {
    slug: 'volume-converter',
    name: 'Volume Converter',
    tagline: 'Litres, gallons, cups, millilitres & more.',
    description:
      'Free online volume converter. Convert between litres, millilitres, cubic metres, US and imperial gallons, quarts, pints, cups and fluid ounces instantly. Runs in your browser.',
    keywords: ['volume converter', 'liters to gallons', 'ml to oz', 'cups to ml', 'gallons to liters'],
    icon: 'M6 3h12l-1 4H7zM7 7l1 13h8l1-13M8 13h8',
    from: 'Litre',
    to: 'US gallon',
    units: {
      Millilitre: 0.001,
      Litre: 1,
      'Cubic metre': 1000,
      'Cubic inch': 0.016387064,
      'Cubic foot': 28.316846592,
      'US teaspoon': 0.00492892159,
      'US tablespoon': 0.0147867648,
      'US fluid ounce': 0.0295735296,
      'US cup': 0.2365882365,
      'US pint': 0.473176473,
      'US quart': 0.946352946,
      'US gallon': 3.785411784,
      'Imperial pint': 0.56826125,
      'Imperial gallon': 4.54609,
    },
  },
  {
    slug: 'speed-converter',
    name: 'Speed Converter',
    tagline: 'km/h, mph, m/s, knots & more.',
    description:
      'Free online speed converter. Convert between kilometres per hour, miles per hour, metres per second, feet per second and knots instantly. Runs entirely in your browser.',
    keywords: ['speed converter', 'kmh to mph', 'mph to kmh', 'm/s to mph', 'knots to mph'],
    icon: 'M12 14a2 2 0 1 0 0-.01M12 14l4-5M4 20a8 8 0 1 1 16 0',
    from: 'Kilometre / hour',
    to: 'Mile / hour',
    units: {
      'Metre / second': 1,
      'Kilometre / hour': 0.2777777778,
      'Mile / hour': 0.44704,
      'Foot / second': 0.3048,
      Knot: 0.5144444444,
      Mach: 340.29,
    },
  },
  {
    slug: 'time-converter',
    name: 'Time Converter',
    tagline: 'Seconds, minutes, hours, days & years.',
    description:
      'Free online time converter. Convert between milliseconds, seconds, minutes, hours, days, weeks, months and years instantly. Runs in your browser — nothing uploaded.',
    keywords: ['time converter', 'hours to minutes', 'days to hours', 'seconds to minutes', 'weeks to days'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l3 2',
    from: 'Hour',
    to: 'Minute',
    units: {
      Millisecond: 0.001,
      Second: 1,
      Minute: 60,
      Hour: 3600,
      Day: 86400,
      Week: 604800,
      'Month (30 days)': 2592000,
      'Year (365 days)': 31536000,
    },
  },
  {
    slug: 'pressure-converter',
    name: 'Pressure Converter',
    tagline: 'Pascal, bar, psi, atm & mmHg.',
    description:
      'Free online pressure converter. Convert between pascals, kilopascals, bar, psi, atmospheres, mmHg (torr) and hectopascals instantly. Runs entirely in your browser.',
    keywords: ['pressure converter', 'psi to bar', 'bar to psi', 'kpa to psi', 'atm to pascal'],
    icon: 'M12 3a9 9 0 0 0-9 9h4a5 5 0 0 1 10 0h4a9 9 0 0 0-9-9ZM12 12l4-2',
    from: 'Bar',
    to: 'Psi',
    units: {
      Pascal: 1,
      Kilopascal: 1000,
      Hectopascal: 100,
      Bar: 100000,
      Millibar: 100,
      Psi: 6894.757293168,
      Atmosphere: 101325,
      'mmHg (Torr)': 133.322387415,
    },
  },
  {
    slug: 'energy-converter',
    name: 'Energy Converter',
    tagline: 'Joules, calories, kWh, BTU & more.',
    description:
      'Free online energy converter. Convert between joules, kilojoules, calories, kilocalories, watt-hours, kilowatt-hours, BTU and foot-pounds instantly. Runs in your browser.',
    keywords: ['energy converter', 'joules to calories', 'kwh to joules', 'calories to kj', 'btu converter'],
    icon: 'M13 2 4 14h6l-1 8 9-12h-6z',
    from: 'Kilocalorie',
    to: 'Kilojoule',
    units: {
      Joule: 1,
      Kilojoule: 1000,
      Calorie: 4.184,
      Kilocalorie: 4184,
      'Watt-hour': 3600,
      'Kilowatt-hour': 3.6e6,
      BTU: 1055.05585262,
      'Foot-pound': 1.3558179483,
      Electronvolt: 1.602176634e-19,
    },
  },
  {
    slug: 'power-converter',
    name: 'Power Converter',
    tagline: 'Watts, kilowatts, horsepower & BTU/h.',
    description:
      'Free online power converter. Convert between watts, kilowatts, megawatts, mechanical horsepower, metric horsepower and BTU per hour instantly. Runs entirely in your browser.',
    keywords: ['power converter', 'watts to horsepower', 'kw to hp', 'hp to kw', 'horsepower converter'],
    icon: 'M13 2 4 14h6l-1 8 9-12h-6z',
    from: 'Horsepower',
    to: 'Kilowatt',
    units: {
      Watt: 1,
      Kilowatt: 1000,
      Megawatt: 1e6,
      Horsepower: 745.6998715823,
      'Metric horsepower': 735.49875,
      'BTU / hour': 0.2930710702,
    },
  },
  {
    slug: 'data-storage-converter',
    name: 'Data Storage Converter',
    tagline: 'Bytes, KB, MB, GB, TB — SI & binary.',
    description:
      'Free online data storage converter. Convert between bits, bytes, kilobytes, megabytes, gigabytes and terabytes in both SI (1000) and binary (1024) units. Runs in your browser.',
    keywords: ['data storage converter', 'mb to gb', 'gb to mb', 'kb to mb', 'bytes converter'],
    icon: 'M4 6a8 3 0 0 0 16 0 8 3 0 0 0-16 0v12a8 3 0 0 0 16 0V6M4 12a8 3 0 0 0 16 0',
    from: 'Megabyte (MB)',
    to: 'Gigabyte (GB)',
    units: {
      Bit: 0.125,
      Byte: 1,
      'Kilobyte (KB)': 1e3,
      'Megabyte (MB)': 1e6,
      'Gigabyte (GB)': 1e9,
      'Terabyte (TB)': 1e12,
      'Petabyte (PB)': 1e15,
      'Kibibyte (KiB)': 1024,
      'Mebibyte (MiB)': 1048576,
      'Gibibyte (GiB)': 1073741824,
      'Tebibyte (TiB)': 1099511627776,
    },
  },
  {
    slug: 'fuel-economy-converter',
    name: 'Fuel Economy Converter',
    tagline: 'MPG, L/100km & km/L.',
    description:
      'Free online fuel economy converter. Convert between US MPG, imperial MPG, litres per 100 km and kilometres per litre with correct inverse math. Runs entirely in your browser.',
    keywords: ['fuel economy converter', 'mpg to l/100km', 'l/100km to mpg', 'km/l converter', 'mpg converter'],
    icon: 'M5 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M4 21h12M6 9h8M16 10l3 2v6a2 2 0 0 1-2 2',
    special: 'fuel',
    from: 'MPG (US)',
    to: 'L/100km',
  },
  {
    slug: 'angle-converter',
    name: 'Angle Converter',
    tagline: 'Degrees, radians, gradians & more.',
    description:
      'Free online angle converter. Convert between degrees, radians, gradians, arcminutes, arcseconds and full revolutions instantly with exact math. Runs in your browser.',
    keywords: ['angle converter', 'degrees to radians', 'radians to degrees', 'gradians converter', 'deg to rad'],
    icon: 'M4 20a16 16 0 0 1 16-16M4 20h6M4 20l9-9',
    from: 'Degree',
    to: 'Radian',
    units: {
      // base unit: radian
      Radian: 1,
      Degree: 0.0174532925199433,
      Gradian: 0.015707963267949,
      Arcminute: 0.000290888208666,
      Arcsecond: 0.00000484813681,
      Revolution: 6.28318530717959,
    },
  },
  {
    slug: 'frequency-converter',
    name: 'Frequency Converter',
    tagline: 'Hz, kHz, MHz, GHz, RPM & rad/s.',
    description:
      'Free online frequency converter. Convert between hertz, kilohertz, megahertz, gigahertz, revolutions per minute and radians per second instantly. Runs in your browser.',
    keywords: ['frequency converter', 'hz to khz', 'mhz to hz', 'ghz converter', 'hertz converter'],
    icon: 'M2 12h3l2-7 4 14 3-9 2 5h6',
    from: 'Megahertz (MHz)',
    to: 'Hertz (Hz)',
    units: {
      // base unit: hertz
      'Hertz (Hz)': 1,
      'Kilohertz (kHz)': 1e3,
      'Megahertz (MHz)': 1e6,
      'Gigahertz (GHz)': 1e9,
      'Terahertz (THz)': 1e12,
      'Revolutions / minute (RPM)': 0.0166666666666667,
      'Radians / second': 0.159154943091895,
    },
  },
  {
    slug: 'cooking-converter',
    name: 'Cooking Converter',
    tagline: 'Cups, tablespoons, teaspoons, ml & oz.',
    description:
      'Free online cooking and recipe converter. Convert between cups, tablespoons, teaspoons, millilitres, litres and fluid ounces for recipes instantly. Runs in your browser.',
    keywords: ['cooking converter', 'recipe converter', 'cups to ml', 'tablespoons to teaspoons', 'ml to cups'],
    icon: 'M4 3h16l-1 7a7 7 0 0 1-14 0zM12 17v4M8 21h8',
    from: 'US cup',
    to: 'Millilitre',
    units: {
      Millilitre: 1,
      Litre: 1000,
      'US teaspoon': 4.92892159,
      'US tablespoon': 14.7867648,
      'US fluid ounce': 29.5735296,
      'US cup': 236.5882365,
      'US pint': 473.176473,
      'US quart': 946.352946,
      'Imperial teaspoon': 5.91938802,
      'Imperial tablespoon': 17.7581641,
      'Imperial cup': 284.130625,
    },
  },
];

export function getCategory(slug: string): UnitCategory | undefined {
  return UNIT_CATEGORIES.find((c) => c.slug === slug);
}

// ---- Non-linear engines ----

export function tempTo(base: number, unit: string): number {
  // base is Celsius
  switch (unit) {
    case 'Fahrenheit': return base * 9 / 5 + 32;
    case 'Kelvin': return base + 273.15;
    case 'Rankine': return (base + 273.15) * 9 / 5;
    default: return base;
  }
}
export function tempFrom(value: number, unit: string): number {
  // returns Celsius
  switch (unit) {
    case 'Fahrenheit': return (value - 32) * 5 / 9;
    case 'Kelvin': return value - 273.15;
    case 'Rankine': return value * 5 / 9 - 273.15;
    default: return value;
  }
}
export const TEMP_UNITS = ['Celsius', 'Fahrenheit', 'Kelvin', 'Rankine'];

// Fuel economy — convert everything through km/L as the base.
export const FUEL_UNITS = ['MPG (US)', 'MPG (Imperial)', 'km/L', 'L/100km'];
export function fuelToKmPerL(value: number, unit: string): number {
  switch (unit) {
    case 'MPG (US)': return value * 0.4251437075; // mi/gal(US) -> km/L
    case 'MPG (Imperial)': return value * 0.4251437 * 1.20095; // via imperial gallon
    case 'L/100km': return value === 0 ? Infinity : 100 / value;
    default: return value; // km/L
  }
}
export function fuelFromKmPerL(kmPerL: number, unit: string): number {
  switch (unit) {
    case 'MPG (US)': return kmPerL / 0.4251437075;
    case 'MPG (Imperial)': return kmPerL / (0.4251437 * 1.20095);
    case 'L/100km': return kmPerL === 0 ? Infinity : 100 / kmPerL;
    default: return kmPerL;
  }
}
