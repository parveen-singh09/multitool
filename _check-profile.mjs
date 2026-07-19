function cryptoUint32() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}
var rngSource = cryptoUint32;
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  h = Math.imul(h ^ h >>> 16, 2246822507);
  h = Math.imul(h ^ h >>> 13, 3266489909);
  return (h ^= h >>> 16) >>> 0;
}
function mulberry32(seed) {
  let a2 = seed >>> 0;
  return () => {
    a2 = a2 + 1831565813 | 0;
    let t = Math.imul(a2 ^ a2 >>> 15, 1 | a2);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return (t ^ t >>> 14) >>> 0;
  };
}
function setSeed(seed) {
  rngSource = seed == null || seed === "" ? cryptoUint32 : mulberry32(xmur3(seed));
}
function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (max < min) [min, max] = [max, min];
  const range = max - min + 1;
  if (range <= 0) return min;
  const maxValid = Math.floor(4294967295 / range) * range;
  let x = 0;
  do {
    x = rngSource();
  } while (x >= maxValid);
  return min + x % range;
}
function randFloat() {
  return rngSource() / 4294967296;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
var ALPHA_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var DIGITS = "0123456789";
var HEX_LOWER = "0123456789abcdef";
function randString(len, alphabet = ALPHA_UPPER + DIGITS) {
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[randInt(0, alphabet.length - 1)];
  return out;
}
function randHex(len) {
  return randString(len, HEX_LOWER);
}

var LOCALES = [
  {
    key: "us",
    label: "United States",
    flag: "\u{1F1FA}\u{1F1F8}",
    regionLabel: "State",
    firstM: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Steven", "Andrew", "Paul", "Joshua", "Kenneth", "Kevin"],
    firstF: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra", "Margaret", "Ashley", "Emily", "Donna", "Michelle", "Carol"],
    last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Clark"],
    cities: ["Springfield", "Riverside", "Franklin", "Greenville", "Bristol", "Clinton", "Fairview", "Salem", "Madison", "Georgetown", "Arlington", "Ashland", "Burlington", "Manchester", "Oxford", "Dover"],
    streets: ["Main", "Oak", "Pine", "Maple", "Cedar", "Elm", "Washington", "Lake", "Hill", "Park", "Sunset", "Lincoln", "Willow", "Church", "Highland", "Franklin"],
    streetTypes: ["St", "Ave", "Blvd", "Rd", "Ln", "Dr", "Ct", "Pl", "Way", "Ter"],
    regions: ["California", "Texas", "Florida", "New York", "Illinois", "Ohio", "Georgia", "Michigan", "Arizona", "Washington", "Oregon", "Colorado", "Virginia", "Nevada"],
    phone: () => `(${randInt(200, 989)}) 555-01${String(randInt(0, 99)).padStart(2, "0")}`,
    postcode: () => String(randInt(1e4, 99999)),
    streetLine: (n, s, t) => `${n} ${s} ${t}`
  },
  {
    key: "ca",
    label: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    regionLabel: "Province",
    firstM: ["Liam", "Noah", "William", "Benjamin", "Lucas", "Ethan", "Jacob", "Alexandre", "Nathan", "Olivier", "Thomas", "Samuel", "Gabriel", "Logan", "Jack", "Xavier", "\xC9mile", "Owen", "F\xE9lix", "Charles"],
    firstF: ["Emma", "Olivia", "Charlotte", "Sophie", "Ava", "L\xE9a", "Chlo\xE9", "Amelia", "Florence", "Zo\xE9", "Emily", "Rosalie", "Grace", "Alice", "Juliette", "Hannah", "Maya", "Camille", "Sarah", "Beatrice"],
    last: ["Smith", "Brown", "Tremblay", "Martin", "Roy", "Wilson", "Gagnon", "Macdonald", "Taylor", "Lavoie", "Johnson", "Bouchard", "Campbell", "C\xF4t\xE9", "Anderson", "Gauthier", "Morin", "Fortin", "Cameron", "Bergeron"],
    cities: ["Springhill", "Kingston", "Aurora", "Milton", "Cambridge", "Sherbrooke", "Nanaimo", "Brandon", "Moncton", "Guelph", "Barrie", "Kelowna", "Fredericton", "Lethbridge", "Chilliwack", "Trois-Rivi\xE8res"],
    streets: ["Main", "King", "Queen", "Church", "Maple", "Bay", "Dundas", "Wellington", "York", "Front", "Bloor", "Yonge", "Portage", "Rideau", "Notre-Dame", "Sainte-Catherine"],
    streetTypes: ["St", "Ave", "Blvd", "Rd", "Cres", "Dr", "Ln", "Ct", "Pl", "Way"],
    regions: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland and Labrador", "Prince Edward Island", "Northwest Territories", "Yukon", "Nunavut"],
    phone: () => `(${randInt(200, 989)}) 555-01${String(randInt(0, 99)).padStart(2, "0")}`,
    postcode: () => `${pick(["A", "B", "C", "E", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "X", "Y"])}${randInt(0, 9)}${pick(["A", "B", "C", "E", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "Z"])} ${randInt(0, 9)}${pick(["A", "B", "C", "E", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "Z"])}${randInt(0, 9)}`,
    streetLine: (n, s, t) => `${n} ${s} ${t}`
  },
  {
    key: "gb",
    label: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    regionLabel: "County",
    firstM: ["Oliver", "Harry", "George", "Jack", "Charlie", "Thomas", "Jacob", "Alfie", "Freddie", "Oscar", "Henry", "Arthur", "William", "James", "Noah", "Leo", "Archie", "Theo", "Joshua", "Ethan"],
    firstF: ["Olivia", "Amelia", "Isla", "Emily", "Poppy", "Ava", "Isabella", "Jessica", "Lily", "Sophie", "Grace", "Mia", "Evie", "Ella", "Charlotte", "Florence", "Freya", "Daisy", "Phoebe", "Ruby"],
    last: ["Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies", "Robinson", "Wright", "Thompson", "Evans", "Walker", "White", "Roberts", "Green", "Hall", "Wood", "Jackson", "Clarke"],
    cities: ["Manchester", "Bristol", "Leeds", "Sheffield", "Nottingham", "Leicester", "Coventry", "Bradford", "Plymouth", "Norwich", "Reading", "Brighton", "Oxford", "York", "Exeter", "Durham"],
    streets: ["High", "Church", "Station", "Victoria", "Albert", "Queen", "King", "Mill", "Park", "George", "New", "North", "South", "London", "Green", "Manor"],
    streetTypes: ["Street", "Road", "Lane", "Avenue", "Close", "Drive", "Court", "Way", "Gardens", "Crescent", "Grove", "Terrace"],
    regions: ["Greater London", "West Midlands", "Greater Manchester", "Merseyside", "West Yorkshire", "Kent", "Essex", "Surrey", "Hampshire", "Lancashire", "Cheshire", "Devon", "Norfolk", "Nottinghamshire"],
    phone: () => `07700 900${String(randInt(0, 999)).padStart(3, "0")}`,
    postcode: () => `${pick(["SW", "NW", "SE", "EC", "WC", "E", "N", "W", "B", "M", "LS", "G", "EH", "CF", "BS", "L"])}${randInt(1, 20)} ${randInt(1, 9)}${pick(["A", "B", "D", "E", "F", "G", "H", "J", "L", "N", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z"])}${pick(["A", "B", "D", "E", "F", "G", "H", "J", "L", "N", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z"])}`,
    streetLine: (n, s, t) => `${n} ${s} ${t}`
  },
  {
    key: "ie",
    label: "Ireland",
    flag: "\u{1F1EE}\u{1F1EA}",
    regionLabel: "County",
    firstM: ["Jack", "James", "Daniel", "Conor", "Se\xE1n", "Liam", "Cian", "Ois\xEDn", "Fionn", "Darragh", "Cillian", "Patrick", "Michael", "Aaron", "Ryan", "Adam", "R\xEDan", "Tadhg", "Eoin", "Cathal"],
    firstF: ["Emily", "Grace", "Sophie", "Aoife", "Ava", "Ciara", "Saoirse", "Caoimhe", "Niamh", "R\xF3is\xEDn", "Chloe", "Sadhbh", "\xC9abha", "Fiadh", "Aisling", "Muireann", "Clodagh", "\xD3rla", "S\xEDofra", "M\xE9abh"],
    last: ["Murphy", "Kelly", "O'Brien", "Ryan", "O'Sullivan", "Walsh", "O'Connor", "Byrne", "McCarthy", "Gallagher", "Doyle", "Kennedy", "Lynch", "Murray", "Quinn", "Moore", "McLoughlin", "Fitzgerald", "Brennan", "Nolan"],
    cities: ["Cork", "Galway", "Limerick", "Waterford", "Drogheda", "Dundalk", "Swords", "Bray", "Navan", "Kilkenny", "Ennis", "Tralee", "Carlow", "Sligo", "Clonmel", "Wexford"],
    streets: ["O'Connell", "Grafton", "Patrick", "Henry", "Dame", "Abbey", "George's", "Mary", "William", "Thomas", "Camden", "Nassau", "Baggot", "Dawson", "Parnell", "Merrion"],
    streetTypes: ["Street", "Road", "Avenue", "Lane", "Close", "Drive", "Park", "Grove", "Court", "Terrace", "Row", "Green"],
    regions: ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Kerry", "Mayo", "Donegal", "Kildare", "Meath", "Wexford", "Clare", "Tipperary", "Kilkenny"],
    phone: () => `08${pick([3, 5, 6, 7, 9])} ${randInt(100, 999)} ${String(randInt(0, 9999)).padStart(4, "0")}`,
    postcode: () => `${pick(["D", "A", "T", "V", "H", "R", "P", "K", "W", "N", "F", "E", "X", "Y", "C"])}${String(randInt(1, 99)).padStart(2, "0")} ${pick(["A", "C", "D", "E", "F", "H", "K", "N", "P", "R", "T", "V", "W", "X", "Y"])}${randInt(0, 9)}${pick(["A", "C", "D", "E", "F", "H", "K", "N", "P", "R", "T", "V", "W", "X", "Y"])}${randInt(0, 9)}`,
    streetLine: (n, s, t) => `${n} ${s} ${t}`
  },
  {
    key: "au",
    label: "Australia",
    flag: "\u{1F1E6}\u{1F1FA}",
    regionLabel: "State",
    firstM: ["Oliver", "Jack", "William", "Noah", "Thomas", "James", "Lucas", "Henry", "Ethan", "Liam", "Charlie", "Cooper", "Max", "Mason", "Leo", "Harrison", "Xavier", "Jackson", "Hunter", "Archie"],
    firstF: ["Charlotte", "Olivia", "Amelia", "Isla", "Mia", "Ava", "Grace", "Chloe", "Sophie", "Ruby", "Zoe", "Ella", "Willow", "Harper", "Lily", "Evie", "Matilda", "Ivy", "Georgia", "Scarlett"],
    last: ["Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Nguyen", "Johnson", "Martin", "White", "Anderson", "Thompson", "Walker", "Ryan", "Lee", "Robinson", "Kelly", "King", "Harris", "Campbell"],
    cities: ["Geelong", "Newcastle", "Wollongong", "Ballarat", "Bendigo", "Toowoomba", "Cairns", "Townsville", "Launceston", "Mackay", "Rockhampton", "Bunbury", "Bundaberg", "Bathurst", "Dubbo", "Albury"],
    streets: ["George", "Elizabeth", "King", "Queen", "Collins", "Bourke", "Flinders", "Pitt", "Macquarie", "Victoria", "Adelaide", "Swanston", "William", "Church", "Beach", "High"],
    streetTypes: ["St", "Rd", "Ave", "Ct", "Cres", "Dr", "Pl", "Way", "Tce", "Pde", "Cl", "Gr"],
    regions: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"],
    phone: () => `0491 570 ${String(randInt(0, 999)).padStart(3, "0")}`,
    postcode: () => String(randInt(800, 7999)).padStart(4, "0"),
    streetLine: (n, s, t) => `${n} ${s} ${t}`
  },
  {
    key: "nz",
    label: "New Zealand",
    flag: "\u{1F1F3}\u{1F1FF}",
    regionLabel: "Region",
    firstM: ["Oliver", "Jack", "William", "Noah", "James", "Charlie", "Leo", "Lucas", "Thomas", "Mason", "Hunter", "George", "Cooper", "Nikau", "Max", "Ethan", "Liam", "Theo", "Isaac", "Manaia"],
    firstF: ["Charlotte", "Isla", "Olivia", "Amelia", "Harper", "Mia", "Ava", "Ruby", "Willow", "Sophie", "Ella", "Grace", "Lily", "Maia", "Emma", "Aria", "Chloe", "Zoe", "Isabella", "Aroha"],
    last: ["Smith", "Wilson", "Williams", "Brown", "Taylor", "Jones", "Wong", "Anderson", "Thompson", "Martin", "Kaur", "Singh", "Walker", "White", "Clark", "Robertson", "Lee", "Ngata", "Harrison", "Campbell"],
    cities: ["Hamilton", "Tauranga", "Napier", "Palmerston North", "Nelson", "Rotorua", "Whangarei", "New Plymouth", "Invercargill", "Whanganui", "Gisborne", "Timaru", "Masterton", "Blenheim", "Levin", "Ashburton"],
    streets: ["Queen", "Victoria", "Great South", "Ponsonby", "Cuba", "Lambton", "Colombo", "Riccarton", "Devon", "Karangahape", "Willis", "Hereford", "Manukau", "Broadway", "Cameron", "Grey"],
    streetTypes: ["St", "Rd", "Ave", "Cres", "Dr", "Pl", "Way", "Tce", "Cl", "Gr", "Ln", "Quay"],
    regions: ["Auckland", "Wellington", "Canterbury", "Waikato", "Bay of Plenty", "Otago", "Manawat\u016B-Whanganui", "Hawke's Bay", "Northland", "Taranaki", "Southland", "Nelson", "Marlborough", "Gisborne", "West Coast", "Tasman"],
    phone: () => `0${pick([21, 22, 27])} ${randInt(100, 999)} ${randInt(1e3, 9999)}`,
    postcode: () => String(randInt(1e3, 9999)),
    streetLine: (n, s, t) => `${n} ${s} ${t}`
  },
  {
    key: "fr",
    label: "France",
    flag: "\u{1F1EB}\u{1F1F7}",
    regionLabel: "Region",
    firstM: ["Jean", "Pierre", "Michel", "Alain", "Philippe", "Bernard", "Andr\xE9", "Nicolas", "Christophe", "Laurent", "Julien", "David", "Thomas", "S\xE9bastien", "Antoine", "Louis", "Lucas", "Hugo", "Maxime", "Alexandre"],
    firstF: ["Marie", "Nathalie", "Isabelle", "Sylvie", "Catherine", "Fran\xE7oise", "Monique", "Nicole", "Sophie", "Christine", "Anne", "C\xE9line", "Camille", "Julie", "\xC9milie", "Chlo\xE9", "L\xE9a", "Manon", "Sarah", "Aur\xE9lie"],
    last: ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier"],
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Bordeaux", "Lille", "Rennes", "Reims", "Toulon", "Grenoble", "Dijon", "Angers", "N\xEEmes"],
    streets: ["Rue de la Paix", "Avenue Victor Hugo", "Boulevard Saint-Germain", "Rue de Rivoli", "Avenue des Champs-\xC9lys\xE9es", "Rue du Faubourg", "Place de la R\xE9publique", "Rue de la Gare", "Avenue de la Libert\xE9", "Rue des Fleurs", "Boulevard Voltaire", "Rue Nationale", "Avenue Jean Jaur\xE8s", "Rue de l'\xC9glise", "Impasse des Lilas", "Chemin des Vignes"],
    streetTypes: [],
    regions: ["\xCEle-de-France", "Provence-Alpes-C\xF4te d'Azur", "Auvergne-Rh\xF4ne-Alpes", "Nouvelle-Aquitaine", "Occitanie", "Hauts-de-France", "Grand Est", "Bretagne", "Normandie", "Pays de la Loire", "Bourgogne-Franche-Comt\xE9", "Centre-Val de Loire"],
    phone: () => `0${randInt(1, 9)} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")}`,
    postcode: () => String(randInt(1e3, 95999)).padStart(5, "0"),
    streetLine: (n, s, t) => `${n} ${s}`
  },
  {
    key: "de",
    label: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    regionLabel: "Land",
    firstM: ["Michael", "Thomas", "Andreas", "Peter", "Wolfgang", "Klaus", "J\xFCrgen", "Stefan", "Christian", "Frank", "Martin", "Uwe", "Matthias", "Markus", "Alexander", "Sebastian", "Jan", "Florian", "Tobias", "Lukas"],
    firstF: ["Ursula", "Sabine", "Monika", "Petra", "Susanne", "Karin", "Andrea", "Claudia", "Gabriele", "Birgit", "Nicole", "Julia", "Anna", "Katrin", "Sandra", "Nina", "Laura", "Lena", "Sophie", "Marie"],
    last: ["M\xFCller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Sch\xE4fer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schr\xF6der", "Neumann", "Braun", "Zimmermann"],
    cities: ["Berlin", "Hamburg", "M\xFCnchen", "K\xF6ln", "Frankfurt", "Stuttgart", "D\xFCsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hannover", "N\xFCrnberg", "Duisburg", "Bochum"],
    streets: ["Hauptstra\xDFe", "Bahnhofstra\xDFe", "Gartenstra\xDFe", "Dorfstra\xDFe", "Schulstra\xDFe", "Kirchstra\xDFe", "Bergstra\xDFe", "Lindenstra\xDFe", "Waldstra\xDFe", "Ringstra\xDFe", "Goethestra\xDFe", "Schillerstra\xDFe", "M\xFChlenweg", "Am Markt", "Kirchweg", "Rosenweg"],
    streetTypes: [],
    regions: ["Bayern", "Baden-W\xFCrttemberg", "Nordrhein-Westfalen", "Niedersachsen", "Hessen", "Sachsen", "Rheinland-Pfalz", "Berlin", "Schleswig-Holstein", "Brandenburg", "Th\xFCringen", "Hamburg"],
    phone: () => `0${randInt(30, 899)} ${String(randInt(1e5, 9999999))}`,
    postcode: () => String(randInt(1e4, 99999)),
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "ch",
    label: "Switzerland",
    flag: "\u{1F1E8}\u{1F1ED}",
    regionLabel: "Canton",
    firstM: ["Hans", "Peter", "Daniel", "Thomas", "Martin", "Andreas", "Markus", "Stefan", "Christian", "Michael", "Beat", "Urs", "Reto", "Marco", "Simon", "Lukas", "David", "Fabian", "Patrick", "Jonas"],
    firstF: ["Maria", "Anna", "Ruth", "Sandra", "Claudia", "Nicole", "Barbara", "Monika", "Andrea", "Petra", "Laura", "Sarah", "Julia", "Nina", "Lea", "C\xE9line", "Fabienne", "Corinne", "Silvia", "Vreni"],
    last: ["M\xFCller", "Meier", "Schmid", "Keller", "Weber", "Huber", "Schneider", "Meyer", "Steiner", "Fischer", "Gerber", "Brunner", "Baumann", "Frei", "Zimmermann", "Moser", "Widmer", "Bianchi", "Favre", "Rossi"],
    cities: ["Z\xFCrich", "Gen\xE8ve", "Basel", "Lausanne", "Bern", "Winterthur", "Luzern", "St. Gallen", "Lugano", "Biel", "Thun", "K\xF6niz", "Fribourg", "Schaffhausen", "Chur", "Neuch\xE2tel"],
    streets: ["Bahnhofstrasse", "Hauptstrasse", "Dorfstrasse", "Bergstrasse", "Kirchgasse", "Seestrasse", "Gartenstrasse", "Schulstrasse", "Rue du Rh\xF4ne", "Rue de Lausanne", "Marktgasse", "Poststrasse", "Industriestrasse", "Lindenweg", "Rebweg", "Rue de la Gare"],
    streetTypes: [],
    regions: ["Z\xFCrich", "Bern", "Vaud", "Aargau", "St. Gallen", "Gen\xE8ve", "Luzern", "Ticino", "Valais", "Fribourg", "Basel-Stadt", "Graub\xFCnden"],
    phone: () => `0${randInt(21, 91)} ${String(randInt(100, 999))} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")}`,
    postcode: () => String(randInt(1e3, 9999)),
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "nl",
    label: "Netherlands",
    flag: "\u{1F1F3}\u{1F1F1}",
    regionLabel: "Province",
    firstM: ["Jan", "Peter", "Hans", "Kees", "Willem", "Henk", "Gerard", "Johan", "Dirk", "Bram", "Daan", "Sem", "Lucas", "Thijs", "Ruben", "Bas", "Tim", "Rick", "Sander", "Joris"],
    firstF: ["Anna", "Maria", "Johanna", "Sophie", "Emma", "Julia", "Sanne", "Lisa", "Femke", "Anouk", "Marieke", "Ingrid", "Els", "Willemijn", "Fleur", "Eva", "Noa", "Lotte", "Saskia", "Marijke"],
    last: ["De Jong", "Jansen", "De Vries", "Van den Berg", "Van Dijk", "Bakker", "Janssen", "Visser", "Smit", "Meijer", "De Boer", "Mulder", "De Groot", "Bos", "Vos", "Peters", "Hendriks", "Van Leeuwen", "Dekker", "Brouwer"],
    cities: ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven", "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen", "Haarlem", "Arnhem", "Zaanstad", "Amersfoort", "Apeldoorn", "Enschede"],
    streets: ["Kerkstraat", "Dorpsstraat", "Schoolstraat", "Molenweg", "Stationsweg", "Nieuwstraat", "Julianastraat", "Wilhelminastraat", "Beatrixstraat", "Hoofdstraat", "Marktstraat", "Kerkweg", "Prins Hendrikstraat", "Oranjestraat", "Parkweg", "Lindenlaan"],
    streetTypes: [],
    regions: ["Noord-Holland", "Zuid-Holland", "Utrecht", "Gelderland", "Noord-Brabant", "Limburg", "Overijssel", "Friesland", "Groningen", "Drenthe", "Flevoland", "Zeeland"],
    phone: () => `0${randInt(10, 79)} ${String(randInt(100, 999))} ${String(randInt(1e3, 9999))}`,
    postcode: () => `${randInt(1e3, 9999)} ${String.fromCharCode(randInt(65, 90))}${String.fromCharCode(randInt(65, 90))}`,
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "be",
    label: "Belgium",
    flag: "\u{1F1E7}\u{1F1EA}",
    regionLabel: "Province",
    firstM: ["Jan", "Marc", "Luc", "Dirk", "Kevin", "Thomas", "Lucas", "Wouter", "Bart", "Koen", "Pierre", "Nicolas", "Antoine", "Maxime", "Lars", "Noah", "Louis", "Arthur", "Julien", "Tom"],
    firstF: ["Marie", "Sofie", "An", "Els", "Julie", "Emma", "Camille", "L\xE9a", "Ann", "Kaat", "Nathalie", "Sarah", "Lien", "Femke", "Charlotte", "Lore", "Fien", "Manon", "Ines", "Marijke"],
    last: ["Peeters", "Janssens", "Maes", "Jacobs", "Mertens", "Willems", "Claes", "Goossens", "Wouters", "De Smet", "Dubois", "Lambert", "Martin", "Simons", "Vermeulen", "Van Damme", "Dupont", "Hermans", "Segers", "Michiels"],
    cities: ["Brussel", "Antwerpen", "Gent", "Charleroi", "Li\xE8ge", "Brugge", "Namur", "Leuven", "Mons", "Aalst", "Mechelen", "Kortrijk", "Hasselt", "Oostende", "Genk", "Roeselare"],
    streets: ["Kerkstraat", "Dorpstraat", "Stationsstraat", "Rue de la Loi", "Chauss\xE9e de Louvain", "Nieuwstraat", "Molenstraat", "Schoolstraat", "Rue Neuve", "Avenue Louise", "Grote Markt", "Brusselsestraat", "Rue de Namur", "Statiestraat", "Leuvensestraat", "Kloosterstraat"],
    streetTypes: [],
    regions: ["Antwerpen", "Oost-Vlaanderen", "West-Vlaanderen", "Vlaams-Brabant", "Limburg", "Hainaut", "Li\xE8ge", "Namur", "Luxembourg", "Brabant Wallon", "Bruxelles-Capitale", "Waals-Brabant"],
    phone: () => `0${randInt(1, 9)} ${String(randInt(100, 999))} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")}`,
    postcode: () => String(randInt(1e3, 9999)),
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "es",
    label: "Spain",
    flag: "\u{1F1EA}\u{1F1F8}",
    regionLabel: "Provincia",
    firstM: ["Antonio", "Manuel", "Jos\xE9", "Francisco", "David", "Juan", "Javier", "Daniel", "Carlos", "Jes\xFAs", "Alejandro", "Miguel", "Rafael", "Pedro", "\xC1ngel", "Pablo", "Sergio", "Fernando", "Luis", "\xC1lvaro"],
    firstF: ["Mar\xEDa", "Carmen", "Ana", "Isabel", "Laura", "Cristina", "Marta", "Luc\xEDa", "Elena", "Sara", "Paula", "Andrea", "Rosa", "Pilar", "Teresa", "Beatriz", "Silvia", "Nuria", "Raquel", "Alba"],
    last: ["Garc\xEDa", "Rodr\xEDguez", "Gonz\xE1lez", "Fern\xE1ndez", "L\xF3pez", "Mart\xEDnez", "S\xE1nchez", "P\xE9rez", "G\xF3mez", "Mart\xEDn", "Jim\xE9nez", "Ruiz", "Hern\xE1ndez", "D\xEDaz", "Moreno", "Mu\xF1oz", "\xC1lvarez", "Romero", "Alonso", "Guti\xE9rrez"],
    cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "M\xE1laga", "Murcia", "Palma", "Bilbao", "Alicante", "C\xF3rdoba", "Valladolid", "Vigo", "Gij\xF3n", "Granada", "Oviedo"],
    streets: ["Mayor", "Real", "Gran V\xEDa", "Alcal\xE1", "Serrano", "Goya", "Preciados", "Col\xF3n", "Constituci\xF3n", "San Juan", "La Paz", "Vel\xE1zquez", "Toledo", "Atocha", "Princesa", "Bail\xE9n"],
    streetTypes: ["Calle", "Avenida", "Plaza", "Paseo", "Camino", "Ronda", "Traves\xEDa"],
    regions: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "M\xE1laga", "Murcia", "Alicante", "Vizcaya", "Asturias", "Granada", "C\xE1diz", "A Coru\xF1a", "Navarra"],
    phone: () => `+34 ${randInt(600, 999)} ${String(randInt(0, 999)).padStart(3, "0")} ${String(randInt(0, 999)).padStart(3, "0")}`,
    postcode: () => String(randInt(1e3, 52999)).padStart(5, "0"),
    streetLine: (n, s, t) => `${t} ${s} ${n}`
  },
  {
    key: "it",
    label: "Italy",
    flag: "\u{1F1EE}\u{1F1F9}",
    regionLabel: "Regione",
    firstM: ["Giuseppe", "Antonio", "Marco", "Francesco", "Giovanni", "Luca", "Andrea", "Alessandro", "Mario", "Luigi", "Roberto", "Stefano", "Angelo", "Paolo", "Salvatore", "Vincenzo", "Matteo", "Lorenzo", "Davide", "Riccardo"],
    firstF: ["Maria", "Anna", "Giuseppina", "Rosa", "Angela", "Giovanna", "Teresa", "Lucia", "Carla", "Francesca", "Elena", "Sara", "Chiara", "Giulia", "Federica", "Valentina", "Alessia", "Martina", "Laura", "Paola"],
    last: ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Costa", "Giordano", "Mancini", "Rizzo", "Lombardi", "Moretti"],
    cities: ["Roma", "Milano", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze", "Bari", "Catania", "Venezia", "Verona", "Padova", "Trieste", "Brescia", "Parma"],
    streets: ["Roma", "Garibaldi", "Mazzini", "Dante", "Marconi", "Cavour", "Vittorio Emanuele", "Verdi", "Nazionale", "Manzoni", "Matteotti", "XX Settembre", "Trieste", "Milano", "Torino", "Della Repubblica"],
    streetTypes: ["Via", "Viale", "Piazza", "Corso", "Vicolo", "Largo", "Strada"],
    regions: ["Lombardia", "Lazio", "Campania", "Sicilia", "Veneto", "Piemonte", "Puglia", "Emilia-Romagna", "Toscana", "Calabria", "Sardegna", "Liguria", "Marche", "Umbria"],
    phone: () => `+39 3${randInt(10, 99)} ${String(randInt(100, 999))} ${String(randInt(1e3, 9999))}`,
    postcode: () => String(randInt(10, 98168)).padStart(5, "0"),
    streetLine: (n, s, t) => `${t} ${s}, ${n}`
  },
  {
    key: "pt",
    label: "Portugal",
    flag: "\u{1F1F5}\u{1F1F9}",
    regionLabel: "Distrito",
    firstM: ["Jo\xE3o", "Jos\xE9", "Ant\xF3nio", "Francisco", "Manuel", "Pedro", "Carlos", "Lu\xEDs", "Miguel", "Rui", "Paulo", "Ricardo", "Tiago", "Andr\xE9", "Bruno", "Fernando", "Nuno", "Diogo", "Gon\xE7alo", "Vasco"],
    firstF: ["Maria", "Ana", "Sofia", "Beatriz", "In\xEAs", "Mariana", "Margarida", "Catarina", "Rita", "Joana", "Carolina", "Leonor", "Matilde", "Francisca", "Teresa", "Helena", "Cl\xE1udia", "Sara", "Filipa", "Marta"],
    last: ["Silva", "Santos", "Ferreira", "Pereira", "Oliveira", "Costa", "Rodrigues", "Martins", "Jesus", "Sousa", "Fernandes", "Gon\xE7alves", "Gomes", "Lopes", "Marques", "Alves", "Almeida", "Ribeiro", "Pinto", "Carvalho"],
    cities: ["Lisboa", "Porto", "Braga", "Coimbra", "Faro", "Aveiro", "Set\xFAbal", "Funchal", "\xC9vora", "Viseu", "Leiria", "Guimar\xE3es", "Sintra", "Cascais", "Amadora", "Almada"],
    streets: ["Augusta", "da Liberdade", "do Ouro", "Garrett", "dos Cl\xE9rigos", "de Santa Catarina", "da Rep\xFAblica", "25 de Abril", "de S\xE3o Bento", "Cam\xF5es", "do Com\xE9rcio", "Almirante Reis", "da Boavista", "dos Aliados", "da Prata", "de Cedofeita"],
    streetTypes: ["Rua", "Avenida", "Pra\xE7a", "Travessa", "Largo", "Alameda"],
    regions: ["Lisboa", "Porto", "Braga", "Coimbra", "Faro", "Aveiro", "Set\xFAbal", "\xC9vora", "Viseu", "Leiria", "Santar\xE9m", "Beja", "Viana do Castelo", "Guarda"],
    phone: () => `+351 9${randInt(10, 69)} ${String(randInt(0, 999)).padStart(3, "0")} ${String(randInt(0, 999)).padStart(3, "0")}`,
    postcode: () => `${String(randInt(1e3, 9999))}-${String(randInt(0, 999)).padStart(3, "0")}`,
    streetLine: (n, s, t) => `${t} ${s}, ${n}`
  },
  {
    key: "br",
    label: "Brazil",
    flag: "\u{1F1E7}\u{1F1F7}",
    regionLabel: "Estado",
    firstM: ["Jos\xE9", "Jo\xE3o", "Ant\xF4nio", "Francisco", "Carlos", "Paulo", "Pedro", "Lucas", "Luiz", "Marcos", "Gabriel", "Rafael", "Daniel", "Marcelo", "Bruno", "Eduardo", "Felipe", "Rodrigo", "Gustavo", "Matheus"],
    firstF: ["Maria", "Ana", "Francisca", "Ant\xF4nia", "Adriana", "Juliana", "M\xE1rcia", "Fernanda", "Patr\xEDcia", "Aline", "Sandra", "Camila", "Amanda", "Bruna", "J\xE9ssica", "Let\xEDcia", "J\xFAlia", "Luciana", "Vanessa", "Mariana"],
    last: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa"],
    cities: ["S\xE3o Paulo", "Rio de Janeiro", "Bras\xEDlia", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Bel\xE9m", "Goi\xE2nia", "Guarulhos", "Campinas", "Natal", "Macei\xF3"],
    streets: ["das Flores", "XV de Novembro", "Sete de Setembro", "do Com\xE9rcio", "S\xE3o Jo\xE3o", "Get\xFAlio Vargas", "Marechal Deodoro", "Rio Branco", "da Paz", "Santos Dumont", "Bar\xE3o do Rio Branco", "Amazonas", "Paulista", "Brasil", "dos Andradas", "Tiradentes"],
    streetTypes: ["Rua", "Avenida", "Travessa", "Alameda", "Pra\xE7a", "Rodovia"],
    regions: ["S\xE3o Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paran\xE1", "Rio Grande do Sul", "Pernambuco", "Cear\xE1", "Par\xE1", "Santa Catarina", "Goi\xE1s", "Amazonas", "Esp\xEDrito Santo", "Maranh\xE3o"],
    phone: () => `+55 (${randInt(11, 99)}) 9${randInt(1e3, 9999)}-${randInt(1e3, 9999)}`,
    postcode: () => `${String(randInt(1e3, 99999)).padStart(5, "0")}-${String(randInt(0, 999)).padStart(3, "0")}`,
    streetLine: (n, s, t) => `${t} ${s}, ${n}`
  },
  {
    key: "mx",
    label: "Mexico",
    flag: "\u{1F1F2}\u{1F1FD}",
    regionLabel: "Estado",
    firstM: ["Jos\xE9", "Juan", "Miguel", "Luis", "Carlos", "Francisco", "Jes\xFAs", "Antonio", "Alejandro", "Manuel", "Fernando", "Ricardo", "Roberto", "Eduardo", "Jorge", "Sergio", "Rafael", "Daniel", "Javier", "Arturo"],
    firstF: ["Mar\xEDa", "Guadalupe", "Juana", "Margarita", "Ver\xF3nica", "Leticia", "Alejandra", "Rosa", "Patricia", "Adriana", "Gabriela", "Yolanda", "Fernanda", "Mariana", "Andrea", "Daniela", "Alma", "Claudia", "Luc\xEDa", "Sof\xEDa"],
    last: ["Hern\xE1ndez", "Garc\xEDa", "Mart\xEDnez", "L\xF3pez", "Gonz\xE1lez", "P\xE9rez", "Rodr\xEDguez", "S\xE1nchez", "Ram\xEDrez", "Cruz", "Flores", "G\xF3mez", "Morales", "V\xE1zquez", "Reyes", "Jim\xE9nez", "Torres", "D\xEDaz", "Guti\xE9rrez", "Mendoza"],
    cities: ["Ciudad de M\xE9xico", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Le\xF3n", "Ju\xE1rez", "Zapopan", "M\xE9rida", "San Luis Potos\xED", "Aguascalientes", "Quer\xE9taro", "Cuernavaca", "Culiac\xE1n", "Toluca", "Canc\xFAn"],
    streets: ["Hidalgo", "Ju\xE1rez", "Morelos", "Reforma", "Madero", "Independencia", "5 de Mayo", "Insurgentes", "Zaragoza", "Allende", "Revoluci\xF3n", "Guerrero", "Constituci\xF3n", "16 de Septiembre", "Col\xF3n", "Matamoros"],
    streetTypes: ["Calle", "Avenida", "Boulevard", "Calzada", "Privada", "Callej\xF3n", "Paseo"],
    regions: ["Jalisco", "Nuevo Le\xF3n", "Puebla", "Veracruz", "Guanajuato", "Chihuahua", "Michoac\xE1n", "Oaxaca", "Sonora", "Yucat\xE1n", "Sinaloa", "Quer\xE9taro", "Coahuila", "Chiapas"],
    phone: () => `+52 ${randInt(55, 99)} ${randInt(1e3, 9999)} ${randInt(1e3, 9999)}`,
    postcode: () => String(randInt(1e3, 99999)).padStart(5, "0"),
    streetLine: (n, s, t) => `${t} ${s} ${n}`
  },
  {
    key: "dk",
    label: "Denmark",
    flag: "\u{1F1E9}\u{1F1F0}",
    regionLabel: "County",
    firstM: ["Lars", "Peter", "Jens", "Michael", "Henrik", "Thomas", "S\xF8ren", "Martin", "Christian", "Jan", "Morten", "Anders", "Niels", "Jesper", "Mads", "Rasmus", "Kim", "Kasper", "Frederik", "Mikkel"],
    firstF: ["Anne", "Kirsten", "Mette", "Hanne", "Anna", "Helle", "Susanne", "Lene", "Maria", "Marianne", "Camilla", "Louise", "Pia", "Bente", "Karen", "Ida", "Emma", "Freja", "Sofie", "Julie"],
    last: ["Jensen", "Nielsen", "Hansen", "Pedersen", "Andersen", "Christensen", "Larsen", "S\xF8rensen", "Rasmussen", "J\xF8rgensen", "Petersen", "Madsen", "Kristensen", "Olsen", "Thomsen", "Christiansen", "Poulsen", "Johansen", "M\xF8ller", "Mortensen"],
    cities: ["K\xF8benhavn", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde", "Herning", "Helsing\xF8r", "Silkeborg", "N\xE6stved", "Fredericia", "Viborg"],
    streets: ["N\xF8rregade", "Vestergade", "\xD8stergade", "S\xF8ndergade", "Algade", "Bredgade", "Strandvejen", "Skovvej", "Hovedgaden", "Kirkevej", "Langgade", "Adelgade", "Nygade", "Havnegade", "Torvegade", "Bakkevej"],
    streetTypes: [],
    regions: ["K\xF8benhavn", "Frederiksborg", "Roskilde", "Vestsj\xE6lland", "Storstr\xF8m", "Bornholm", "Fyn", "S\xF8nderjylland", "Ribe", "Vejle", "Ringk\xF8bing", "\xC5rhus", "Viborg", "Nordjylland"],
    phone: () => `+45 ${randInt(20, 89)} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")}`,
    postcode: () => String(randInt(1e3, 9990)),
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "no",
    label: "Norway",
    flag: "\u{1F1F3}\u{1F1F4}",
    regionLabel: "Fylke",
    firstM: ["Jan", "Per", "Bj\xF8rn", "Ole", "Kjell", "Lars", "Knut", "Svein", "Arne", "Odd", "Geir", "Nils", "Terje", "Morten", "Hans", "Erik", "Anders", "H\xE5kon", "Fredrik", "Magnus"],
    firstF: ["Anne", "Inger", "Kari", "Marit", "Ingrid", "Liv", "Berit", "Astrid", "Solveig", "Bj\xF8rg", "Hilde", "Nina", "Randi", "Marianne", "Ida", "Ingunn", "Silje", "Maria", "Nora", "Emma"],
    last: ["Hansen", "Johansen", "Olsen", "Larsen", "Andersen", "Pedersen", "Nilsen", "Kristiansen", "Jensen", "Karlsen", "Johnsen", "Pettersen", "Eriksen", "Berg", "Haugen", "Hagen", "Johannessen", "Andreassen", "Jacobsen", "Halvorsen"],
    cities: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand", "Sandnes", "Troms\xF8", "Sarpsborg", "Skien", "\xC5lesund", "Sandefjord", "Haugesund", "T\xF8nsberg", "Moss"],
    streets: ["Storgata", "Kirkeveien", "Skoleveien", "Nygata", "Strandveien", "Solbakken", "Bj\xF8rkeveien", "Furuveien", "Granveien", "Hovedveien", "Parkveien", "\xC5sveien", "Fjellveien", "Elveveien", "Skogveien", "Havneveien"],
    streetTypes: [],
    regions: ["\xD8stfold", "Akershus", "Oslo", "Hedmark", "Oppland", "Buskerud", "Vestfold", "Telemark", "Aust-Agder", "Vest-Agder", "Rogaland", "Hordaland", "Sogn og Fjordane", "M\xF8re og Romsdal", "Tr\xF8ndelag", "Nordland", "Troms", "Finnmark"],
    phone: () => `+47 ${randInt(400, 999)} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 999)).padStart(3, "0")}`,
    postcode: () => String(randInt(1, 9990)).padStart(4, "0"),
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "se",
    label: "Sweden",
    flag: "\u{1F1F8}\u{1F1EA}",
    regionLabel: "L\xE4n",
    firstM: ["Lars", "Karl", "Anders", "Per", "Johan", "Nils", "Erik", "Lennart", "Mikael", "Jan", "Hans", "Bengt", "Bo", "G\xF6ran", "Peter", "Sven", "Fredrik", "Gustav", "Bj\xF6rn", "\xC5ke"],
    firstF: ["Anna", "Eva", "Maria", "Karin", "Kristina", "Birgitta", "Sara", "Lena", "Emma", "Kerstin", "Marie", "Ingrid", "Sofia", "Linn\xE9a", "Elin", "Astrid", "Ida", "Malin", "Josefin", "Klara"],
    last: ["Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson", "Pettersson", "Jonsson", "Jansson", "Hansson", "Bengtsson", "J\xF6nsson", "Lindberg", "Lindstr\xF6m", "Lindqvist", "Berg"],
    cities: ["Stockholm", "G\xF6teborg", "Malm\xF6", "Uppsala", "V\xE4ster\xE5s", "\xD6rebro", "Link\xF6ping", "Helsingborg", "J\xF6nk\xF6ping", "Norrk\xF6ping", "Lund", "Ume\xE5", "G\xE4vle", "Bor\xE5s", "S\xF6dert\xE4lje", "Eskilstuna"],
    streets: ["Storgatan", "Kungsgatan", "Drottninggatan", "Skolgatan", "Nygatan", "J\xE4rnv\xE4gsgatan", "Parkv\xE4gen", "Skogsv\xE4gen", "Strandv\xE4gen", "Kyrkogatan", "Villagatan", "Bj\xF6rkv\xE4gen", "Ekv\xE4gen", "Sveav\xE4gen", "Backv\xE4gen", "Ringv\xE4gen"],
    streetTypes: [],
    regions: ["Stockholms l\xE4n", "Uppsala l\xE4n", "S\xF6dermanlands l\xE4n", "\xD6sterg\xF6tlands l\xE4n", "J\xF6nk\xF6pings l\xE4n", "Kronobergs l\xE4n", "Kalmar l\xE4n", "Gotlands l\xE4n", "Blekinge l\xE4n", "Sk\xE5ne l\xE4n", "Hallands l\xE4n", "V\xE4stra G\xF6talands l\xE4n", "V\xE4rmlands l\xE4n", "\xD6rebro l\xE4n", "V\xE4stmanlands l\xE4n", "Dalarnas l\xE4n", "G\xE4vleborgs l\xE4n", "V\xE4sternorrlands l\xE4n", "J\xE4mtlands l\xE4n", "V\xE4sterbottens l\xE4n", "Norrbottens l\xE4n"],
    phone: () => `+46 ${randInt(70, 76)}-${String(randInt(0, 999)).padStart(3, "0")} ${String(randInt(0, 99)).padStart(2, "0")} ${String(randInt(0, 99)).padStart(2, "0")}`,
    postcode: () => `${randInt(100, 984)} ${String(randInt(0, 99)).padStart(2, "0")}`,
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "fi",
    label: "Finland",
    flag: "\u{1F1EB}\u{1F1EE}",
    regionLabel: "Region",
    firstM: ["Juhani", "Matti", "Mikael", "Kari", "Antti", "Timo", "Jari", "Petri", "Jukka", "Mika", "Ville", "Pekka", "Hannu", "Markku", "Heikki", "Sami", "Janne", "Marko", "Tero", "Aleksi"],
    firstF: ["Maria", "Anneli", "Johanna", "Kaarina", "Anna", "Liisa", "Helena", "Sofia", "Emilia", "Marjatta", "Hannele", "Tuula", "Riitta", "P\xE4ivi", "Elina", "Katariina", "Aino", "Kirsi", "Laura", "Satu"],
    last: ["Korhonen", "Virtanen", "M\xE4kinen", "Nieminen", "M\xE4kel\xE4", "H\xE4m\xE4l\xE4inen", "Laine", "Heikkinen", "Koskinen", "J\xE4rvinen", "Lehtonen", "Lehtinen", "Saarinen", "Salminen", "Heinonen", "Niemi", "Heikkil\xE4", "Kinnunen", "Salonen", "Turunen"],
    cities: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyv\xE4skyl\xE4", "Lahti", "Kuopio", "Pori", "Kouvola", "Joensuu", "Lappeenranta", "H\xE4meenlinna", "Vaasa", "Rovaniemi"],
    streets: ["Keskuskatu", "Kauppakatu", "Asemakatu", "Koulukatu", "Puistokatu", "Rautatienkatu", "Mannerheimintie", "H\xE4meentie", "Kirkkokatu", "Satamakatu", "Torikatu", "Kirkkotie", "Rantatie", "Koivutie", "Mets\xE4tie", "Kalliotie"],
    streetTypes: [],
    regions: ["Uusimaa", "Varsinais-Suomi", "Satakunta", "Kanta-H\xE4me", "Pirkanmaa", "P\xE4ij\xE4t-H\xE4me", "Kymenlaakso", "Etel\xE4-Karjala", "Etel\xE4-Savo", "Pohjois-Savo", "Pohjois-Karjala", "Keski-Suomi", "Etel\xE4-Pohjanmaa", "Pohjanmaa", "Keski-Pohjanmaa", "Pohjois-Pohjanmaa", "Kainuu", "Lappi"],
    phone: () => `+358 ${randInt(40, 50)} ${String(randInt(0, 999)).padStart(3, "0")} ${String(randInt(0, 9999)).padStart(4, "0")}`,
    postcode: () => String(randInt(100, 99990)).padStart(5, "0"),
    streetLine: (n, s, t) => `${s} ${n}`
  },
  {
    key: "in",
    label: "India",
    flag: "\u{1F1EE}\u{1F1F3}",
    regionLabel: "State",
    firstM: ["Aarav", "Vivaan", "Aditya", "Arjun", "Rohan", "Rahul", "Amit", "Vikram", "Sanjay", "Rajesh", "Ravi", "Karan", "Nikhil", "Ankit", "Suresh", "Deepak", "Manish", "Pradeep", "Sandeep", "Ajay", "Vishal", "Gaurav"],
    firstF: ["Aanya", "Priya", "Sneha", "Pooja", "Neha", "Anjali", "Kavya", "Divya", "Meera", "Riya", "Shreya", "Ananya", "Isha", "Nisha", "Swati", "Ritu", "Sunita", "Kiran", "Deepika", "Aishwarya", "Pallavi", "Radha"],
    last: ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Nair", "Rao", "Mehta", "Joshi", "Iyer", "Chauhan", "Malhotra", "Kapoor", "Desai", "Bhat", "Menon", "Chopra", "Agarwal"],
    cities: ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna"],
    streets: ["MG", "Nehru", "Gandhi", "Station", "Ring", "Ashok", "Link", "Mall", "College", "Market", "Brigade", "Residency", "Rajpur", "Napier", "Commercial", "Park"],
    streetTypes: ["Road", "Marg", "Street", "Lane", "Path", "Nagar"],
    regions: ["Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Gujarat", "Rajasthan", "West Bengal", "Kerala", "Punjab", "Haryana", "Bihar", "Madhya Pradesh", "Telangana", "Delhi"],
    phone: () => `+91 ${randInt(7e4, 99999)} ${String(randInt(0, 99999)).padStart(5, "0")}`,
    postcode: () => String(randInt(1e5, 999999)),
    streetLine: (n, s, t) => `${n} ${s} ${t}`
  },
  {
    key: "ir",
    label: "Iran",
    flag: "\u{1F1EE}\u{1F1F7}",
    regionLabel: "Province",
    firstM: ["Ali", "Reza", "Mohammad", "Hossein", "Amir", "Mehdi", "Hassan", "Ahmad", "Saeed", "Majid", "Behrouz", "Farhad", "Kaveh", "Kamran", "Navid", "Omid", "Payam", "Ramin", "Siavash", "Vahid", "Arash", "Babak"],
    firstF: ["Fatemeh", "Zahra", "Maryam", "Sara", "Leila", "Nazanin", "Shirin", "Parisa", "Mahsa", "Niloufar", "Elham", "Golnaz", "Yasaman", "Roya", "Mina", "Nasrin", "Azadeh", "Bahar", "Fariba", "Neda", "Setareh", "Tara"],
    last: ["Ahmadi", "Mohammadi", "Hosseini", "Rezaei", "Karimi", "Moradi", "Jafari", "Rahimi", "Bagheri", "Kazemi", "Ghasemi", "Nazari", "Sadeghi", "Ebrahimi", "Alavi", "Tehrani", "Shirazi", "Esfahani", "Rostami", "Yazdani"],
    cities: ["Tehran", "Mashhad", "Isfahan", "Karaj", "Shiraz", "Tabriz", "Qom", "Ahvaz", "Kermanshah", "Urmia", "Rasht", "Zahedan", "Hamadan", "Yazd", "Ardabil", "Bandar Abbas"],
    streets: ["Valiasr", "Ferdowsi", "Enghelab", "Azadi", "Motahari", "Shariati", "Hafez", "Saadi", "Kargar", "Taleghani", "Beheshti", "Vanak", "Mirdamad", "Jomhouri", "Keshavarz", "Pasdaran"],
    streetTypes: ["St", "Ave", "Blvd", "Sq", "Ln"],
    regions: ["Tehran", "Isfahan", "Fars", "Khorasan Razavi", "East Azerbaijan", "Khuzestan", "Mazandaran", "Gilan", "Kerman", "Alborz", "Qom", "Yazd", "Hamadan", "Ardabil"],
    phone: () => `+98 9${randInt(10, 39)} ${String(randInt(100, 999))} ${String(randInt(1e3, 9999))}`,
    postcode: () => String(randInt(1e9, 9999999999)),
    streetLine: (n, s, t) => `No. ${n} ${s} ${t}`
  },
  {
    key: "tr",
    label: "Turkey",
    flag: "\u{1F1F9}\u{1F1F7}",
    regionLabel: "Province",
    firstM: ["Mehmet", "Mustafa", "Ahmet", "Ali", "H\xFCseyin", "Hasan", "\u0130brahim", "Osman", "Yusuf", "Murat", "\xD6mer", "Emre", "Burak", "Cem", "Serkan", "Kaan", "Onur", "Bar\u0131\u015F", "Deniz", "Tolga", "Levent", "Volkan"],
    firstF: ["Ay\u015Fe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Merve", "B\xFC\u015Fra", "Esra", "\xD6zlem", "Selin", "Ebru", "G\xFCl", "Derya", "Cansu", "Sevgi", "Ya\u011Fmur", "Melike", "Damla", "Ceren", "Asl\u0131", "P\u0131nar"],
    last: ["Y\u0131lmaz", "Kaya", "Demir", "\u015Eahin", "\xC7elik", "Y\u0131ld\u0131z", "Y\u0131ld\u0131r\u0131m", "\xD6zt\xFCrk", "Ayd\u0131n", "\xD6zdemir", "Arslan", "Do\u011Fan", "K\u0131l\u0131\xE7", "Aslan", "\xC7etin", "Kara", "Ko\xE7", "Kurt", "\xD6zkan", "\u015Eim\u015Fek"],
    cities: ["\u0130stanbul", "Ankara", "\u0130zmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri", "Eski\u015Fehir", "Diyarbak\u0131r", "Samsun", "Denizli", "Trabzon", "Malatya"],
    streets: ["Atat\xFCrk", "\u0130n\xF6n\xFC", "Cumhuriyet", "Fevzi \xC7akmak", "Gazi", "\u0130stiklal", "Ba\u011Fdat", "Barbaros", "Mevlana", "Fatih", "K\u0131z\u0131lay", "Alsancak", "Kordon", "Vatan", "Millet", "Talatpa\u015Fa"],
    streetTypes: ["Cad.", "Sok.", "Bul."],
    regions: ["\u0130stanbul", "Ankara", "\u0130zmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri", "Eski\u015Fehir", "Trabzon", "Samsun", "Mu\u011Fla"],
    phone: () => `+90 5${randInt(30, 59)} ${String(randInt(100, 999))} ${String(randInt(10, 99))} ${String(randInt(10, 99))}`,
    postcode: () => String(randInt(1e3, 81999)).padStart(5, "0"),
    streetLine: (n, s, t) => `${s} ${t} No: ${n}`
  },
  {
    key: "ua",
    label: "Ukraine",
    flag: "\u{1F1FA}\u{1F1E6}",
    regionLabel: "Oblast",
    firstM: ["Oleksandr", "Andriy", "Serhiy", "Dmytro", "Volodymyr", "Mykola", "Ivan", "Vasyl", "Petro", "Oleh", "Yuriy", "Viktor", "Bohdan", "Taras", "Roman", "Maksym", "Vitaliy", "Ihor", "Pavlo", "Denys", "Artem", "Yaroslav"],
    firstF: ["Olena", "Nataliya", "Tetiana", "Iryna", "Oksana", "Kateryna", "Svitlana", "Yuliya", "Anna", "Mariya", "Halyna", "Viktoriya", "Nadiya", "Larysa", "Olha", "Sofiya", "Daryna", "Vira", "Lyudmyla", "Alina", "Solomiya", "Khrystyna"],
    last: ["Shevchenko", "Melnyk", "Boyko", "Kovalenko", "Bondarenko", "Tkachenko", "Kravchenko", "Oliynyk", "Shevchuk", "Polishchuk", "Koval", "Marchenko", "Rudenko", "Savchenko", "Petrenko", "Klymenko", "Moroz", "Lysenko", "Ivanchuk", "Tkachuk"],
    cities: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv", "Kryvyi Rih", "Mykolaiv", "Vinnytsia", "Poltava", "Chernihiv", "Cherkasy", "Sumy", "Zhytomyr", "Rivne"],
    streets: ["Shevchenka", "Franka", "Lesi Ukrainky", "Khreshchatyk", "Sadova", "Soborna", "Hrushevskoho", "Bandery", "Sichovykh Striltsiv", "Peremohy", "Nezalezhnosti", "Zelena", "Naukova", "Heroiv", "Kyivska", "Lvivska"],
    streetTypes: ["St", "Ave", "Blvd", "Ln"],
    regions: ["Kyiv", "Kharkiv", "Odesa", "Dnipropetrovsk", "Lviv", "Zaporizhzhia", "Vinnytsia", "Poltava", "Chernihiv", "Cherkasy", "Zhytomyr", "Rivne", "Ternopil", "Volyn"],
    phone: () => `+380 ${randInt(50, 99)} ${String(randInt(100, 999))} ${String(randInt(10, 99))} ${String(randInt(10, 99))}`,
    postcode: () => String(randInt(1e3, 99999)).padStart(5, "0"),
    streetLine: (n, s, t) => `${s} ${t}, ${n}`
  },
  {
    key: "rs",
    label: "Serbia",
    flag: "\u{1F1F7}\u{1F1F8}",
    regionLabel: "District",
    firstM: ["Nikola", "Marko", "Stefan", "Luka", "Milo\u0161", "Nemanja", "Aleksandar", "Du\u0161an", "Vladimir", "Jovan", "Milan", "Petar", "\u0110or\u0111e", "Filip", "Uro\u0161", "Bogdan", "Lazar", "Ivan", "Nenad", "Zoran", "Dragan", "Vuk"],
    firstF: ["Jelena", "Marija", "Ana", "Milica", "Ivana", "Jovana", "Katarina", "Tijana", "Sofija", "Teodora", "Aleksandra", "Nata\u0161a", "Dragana", "Sanja", "Tamara", "Vesna", "Sne\u017Eana", "Danijela", "Nevena", "An\u0111ela", "Kristina", "Mila"],
    last: ["Jovanovi\u0107", "Petrovi\u0107", "Nikoli\u0107", "Markovi\u0107", "\u0110or\u0111evi\u0107", "Stojanovi\u0107", "Ili\u0107", "Stankovi\u0107", "Pavlovi\u0107", "Milo\u0161evi\u0107", "Popovi\u0107", "Kova\u010Devi\u0107", "Todorovi\u0107", "Risti\u0107", "Simi\u0107", "Luki\u0107", "Mili\u0107", "\u0110uri\u0107", "Ivanovi\u0107", "Savi\u0107"],
    cities: ["Beograd", "Novi Sad", "Ni\u0161", "Kragujevac", "Subotica", "Zrenjanin", "Pan\u010Devo", "\u010Ca\u010Dak", "Kraljevo", "Novi Pazar", "Leskovac", "Smederevo", "Valjevo", "Kru\u0161evac", "Vranje", "\u0160abac"],
    streets: ["Knez Mihailova", "Kralja Petra", "Bulevar Oslobo\u0111enja", "Cara Du\u0161ana", "Nemanjina", "Vojvode Stepe", "Takovska", "Terazije", "Skadarska", "Njego\u0161eva", "Kara\u0111or\u0111eva", "Balkanska", "Sarajevska", "Resavska", "Beogradska", "Maksima Gorkog"],
    streetTypes: [],
    regions: ["Belgrade", "Vojvodina", "\u0160umadija", "Ma\u010Dva", "Kolubara", "Podunavlje", "Brani\u010Devo", "Pomoravlje", "Ni\u0161ava", "Zlatibor", "Ra\u0161ka", "Rasina", "Toplica", "P\u010Dinja"],
    phone: () => `+381 6${randInt(0, 6)} ${String(randInt(100, 999))} ${String(randInt(1e3, 9999))}`,
    postcode: () => String(randInt(11e3, 38999)),
    streetLine: (n, s, t) => `${s} ${n}`
  }
];
var LOCALE_BY_KEY = new Map(LOCALES.map((l) => [l.key, l]));
function getLocale(key) {
  return LOCALE_BY_KEY.get(key) ?? pick(LOCALES);
}

var EMAIL_DOMAINS = [
  "example.com",
  "mail.com",
  "test.org",
  "demo.net",
  "inbox.com",
  "sample.io",
  "placeholder.dev",
  "noreply.co"
];
var ADJECTIVES = [
  "silent",
  "ancient",
  "golden",
  "crimson",
  "hidden",
  "wandering",
  "frozen",
  "gentle",
  "restless",
  "brave",
  "quiet",
  "wild",
  "distant",
  "radiant",
  "shattered",
  "velvet",
  "hollow",
  "endless",
  "shining",
  "fading",
  "electric",
  "lonely",
  "sacred",
  "humble",
  "fierce",
  "cosmic",
  "amber",
  "dusty",
  "nimble",
  "stormy",
  "clever",
  "bold"
];
var NOUNS = [
  "mountain",
  "river",
  "forest",
  "shadow",
  "ember",
  "harbor",
  "meadow",
  "comet",
  "lantern",
  "echo",
  "canyon",
  "garden",
  "falcon",
  "thunder",
  "willow",
  "horizon",
  "compass",
  "anchor",
  "phoenix",
  "glacier",
  "orchid",
  "raven",
  "summit",
  "voyage",
  "engine",
  "signal",
  "circuit",
  "nebula",
  "pixel",
  "harvest",
  "beacon",
  "atlas"
];
var LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure".split(" ");

function email(first, last) {
  const sep = pick([".", "_", ""]);
  const tail = randInt(0, 1) ? String(randInt(1, 999)) : "";
  return `${first}${sep}${last}${tail}`.toLowerCase().replace(/[^a-z0-9._]/g, "") + "@" + pick(EMAIL_DOMAINS);
}
function username() {
  const style = randInt(0, 2);
  const a2 = pick(ADJECTIVES), n = pick(NOUNS);
  if (style === 0) return `${a2}_${n}${randInt(1, 99)}`;
  if (style === 1) return `${a2}${n[0].toUpperCase()}${n.slice(1)}`;
  return `${n}${randInt(100, 9999)}`;
}
var TITLES_M = ["Mr", "Dr", "Prof"];
var TITLES_F = ["Ms", "Mrs", "Miss", "Dr", "Prof"];
var PW_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
var TIMEZONES = [
  { offset: "-08:00", name: "America/Los_Angeles" },
  { offset: "-05:00", name: "America/New_York" },
  { offset: "+00:00", name: "Europe/London" },
  { offset: "+01:00", name: "Europe/Paris" },
  { offset: "+02:00", name: "Europe/Athens" },
  { offset: "+03:00", name: "Europe/Moscow" },
  { offset: "+05:30", name: "Asia/Kolkata" },
  { offset: "+08:00", name: "Asia/Shanghai" },
  { offset: "+09:00", name: "Asia/Tokyo" },
  { offset: "+10:00", name: "Australia/Sydney" }
];
function uuid() {
  const h = randHex(32).split("");
  h[12] = "4";
  h[16] = "89ab"[randInt(0, 3)];
  const s = h.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}
function password(len = 12) {
  let out = "";
  for (let i = 0; i < len; i++) out += PW_CHARS[randInt(0, PW_CHARS.length - 1)];
  return out;
}
function dateYearsAgo(years) {
  const now = /* @__PURE__ */ new Date();
  const d = new Date(now.getFullYear() - years, randInt(0, 11), randInt(1, 28));
  const age = now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return { date: d.toISOString().slice(0, 10), age };
}
function profile(opts = {}) {
  const loc = getLocale(opts.nat ?? "any");
  const sex = opts.sex === "male" || opts.sex === "female" ? opts.sex : randInt(0, 1) ? "male" : "female";
  const first = pick(sex === "male" ? loc.firstM : loc.firstF);
  const last = pick(loc.last);
  const title = pick(sex === "male" ? TITLES_M : TITLES_F);
  const streetType = loc.streetTypes.length ? pick(loc.streetTypes) : "";
  const dob = dateYearsAgo(randInt(18, 80));
  const registered = dateYearsAgo(randInt(0, 12));
  return {
    gender: sex,
    title,
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`,
    initials: (first[0] + last[0]).toUpperCase(),
    username: username(),
    email: email(first, last),
    password: password(),
    phone: loc.phone(),
    cell: loc.phone(),
    uuid: uuid(),
    age: dob.age,
    dob: dob.date,
    registered: registered.date,
    nat: loc.key.toUpperCase(),
    nationality: loc.label,
    flag: loc.flag,
    location: {
      street: loc.streetLine(randInt(1, 9999), pick(loc.streets), streetType),
      city: pick(loc.cities),
      [loc.regionLabel.toLowerCase()]: pick(loc.regions),
      postcode: loc.postcode(),
      country: loc.label,
      coordinates: {
        latitude: +(randFloat() * 180 - 90).toFixed(4),
        longitude: +(randFloat() * 360 - 180).toFixed(4)
      },
      timezone: pick(TIMEZONES)
    }
  };
}

import assert from "node:assert";
setSeed("project-x");
var a = profile({ nat: "fr", sex: "female" });
setSeed("project-x");
var b = profile({ nat: "fr", sex: "female" });
assert.deepStrictEqual(a, b, "same seed must reproduce identical profile");
setSeed("other");
var c = profile({ nat: "fr", sex: "female" });
assert.notDeepStrictEqual(a, c, "different seed should differ");
setSeed(null);
var de = profile({ nat: "de" });
assert.ok("land" in de.location, "de uses Land region key: " + Object.keys(de.location));
assert.match(de.uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, "uuid v4");
assert.ok(de.age >= 18 && de.age <= 80, "age in range: " + de.age);
assert.ok(de.nat === "DE" && de.nationality === "Germany");
for (const l of LOCALES) {
  const p = profile({ nat: l.key });
  assert.ok(p.location.street && p.location.postcode && p.phone, "complete: " + l.key);
}
assert.equal(LOCALES.length, 25, "expected 25 locales, got " + LOCALES.length);
console.log("OK profile checks passed \u2014", LOCALES.length, "locales");
console.log("sample (fr, seed project-x):", JSON.stringify(a).slice(0, 320));
