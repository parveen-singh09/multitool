

import { randInt, pick } from './random';
import { NAME_SETS, type NameSetKey } from './namesets';

export interface City {
  city: string;
  region: string;      
  regionAbbr?: string; 
}

export interface Country {
  code: string;        
  name: string;
  flag: string;        
  nameSet: NameSetKey;
  dialCode: string;    
  streets: readonly string[];
  streetTypes: readonly string[];
  cities: readonly City[];

  street: () => string;

  postal: () => string;

  phone: () => string;

  bbox: [number, number, number, number];
  currency: string;
  timezone: string;
}

const GEN_STREETS = [
  'Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 'Park', 'Hill', 'Lake', 'River',
  'Church', 'Spring', 'Highland', 'Ridge', 'Sunset', 'Willow', 'Forest', 'Union',
];

const digits = (n: number) => {
  let s = '';
  for (let i = 0; i < n; i++) s += randInt(0, 9);
  return s;
};
const upper = (n: number) => {
  const A = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  let s = '';
  for (let i = 0; i < n; i++) s += A[randInt(0, A.length - 1)];
  return s;
};

function numStreet(streets: readonly string[], types: readonly string[]): string {
  return `${randInt(1, 9999)} ${pick(streets)} ${pick(types)}`;
}
function streetNum(streets: readonly string[], suffix = ''): string {
  return `${pick(streets)}${suffix} ${randInt(1, 299)}`;
}

const EN_TYPES = ['St', 'Ave', 'Blvd', 'Rd', 'Ln', 'Dr', 'Ct', 'Pl', 'Way', 'Ter'];

export const COUNTRIES: Country[] = [
  {
    code: 'US', name: 'United States', flag: '🇺🇸', nameSet: 'american', dialCode: '+1',
    streets: GEN_STREETS, streetTypes: EN_TYPES,
    cities: [
      { city: 'Springfield', region: 'Illinois', regionAbbr: 'IL' },
      { city: 'Austin', region: 'Texas', regionAbbr: 'TX' },
      { city: 'Portland', region: 'Oregon', regionAbbr: 'OR' },
      { city: 'Columbus', region: 'Ohio', regionAbbr: 'OH' },
      { city: 'Sacramento', region: 'California', regionAbbr: 'CA' },
      { city: 'Tampa', region: 'Florida', regionAbbr: 'FL' },
      { city: 'Raleigh', region: 'North Carolina', regionAbbr: 'NC' },
      { city: 'Denver', region: 'Colorado', regionAbbr: 'CO' },
      { city: 'Albany', region: 'New York', regionAbbr: 'NY' },
      { city: 'Madison', region: 'Wisconsin', regionAbbr: 'WI' },
    ],
    street() { return numStreet(this.streets, this.streetTypes); },
    postal: () => digits(5),
    phone: () => `(${randInt(200, 989)}) 555-01${digits(2)}`, // 555-01xx reserved fictional range
    bbox: [25.8, 47.5, -122.5, -71.0], currency: 'USD', timezone: 'America/Chicago',
  },
  {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧', nameSet: 'british', dialCode: '+44',
    streets: ['High', 'Station', 'Church', 'Victoria', 'Albert', 'King', 'Queen', 'Mill', 'Park', 'London', 'York', 'Green'],
    streetTypes: ['Street', 'Road', 'Lane', 'Avenue', 'Close', 'Way', 'Gardens', 'Grove'],
    cities: [
      { city: 'London', region: 'Greater London' }, { city: 'Manchester', region: 'Greater Manchester' },
      { city: 'Birmingham', region: 'West Midlands' }, { city: 'Leeds', region: 'West Yorkshire' },
      { city: 'Bristol', region: 'Bristol' }, { city: 'Liverpool', region: 'Merseyside' },
      { city: 'Sheffield', region: 'South Yorkshire' }, { city: 'Edinburgh', region: 'Scotland' },
      { city: 'Cardiff', region: 'Wales' }, { city: 'Nottingham', region: 'Nottinghamshire' },
    ],
    street() { return numStreet(this.streets, this.streetTypes); },
    postal: () => `${upper(randInt(1, 2))}${randInt(1, 9)} ${randInt(1, 9)}${upper(2)}`,
    phone: () => `+44 7700 ${digits(6).replace(/^\d{3}/, '900')}`, // Ofcom 07700 900xxx drama range
    bbox: [50.0, 58.6, -6.0, 1.7], currency: 'GBP', timezone: 'Europe/London',
  },
  {
    code: 'CA', name: 'Canada', flag: '🇨🇦', nameSet: 'american', dialCode: '+1',
    streets: GEN_STREETS.concat(['Maple', 'Bay', 'Yonge', 'Queen', 'King']),
    streetTypes: EN_TYPES,
    cities: [
      { city: 'Toronto', region: 'Ontario', regionAbbr: 'ON' }, { city: 'Vancouver', region: 'British Columbia', regionAbbr: 'BC' },
      { city: 'Montreal', region: 'Quebec', regionAbbr: 'QC' }, { city: 'Calgary', region: 'Alberta', regionAbbr: 'AB' },
      { city: 'Ottawa', region: 'Ontario', regionAbbr: 'ON' }, { city: 'Edmonton', region: 'Alberta', regionAbbr: 'AB' },
      { city: 'Winnipeg', region: 'Manitoba', regionAbbr: 'MB' }, { city: 'Halifax', region: 'Nova Scotia', regionAbbr: 'NS' },
    ],
    street() { return numStreet(this.streets, this.streetTypes); },
    postal: () => `${upper(1)}${randInt(0, 9)}${upper(1)} ${randInt(0, 9)}${upper(1)}${randInt(0, 9)}`,
    phone: () => `(${randInt(200, 989)}) 555-01${digits(2)}`,
    bbox: [43.0, 60.0, -123.2, -63.0], currency: 'CAD', timezone: 'America/Toronto',
  },
  {
    code: 'AU', name: 'Australia', flag: '🇦🇺', nameSet: 'british', dialCode: '+61',
    streets: ['George', 'King', 'Queen', 'Elizabeth', 'Collins', 'Bourke', 'Pitt', 'Victoria', 'Church', 'Park'],
    streetTypes: ['Street', 'Road', 'Avenue', 'Drive', 'Lane', 'Court', 'Place', 'Parade'],
    cities: [
      { city: 'Sydney', region: 'New South Wales', regionAbbr: 'NSW' }, { city: 'Melbourne', region: 'Victoria', regionAbbr: 'VIC' },
      { city: 'Brisbane', region: 'Queensland', regionAbbr: 'QLD' }, { city: 'Perth', region: 'Western Australia', regionAbbr: 'WA' },
      { city: 'Adelaide', region: 'South Australia', regionAbbr: 'SA' }, { city: 'Canberra', region: 'ACT', regionAbbr: 'ACT' },
      { city: 'Hobart', region: 'Tasmania', regionAbbr: 'TAS' }, { city: 'Darwin', region: 'Northern Territory', regionAbbr: 'NT' },
    ],
    street() { return numStreet(this.streets, this.streetTypes); },
    postal: () => digits(4),
    phone: () => `+61 4${digits(2)} ${digits(3)} ${digits(3)}`,
    bbox: [-38.5, -16.9, 115.8, 153.6], currency: 'AUD', timezone: 'Australia/Sydney',
  },
  {
    code: 'DE', name: 'Germany', flag: '🇩🇪', nameSet: 'german', dialCode: '+49',
    streets: ['Haupt', 'Bahnhof', 'Garten', 'Berg', 'Kirch', 'Schul', 'Wald', 'Ring', 'Markt', 'Linden', 'Rosen', 'Feld'],
    streetTypes: [],
    cities: [
      { city: 'Berlin', region: 'Berlin' }, { city: 'Munich', region: 'Bavaria' },
      { city: 'Hamburg', region: 'Hamburg' }, { city: 'Cologne', region: 'North Rhine-Westphalia' },
      { city: 'Frankfurt', region: 'Hesse' }, { city: 'Stuttgart', region: 'Baden-Württemberg' },
      { city: 'Dresden', region: 'Saxony' }, { city: 'Leipzig', region: 'Saxony' },
    ],
    street() { return streetNum(this.streets, 'straße'); },
    postal: () => digits(5),
    phone: () => `+49 1${randInt(50, 79)} ${digits(7)}`,
    bbox: [47.3, 54.9, 6.0, 15.0], currency: 'EUR', timezone: 'Europe/Berlin',
  },
  {
    code: 'FR', name: 'France', flag: '🇫🇷', nameSet: 'french', dialCode: '+33',
    streets: ['de la Paix', 'Victor Hugo', 'de la République', 'des Fleurs', 'du Moulin', 'de la Gare', 'Jean Jaurès', 'du Château', 'des Écoles', 'de Paris'],
    streetTypes: ['Rue', 'Avenue', 'Boulevard', 'Place', 'Impasse'],
    cities: [
      { city: 'Paris', region: 'Île-de-France' }, { city: 'Lyon', region: 'Auvergne-Rhône-Alpes' },
      { city: 'Marseille', region: "Provence-Alpes-Côte d'Azur" }, { city: 'Toulouse', region: 'Occitanie' },
      { city: 'Nice', region: "Provence-Alpes-Côte d'Azur" }, { city: 'Nantes', region: 'Pays de la Loire' },
      { city: 'Bordeaux', region: 'Nouvelle-Aquitaine' }, { city: 'Lille', region: 'Hauts-de-France' },
    ],
    street() { return `${randInt(1, 199)} ${pick(this.streetTypes)} ${pick(this.streets)}`; },
    postal: () => digits(5),
    phone: () => `+33 6 ${digits(2)} ${digits(2)} ${digits(2)} ${digits(2)}`,
    bbox: [43.0, 50.8, -1.5, 7.6], currency: 'EUR', timezone: 'Europe/Paris',
  },
  {
    code: 'IT', name: 'Italy', flag: '🇮🇹', nameSet: 'italian', dialCode: '+39',
    streets: ['Roma', 'Garibaldi', 'Dante', 'Marconi', 'Verdi', 'Mazzini', 'Cavour', 'Vittorio Emanuele', 'della Libertà', 'del Corso'],
    streetTypes: ['Via', 'Viale', 'Piazza', 'Corso'],
    cities: [
      { city: 'Rome', region: 'Lazio' }, { city: 'Milan', region: 'Lombardy' },
      { city: 'Naples', region: 'Campania' }, { city: 'Turin', region: 'Piedmont' },
      { city: 'Florence', region: 'Tuscany' }, { city: 'Bologna', region: 'Emilia-Romagna' },
      { city: 'Venice', region: 'Veneto' }, { city: 'Palermo', region: 'Sicily' },
    ],
    street() { return `${pick(this.streetTypes)} ${pick(this.streets)} ${randInt(1, 199)}`; },
    postal: () => digits(5),
    phone: () => `+39 3${randInt(20, 99)} ${digits(3)} ${digits(4)}`,
    bbox: [37.0, 46.5, 7.0, 18.4], currency: 'EUR', timezone: 'Europe/Rome',
  },
  {
    code: 'ES', name: 'Spain', flag: '🇪🇸', nameSet: 'spanish', dialCode: '+34',
    streets: ['Mayor', 'Real', 'de la Constitución', 'de Alcalá', 'Gran Vía', 'del Sol', 'de la Paz', 'de Cervantes', 'de Goya', 'de Colón'],
    streetTypes: ['Calle', 'Avenida', 'Plaza', 'Paseo'],
    cities: [
      { city: 'Madrid', region: 'Madrid' }, { city: 'Barcelona', region: 'Catalonia' },
      { city: 'Valencia', region: 'Valencia' }, { city: 'Seville', region: 'Andalusia' },
      { city: 'Zaragoza', region: 'Aragon' }, { city: 'Málaga', region: 'Andalusia' },
      { city: 'Bilbao', region: 'Basque Country' }, { city: 'Granada', region: 'Andalusia' },
    ],
    street() { return `${pick(this.streetTypes)} ${pick(this.streets)} ${randInt(1, 199)}`; },
    postal: () => digits(5),
    phone: () => `+34 6${digits(2)} ${digits(2)} ${digits(2)} ${digits(2)}`,
    bbox: [36.0, 43.7, -9.3, 3.3], currency: 'EUR', timezone: 'Europe/Madrid',
  },
  {
    code: 'NL', name: 'Netherlands', flag: '🇳🇱', nameSet: 'dutch', dialCode: '+31',
    streets: ['Kerk', 'Molen', 'School', 'Dorps', 'Nieuw', 'Hoofd', 'Markt', 'Station', 'Wilhelmina', 'Beatrix'],
    streetTypes: [],
    cities: [
      { city: 'Amsterdam', region: 'North Holland' }, { city: 'Rotterdam', region: 'South Holland' },
      { city: 'The Hague', region: 'South Holland' }, { city: 'Utrecht', region: 'Utrecht' },
      { city: 'Eindhoven', region: 'North Brabant' }, { city: 'Groningen', region: 'Groningen' },
      { city: 'Tilburg', region: 'North Brabant' }, { city: 'Haarlem', region: 'North Holland' },
    ],
    street() { return streetNum(this.streets, 'straat'); },
    postal: () => `${digits(4)} ${upper(2)}`,
    phone: () => `+31 6 ${digits(4)} ${digits(4)}`,
    bbox: [50.8, 53.5, 3.4, 7.2], currency: 'EUR', timezone: 'Europe/Amsterdam',
  },
  {
    code: 'SE', name: 'Sweden', flag: '🇸🇪', nameSet: 'scandinavian', dialCode: '+46',
    streets: ['Stor', 'Kyrko', 'Skol', 'Ny', 'Järnvägs', 'Norra', 'Södra', 'Berg', 'Sjö', 'Park'],
    streetTypes: [],
    cities: [
      { city: 'Stockholm', region: 'Stockholm' }, { city: 'Gothenburg', region: 'Västra Götaland' },
      { city: 'Malmö', region: 'Skåne' }, { city: 'Uppsala', region: 'Uppsala' },
      { city: 'Västerås', region: 'Västmanland' }, { city: 'Örebro', region: 'Örebro' },
    ],
    street() { return streetNum(this.streets, 'gatan'); },
    postal: () => `${digits(3)} ${digits(2)}`,
    phone: () => `+46 70 ${digits(3)} ${digits(4)}`,
    bbox: [55.3, 65.0, 11.1, 20.0], currency: 'SEK', timezone: 'Europe/Stockholm',
  },
  {
    code: 'JP', name: 'Japan', flag: '🇯🇵', nameSet: 'japanese', dialCode: '+81',
    streets: [], streetTypes: [],
    cities: [
      { city: 'Tokyo', region: 'Tokyo' }, { city: 'Osaka', region: 'Osaka' },
      { city: 'Yokohama', region: 'Kanagawa' }, { city: 'Nagoya', region: 'Aichi' },
      { city: 'Sapporo', region: 'Hokkaido' }, { city: 'Fukuoka', region: 'Fukuoka' },
      { city: 'Kyoto', region: 'Kyoto' }, { city: 'Kobe', region: 'Hyogo' },
    ],
    street() { return `${randInt(1, 5)}-${randInt(1, 30)}-${randInt(1, 20)} ${pick(['Chuo', 'Kita', 'Minami', 'Higashi', 'Nishi', 'Sakae', 'Honmachi'])}`; },
    postal: () => `${digits(3)}-${digits(4)}`,
    phone: () => `+81 90-${digits(4)}-${digits(4)}`,
    bbox: [31.0, 43.5, 130.0, 141.5], currency: 'JPY', timezone: 'Asia/Tokyo',
  },
  {
    code: 'CN', name: 'China', flag: '🇨🇳', nameSet: 'chinese', dialCode: '+86',
    streets: ['Zhongshan', 'Renmin', 'Jiefang', 'Beijing', 'Nanjing', 'Jianguo', 'Huaihai', 'Changan', 'Wenhua', 'Heping'],
    streetTypes: ['Lu', 'Jie', 'Dajie', 'Dadao'],
    cities: [
      { city: 'Beijing', region: 'Beijing' }, { city: 'Shanghai', region: 'Shanghai' },
      { city: 'Guangzhou', region: 'Guangdong' }, { city: 'Shenzhen', region: 'Guangdong' },
      { city: 'Chengdu', region: 'Sichuan' }, { city: 'Hangzhou', region: 'Zhejiang' },
      { city: "Xi'an", region: 'Shaanxi' }, { city: 'Wuhan', region: 'Hubei' },
    ],
    street() { return `No. ${randInt(1, 999)} ${pick(this.streets)} ${pick(this.streetTypes)}`; },
    postal: () => digits(6),
    phone: () => `+86 1${randInt(30, 89)} ${digits(4)} ${digits(4)}`,
    bbox: [22.0, 45.0, 100.0, 122.0], currency: 'CNY', timezone: 'Asia/Shanghai',
  },
  {
    code: 'IN', name: 'India', flag: '🇮🇳', nameSet: 'indian', dialCode: '+91',
    streets: ['MG', 'Gandhi', 'Nehru', 'Station', 'Station', 'Church', 'Park', 'Market', 'Ring', 'Temple'],
    streetTypes: ['Road', 'Marg', 'Street', 'Lane'],
    cities: [
      { city: 'Mumbai', region: 'Maharashtra' }, { city: 'Delhi', region: 'Delhi' },
      { city: 'Bangalore', region: 'Karnataka' }, { city: 'Hyderabad', region: 'Telangana' },
      { city: 'Chennai', region: 'Tamil Nadu' }, { city: 'Kolkata', region: 'West Bengal' },
      { city: 'Pune', region: 'Maharashtra' }, { city: 'Ahmedabad', region: 'Gujarat' },
    ],
    street() { return `${randInt(1, 999)}, ${pick(this.streets)} ${pick(this.streetTypes)}`; },
    postal: () => `${randInt(1, 8)}${digits(5)}`,
    phone: () => `+91 ${randInt(70, 99)}${digits(3)} ${digits(5)}`,
    bbox: [8.4, 34.0, 68.7, 89.0], currency: 'INR', timezone: 'Asia/Kolkata',
  },
  {
    code: 'BR', name: 'Brazil', flag: '🇧🇷', nameSet: 'spanish', dialCode: '+55',
    streets: ['das Flores', 'Brasil', 'São João', 'Sete de Setembro', 'da Paz', 'do Comércio', 'XV de Novembro', 'Getúlio Vargas', 'Santos Dumont', 'da Independência'],
    streetTypes: ['Rua', 'Avenida', 'Travessa', 'Alameda'],
    cities: [
      { city: 'São Paulo', region: 'São Paulo' }, { city: 'Rio de Janeiro', region: 'Rio de Janeiro' },
      { city: 'Brasília', region: 'Distrito Federal' }, { city: 'Salvador', region: 'Bahia' },
      { city: 'Fortaleza', region: 'Ceará' }, { city: 'Belo Horizonte', region: 'Minas Gerais' },
      { city: 'Curitiba', region: 'Paraná' }, { city: 'Recife', region: 'Pernambuco' },
    ],
    street() { return `${pick(this.streetTypes)} ${pick(this.streets)}, ${randInt(1, 2999)}`; },
    postal: () => `${digits(5)}-${digits(3)}`,
    phone: () => `+55 ${randInt(11, 99)} 9${digits(4)}-${digits(4)}`,
    bbox: [-33.0, 5.0, -73.0, -35.0], currency: 'BRL', timezone: 'America/Sao_Paulo',
  },
  {
    code: 'MX', name: 'Mexico', flag: '🇲🇽', nameSet: 'spanish', dialCode: '+52',
    streets: ['Juárez', 'Hidalgo', 'Morelos', 'Reforma', 'Insurgentes', 'Madero', 'Independencia', '5 de Mayo', 'Guerrero', 'Zaragoza'],
    streetTypes: ['Calle', 'Avenida', 'Boulevard', 'Calzada'],
    cities: [
      { city: 'Mexico City', region: 'CDMX' }, { city: 'Guadalajara', region: 'Jalisco' },
      { city: 'Monterrey', region: 'Nuevo León' }, { city: 'Puebla', region: 'Puebla' },
      { city: 'Tijuana', region: 'Baja California' }, { city: 'Cancún', region: 'Quintana Roo' },
      { city: 'Mérida', region: 'Yucatán' }, { city: 'Querétaro', region: 'Querétaro' },
    ],
    street() { return `${pick(this.streetTypes)} ${pick(this.streets)} ${randInt(1, 999)}`; },
    postal: () => digits(5),
    phone: () => `+52 ${randInt(55, 99)} ${digits(4)} ${digits(4)}`,
    bbox: [15.0, 32.5, -117.0, -87.0], currency: 'MXN', timezone: 'America/Mexico_City',
  },
  {
    code: 'RU', name: 'Russia', flag: '🇷🇺', nameSet: 'russian', dialCode: '+7',
    streets: ['Lenina', 'Sovetskaya', 'Mira', 'Gagarina', 'Pushkina', 'Molodezhnaya', 'Tsentralnaya', 'Shkolnaya', 'Sadovaya', 'Naberezhnaya'],
    streetTypes: ['ulitsa', 'prospekt', 'pereulok'],
    cities: [
      { city: 'Moscow', region: 'Moscow' }, { city: 'Saint Petersburg', region: 'Saint Petersburg' },
      { city: 'Novosibirsk', region: 'Novosibirsk Oblast' }, { city: 'Yekaterinburg', region: 'Sverdlovsk Oblast' },
      { city: 'Kazan', region: 'Tatarstan' }, { city: 'Nizhny Novgorod', region: 'Nizhny Novgorod Oblast' },
    ],
    street() { return `${pick(this.streets)} ${pick(this.streetTypes)}, ${randInt(1, 199)}`; },
    postal: () => digits(6),
    phone: () => `+7 9${digits(2)} ${digits(3)}-${digits(2)}-${digits(2)}`,
    bbox: [43.0, 66.0, 30.0, 100.0], currency: 'RUB', timezone: 'Europe/Moscow',
  },
];

export const COUNTRY_BY_CODE: Record<string, Country> =
  Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

export type Sex = 'male' | 'female' | 'any';

export interface FullAddress {
  name: string;
  gender: 'Male' | 'Female';
  street: string;
  city: string;
  region: string;
  regionAbbr?: string;
  postal: string;
  country: string;
  countryCode: string;
  phone: string;
  latitude: string;
  longitude: string;
  currency: string;
  timezone: string;
}

function coord(min: number, max: number): string {
  return (min + (randInt(0, 100000) / 100000) * (max - min)).toFixed(5);
}

export function generate(countryCode: string, sex: Sex): FullAddress {
  const c = COUNTRY_BY_CODE[countryCode] ?? COUNTRIES[0];
  const g: 'm' | 'f' = sex === 'male' ? 'm' : sex === 'female' ? 'f' : randInt(0, 1) ? 'm' : 'f';
  const set = NAME_SETS[c.nameSet];
  const loc = pick(c.cities);
  return {
    name: `${pick(set[g])} ${pick(set.last)}`,
    gender: g === 'm' ? 'Male' : 'Female',
    street: c.street(),
    city: loc.city,
    region: loc.region,
    regionAbbr: loc.regionAbbr,
    postal: c.postal(),
    country: c.name,
    countryCode: c.code,
    phone: c.phone(),
    latitude: coord(c.bbox[0], c.bbox[1]),
    longitude: coord(c.bbox[2], c.bbox[3]),
    currency: c.currency,
    timezone: c.timezone,
  };
}

export function oneLine(a: FullAddress): string {
  const reg = a.regionAbbr ?? a.region;
  return `${a.street}, ${a.city}, ${reg} ${a.postal}, ${a.country}`;
}

export function multiLine(a: FullAddress): string {
  const reg = a.regionAbbr ?? a.region;
  return `${a.street}\n${a.city}, ${reg} ${a.postal}\n${a.country}`;
}
