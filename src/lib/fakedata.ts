// Static data banks for the fake-data, naming and writing generators.
// Plain arrays so bundlers tree-shake per page. All fictional — any
// resemblance to real people, companies or addresses is coincidental.

export const FIRST_NAMES_M = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven',
  'Andrew', 'Paul', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy',
  'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas',
  'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Samuel',
];

export const FIRST_NAMES_F = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica',
  'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Sandra', 'Margaret', 'Ashley',
  'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah',
  'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia', 'Kathleen', 'Amy', 'Angela',
  'Shirley', 'Anna', 'Brenda', 'Pamela', 'Nicole', 'Ruth', 'Katherine', 'Samantha',
];

export const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
];

export const STREETS = [
  'Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 'Washington', 'Lake', 'Hill',
  'Park', 'Sunset', 'Lincoln', 'Willow', 'Church', 'Highland', 'Franklin', 'Spring',
  'River', 'Ridge', 'Meadow', 'Forest', 'Union', 'Broadway', 'Chestnut', 'Walnut',
];

export const STREET_TYPES = ['St', 'Ave', 'Blvd', 'Rd', 'Ln', 'Dr', 'Ct', 'Pl', 'Way', 'Ter'];

export const CITIES = [
  'Springfield', 'Riverside', 'Franklin', 'Greenville', 'Bristol', 'Clinton',
  'Fairview', 'Salem', 'Madison', 'Georgetown', 'Arlington', 'Ashland', 'Burlington',
  'Manchester', 'Oxford', 'Dover', 'Kingston', 'Milton', 'Newport', 'Auburn',
];

export const US_STATES = [
  { name: 'Alabama', abbr: 'AL' }, { name: 'Arizona', abbr: 'AZ' },
  { name: 'California', abbr: 'CA' }, { name: 'Colorado', abbr: 'CO' },
  { name: 'Florida', abbr: 'FL' }, { name: 'Georgia', abbr: 'GA' },
  { name: 'Illinois', abbr: 'IL' }, { name: 'Indiana', abbr: 'IN' },
  { name: 'Massachusetts', abbr: 'MA' }, { name: 'Michigan', abbr: 'MI' },
  { name: 'Nevada', abbr: 'NV' }, { name: 'New York', abbr: 'NY' },
  { name: 'North Carolina', abbr: 'NC' }, { name: 'Ohio', abbr: 'OH' },
  { name: 'Oregon', abbr: 'OR' }, { name: 'Pennsylvania', abbr: 'PA' },
  { name: 'Texas', abbr: 'TX' }, { name: 'Virginia', abbr: 'VA' },
  { name: 'Washington', abbr: 'WA' }, { name: 'Wisconsin', abbr: 'WI' },
];

export const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
  'Spain', 'Italy', 'Netherlands', 'Sweden', 'Japan', 'Brazil', 'India', 'Mexico',
  'Ireland', 'New Zealand', 'Norway', 'Denmark', 'Switzerland', 'Belgium',
];

export const EMAIL_DOMAINS = [
  'example.com', 'mail.com', 'test.org', 'demo.net', 'inbox.com', 'sample.io',
  'placeholder.dev', 'noreply.co',
];

// Company name building blocks.
export const COMPANY_ADJ = [
  'Global', 'Prime', 'Peak', 'Apex', 'Bright', 'Blue', 'North', 'Pioneer', 'Summit',
  'Vertex', 'Nova', 'Quantum', 'Silver', 'Iron', 'Rapid', 'Clear', 'Nimbus', 'Orbit',
];
export const COMPANY_NOUN = [
  'Systems', 'Solutions', 'Technologies', 'Labs', 'Dynamics', 'Ventures', 'Group',
  'Industries', 'Networks', 'Analytics', 'Digital', 'Works', 'Logic', 'Data', 'Cloud',
];
export const COMPANY_SUFFIX = ['Inc', 'LLC', 'Ltd', 'Co', 'Corp', 'Group', 'Partners'];

// Generic word banks for writing tools.
export const ADJECTIVES = [
  'silent', 'ancient', 'golden', 'crimson', 'hidden', 'wandering', 'frozen', 'gentle',
  'restless', 'brave', 'quiet', 'wild', 'distant', 'radiant', 'shattered', 'velvet',
  'hollow', 'endless', 'shining', 'fading', 'electric', 'lonely', 'sacred', 'humble',
  'fierce', 'cosmic', 'amber', 'dusty', 'nimble', 'stormy', 'clever', 'bold',
];
export const NOUNS = [
  'mountain', 'river', 'forest', 'shadow', 'ember', 'harbor', 'meadow', 'comet',
  'lantern', 'echo', 'canyon', 'garden', 'falcon', 'thunder', 'willow', 'horizon',
  'compass', 'anchor', 'phoenix', 'glacier', 'orchid', 'raven', 'summit', 'voyage',
  'engine', 'signal', 'circuit', 'nebula', 'pixel', 'harvest', 'beacon', 'atlas',
];
export const VERBS = [
  'runs', 'whispers', 'builds', 'dreams', 'flows', 'rises', 'wanders', 'glows',
  'breaks', 'sings', 'drifts', 'burns', 'climbs', 'waits', 'turns', 'shines',
];

export const TLDS = ['com', 'io', 'app', 'dev', 'co', 'net', 'org', 'ai', 'xyz', 'tech', 'studio', 'works'];

// Lorem words for JSON/CSV mock text.
export const LOREM_WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud ' +
  'exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure'
).split(' ');
