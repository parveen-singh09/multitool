// Static data banks for the fun / naming generators.
// Plain named exports so each tool page tree-shakes only the banks it imports.
// All lists are self-contained — the tools run fully in the browser.

/* ------------------------------------------------------------------ *
 * Pictionary
 * ------------------------------------------------------------------ */
export interface PictionaryBank {
  easy: string[];
  medium: string[];
  hard: string[];
}

export const PICTIONARY: PictionaryBank = {
  easy: [
    'apple', 'ball', 'cat', 'dog', 'house', 'sun', 'moon', 'star', 'tree', 'car',
    'boat', 'fish', 'bird', 'hat', 'shoe', 'book', 'cup', 'key', 'door', 'clock',
    'chair', 'table', 'bed', 'lamp', 'flower', 'cloud', 'rain', 'snow', 'fire', 'ice',
    'egg', 'cake', 'pizza', 'banana', 'carrot', 'spider', 'snake', 'frog', 'bee', 'ant',
    'eye', 'nose', 'hand', 'foot', 'smile', 'heart', 'kite', 'drum', 'bell', 'flag',
  ],
  medium: [
    'airport', 'birthday', 'campfire', 'dentist', 'elephant', 'fountain', 'guitar',
    'hamburger', 'igloo', 'jellyfish', 'kangaroo', 'lighthouse', 'mailbox', 'newspaper',
    'octopus', 'penguin', 'quicksand', 'rainbow', 'sandcastle', 'telescope', 'umbrella',
    'volcano', 'waterfall', 'xylophone', 'yardstick', 'zipper', 'astronaut', 'bicycle',
    'chandelier', 'dinosaur', 'escalator', 'fireworks', 'greenhouse', 'helicopter',
    'iceberg', 'jackpot', 'keyboard', 'lawnmower', 'microphone', 'notebook', 'orchestra',
    'parachute', 'quarantine', 'refrigerator', 'skateboard', 'treasure', 'unicorn',
    'vampire', 'windmill', 'zombie',
  ],
  hard: [
    'acceleration', 'bureaucracy', 'claustrophobia', 'déjà vu', 'entrepreneur',
    'foreshadowing', 'gravity', 'hypothesis', 'inflation', 'jetlag', 'kaleidoscope',
    'loophole', 'metabolism', 'nostalgia', 'optimism', 'photosynthesis', 'quarantine',
    'recession', 'serendipity', 'telepathy', 'utopia', 'vertigo', 'wanderlust',
    'xenophobia', 'yin and yang', 'zeitgeist', 'algorithm', 'boycott', 'checkmate',
    'democracy', 'ecosystem', 'firewall', 'genome', 'hologram', 'infinity',
    'karma', 'labyrinth', 'momentum', 'nirvana', 'overture', 'paradox', 'quicksilver',
    'renaissance', 'stereotype', 'turbulence', 'undertow', 'velocity', 'whirlpool',
  ],
};

/* ------------------------------------------------------------------ *
 * Animals — name, emoji, class, a quick fact
 * ------------------------------------------------------------------ */
export interface Animal {
  name: string;
  emoji: string;
  group: string;
  fact: string;
}

export const ANIMALS: Animal[] = [
  { name: 'Red Fox', emoji: '🦊', group: 'Mammal', fact: 'Uses the earth’s magnetic field to help pounce on prey under snow.' },
  { name: 'Octopus', emoji: '🐙', group: 'Cephalopod', fact: 'Has three hearts and blue, copper-based blood.' },
  { name: 'Emperor Penguin', emoji: '🐧', group: 'Bird', fact: 'Males incubate the egg on their feet through the Antarctic winter.' },
  { name: 'Axolotl', emoji: '🦎', group: 'Amphibian', fact: 'Can regrow limbs, spinal cord and even parts of its heart and brain.' },
  { name: 'Sloth', emoji: '🦥', group: 'Mammal', fact: 'Moves so slowly that algae grows on its fur, camouflaging it.' },
  { name: 'Peregrine Falcon', emoji: '🦅', group: 'Bird', fact: 'The fastest animal alive, diving at over 380 km/h.' },
  { name: 'Honey Bee', emoji: '🐝', group: 'Insect', fact: 'Communicates the direction of flowers with a figure-eight "waggle dance".' },
  { name: 'Giant Panda', emoji: '🐼', group: 'Mammal', fact: 'Spends up to 14 hours a day eating bamboo.' },
  { name: 'Chameleon', emoji: '🦎', group: 'Reptile', fact: 'Its eyes move independently, giving a full 360° field of view.' },
  { name: 'Narwhal', emoji: '🐋', group: 'Mammal', fact: 'Its "tusk" is actually a spiral tooth packed with nerve endings.' },
  { name: 'Tardigrade', emoji: '🧸', group: 'Micro-animal', fact: 'Can survive the vacuum of space, boiling and freezing.' },
  { name: 'Mantis Shrimp', emoji: '🦐', group: 'Crustacean', fact: 'Punches with the acceleration of a .22 calibre bullet.' },
  { name: 'Arctic Fox', emoji: '🦊', group: 'Mammal', fact: 'Its coat changes from brown in summer to white in winter.' },
  { name: 'Cuttlefish', emoji: '🦑', group: 'Cephalopod', fact: 'Can hypnotise prey with rippling waves of colour across its skin.' },
  { name: 'Platypus', emoji: '🦫', group: 'Mammal', fact: 'A venomous, egg-laying mammal that senses prey by electric field.' },
  { name: 'Snow Leopard', emoji: '🐆', group: 'Mammal', fact: 'Can leap up to six times the length of its own body.' },
  { name: 'Hummingbird', emoji: '🐦', group: 'Bird', fact: 'The only bird that can fly backwards.' },
  { name: 'Komodo Dragon', emoji: '🦎', group: 'Reptile', fact: 'The largest living lizard, with a venomous bite.' },
  { name: 'Blue Whale', emoji: '🐋', group: 'Mammal', fact: 'The largest animal to have ever lived — its heart is the size of a car.' },
  { name: 'Pangolin', emoji: '🦔', group: 'Mammal', fact: 'The only mammal fully covered in scales; rolls into a ball for defence.' },
  { name: 'Poison Dart Frog', emoji: '🐸', group: 'Amphibian', fact: 'A single frog holds enough toxin to threaten ten adult humans.' },
  { name: 'Meerkat', emoji: '🦫', group: 'Mammal', fact: 'Takes turns as a sentry, standing guard while the group forages.' },
  { name: 'Seahorse', emoji: '🐠', group: 'Fish', fact: 'The male, not the female, carries and gives birth to the young.' },
  { name: 'Wolverine', emoji: '🦡', group: 'Mammal', fact: 'Small but ferocious — can take down prey many times its size.' },
  { name: 'Flamingo', emoji: '🦩', group: 'Bird', fact: 'Turns pink from the carotenoids in the shrimp and algae it eats.' },
  { name: 'Jaguar', emoji: '🐆', group: 'Mammal', fact: 'Has the strongest bite of any big cat, cracking turtle shells.' },
  { name: 'Bald Eagle', emoji: '🦅', group: 'Bird', fact: 'Can see prey from nearly 5 km away.' },
  { name: 'Koala', emoji: '🐨', group: 'Mammal', fact: 'Has fingerprints nearly indistinguishable from a human’s.' },
  { name: 'Electric Eel', emoji: '🐍', group: 'Fish', fact: 'Delivers shocks of up to 600 volts to stun prey.' },
  { name: 'Owl', emoji: '🦉', group: 'Bird', fact: 'Can rotate its head about 270° without moving its body.' },
  { name: 'Dolphin', emoji: '🐬', group: 'Mammal', fact: 'Sleeps with one half of its brain awake to keep breathing.' },
  { name: 'Chimpanzee', emoji: '🐵', group: 'Mammal', fact: 'Shares about 98.8% of its DNA with humans.' },
  { name: 'Star-nosed Mole', emoji: '🐀', group: 'Mammal', fact: 'Identifies and eats food faster than the human eye can follow.' },
  { name: 'Gecko', emoji: '🦎', group: 'Reptile', fact: 'Climbs glass using millions of tiny hairs and van der Waals forces.' },
  { name: 'Reindeer', emoji: '🦌', group: 'Mammal', fact: 'Can see ultraviolet light, invisible to humans.' },
  { name: 'Firefly', emoji: '🪲', group: 'Insect', fact: 'Produces near-100%-efficient "cold light" through bioluminescence.' },
  { name: 'Manatee', emoji: '🦭', group: 'Mammal', fact: 'A gentle grazer whose closest living relative is the elephant.' },
  { name: 'Raven', emoji: '🐦‍⬛', group: 'Bird', fact: 'Can solve multi-step puzzles and remembers human faces.' },
  { name: 'Tiger', emoji: '🐅', group: 'Mammal', fact: 'Its skin, not just its fur, is striped.' },
  { name: 'Puffin', emoji: '🐧', group: 'Bird', fact: 'Can hold a dozen small fish crosswise in its beak at once.' },
];

/* ------------------------------------------------------------------ *
 * Tarot — 78-card deck with brief upright / reversed meanings
 * ------------------------------------------------------------------ */
export interface TarotCard {
  name: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  upright: string;
  reversed: string;
}

const MAJOR: [string, string, string][] = [
  ['The Fool', 'New beginnings, spontaneity, a leap of faith.', 'Recklessness, hesitation, fear of the unknown.'],
  ['The Magician', 'Willpower, skill, manifesting your intent.', 'Manipulation, untapped talent, self-doubt.'],
  ['The High Priestess', 'Intuition, mystery, the subconscious.', 'Secrets withheld, disconnection from instinct.'],
  ['The Empress', 'Abundance, nurturing, creativity.', 'Dependence, creative block, neglect.'],
  ['The Emperor', 'Structure, authority, stability.', 'Domination, rigidity, loss of control.'],
  ['The Hierophant', 'Tradition, guidance, shared belief.', 'Rebellion, dogma, breaking convention.'],
  ['The Lovers', 'Union, choice, alignment of values.', 'Disharmony, imbalance, misaligned choices.'],
  ['The Chariot', 'Determination, control, forward drive.', 'Loss of direction, opposition, no discipline.'],
  ['Strength', 'Courage, patience, gentle power.', 'Self-doubt, raw emotion, low energy.'],
  ['The Hermit', 'Introspection, solitude, inner guidance.', 'Isolation, withdrawal, lost your way.'],
  ['Wheel of Fortune', 'Change, cycles, turning points.', 'Bad luck, resistance to change, delay.'],
  ['Justice', 'Fairness, truth, cause and effect.', 'Unfairness, dishonesty, avoiding accountability.'],
  ['The Hanged Man', 'Surrender, new perspective, pause.', 'Stalling, indecision, needless sacrifice.'],
  ['Death', 'Endings, transformation, transition.', 'Resistance to change, stagnation, holding on.'],
  ['Temperance', 'Balance, moderation, patience.', 'Excess, imbalance, misalignment.'],
  ['The Devil', 'Attachment, temptation, materialism.', 'Release, breaking free, reclaiming power.'],
  ['The Tower', 'Sudden upheaval, revelation, chaos.', 'Averted disaster, fear of change, delay.'],
  ['The Star', 'Hope, renewal, serene faith.', 'Discouragement, lost faith, disconnection.'],
  ['The Moon', 'Illusion, intuition, the unconscious.', 'Confusion cleared, fear released, truth surfacing.'],
  ['The Sun', 'Joy, success, vitality.', 'Temporary gloom, blocked positivity.'],
  ['Judgement', 'Reckoning, awakening, renewal.', 'Self-doubt, ignoring the call, harsh judgement.'],
  ['The World', 'Completion, wholeness, achievement.', 'Incompletion, loose ends, delayed closure.'],
];

const SUITS: { suit: TarotCard['suit']; theme: string; keyword: string }[] = [
  { suit: 'Wands', theme: 'energy, passion and ambition', keyword: 'drive' },
  { suit: 'Cups', theme: 'emotion, relationships and intuition', keyword: 'feeling' },
  { suit: 'Swords', theme: 'thought, conflict and truth', keyword: 'intellect' },
  { suit: 'Pentacles', theme: 'work, money and the material world', keyword: 'stability' },
];

const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

export const TAROT_DECK: TarotCard[] = [
  ...MAJOR.map(([name, upright, reversed]) => ({
    name, arcana: 'Major' as const, upright, reversed,
  })),
  ...SUITS.flatMap(({ suit, theme, keyword }) =>
    RANKS.map((rank) => ({
      name: `${rank} of ${suit}`,
      arcana: 'Minor' as const,
      suit,
      upright: `A ${rank.toLowerCase()} of ${keyword} — ${theme}.`,
      reversed: `Blocked or excessive ${keyword} around ${theme}.`,
    }))
  ),
];

/* ------------------------------------------------------------------ *
 * Pokémon — Gen 1 (Kanto) names + primary/secondary types
 * ------------------------------------------------------------------ */
export interface Pokemon {
  id: number;
  name: string;
  types: string[];
}

export const POKEMON_GEN1: Pokemon[] = [
  { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'] }, { id: 2, name: 'Ivysaur', types: ['Grass', 'Poison'] },
  { id: 3, name: 'Venusaur', types: ['Grass', 'Poison'] }, { id: 4, name: 'Charmander', types: ['Fire'] },
  { id: 5, name: 'Charmeleon', types: ['Fire'] }, { id: 6, name: 'Charizard', types: ['Fire', 'Flying'] },
  { id: 7, name: 'Squirtle', types: ['Water'] }, { id: 8, name: 'Wartortle', types: ['Water'] },
  { id: 9, name: 'Blastoise', types: ['Water'] }, { id: 10, name: 'Caterpie', types: ['Bug'] },
  { id: 11, name: 'Metapod', types: ['Bug'] }, { id: 12, name: 'Butterfree', types: ['Bug', 'Flying'] },
  { id: 13, name: 'Weedle', types: ['Bug', 'Poison'] }, { id: 14, name: 'Kakuna', types: ['Bug', 'Poison'] },
  { id: 15, name: 'Beedrill', types: ['Bug', 'Poison'] }, { id: 16, name: 'Pidgey', types: ['Normal', 'Flying'] },
  { id: 17, name: 'Pidgeotto', types: ['Normal', 'Flying'] }, { id: 18, name: 'Pidgeot', types: ['Normal', 'Flying'] },
  { id: 19, name: 'Rattata', types: ['Normal'] }, { id: 20, name: 'Raticate', types: ['Normal'] },
  { id: 21, name: 'Spearow', types: ['Normal', 'Flying'] }, { id: 22, name: 'Fearow', types: ['Normal', 'Flying'] },
  { id: 23, name: 'Ekans', types: ['Poison'] }, { id: 24, name: 'Arbok', types: ['Poison'] },
  { id: 25, name: 'Pikachu', types: ['Electric'] }, { id: 26, name: 'Raichu', types: ['Electric'] },
  { id: 27, name: 'Sandshrew', types: ['Ground'] }, { id: 28, name: 'Sandslash', types: ['Ground'] },
  { id: 29, name: 'Nidoran♀', types: ['Poison'] }, { id: 30, name: 'Nidorina', types: ['Poison'] },
  { id: 31, name: 'Nidoqueen', types: ['Poison', 'Ground'] }, { id: 32, name: 'Nidoran♂', types: ['Poison'] },
  { id: 33, name: 'Nidorino', types: ['Poison'] }, { id: 34, name: 'Nidoking', types: ['Poison', 'Ground'] },
  { id: 35, name: 'Clefairy', types: ['Fairy'] }, { id: 36, name: 'Clefable', types: ['Fairy'] },
  { id: 37, name: 'Vulpix', types: ['Fire'] }, { id: 38, name: 'Ninetales', types: ['Fire'] },
  { id: 39, name: 'Jigglypuff', types: ['Normal', 'Fairy'] }, { id: 40, name: 'Wigglytuff', types: ['Normal', 'Fairy'] },
  { id: 41, name: 'Zubat', types: ['Poison', 'Flying'] }, { id: 42, name: 'Golbat', types: ['Poison', 'Flying'] },
  { id: 43, name: 'Oddish', types: ['Grass', 'Poison'] }, { id: 44, name: 'Gloom', types: ['Grass', 'Poison'] },
  { id: 45, name: 'Vileplume', types: ['Grass', 'Poison'] }, { id: 46, name: 'Paras', types: ['Bug', 'Grass'] },
  { id: 47, name: 'Parasect', types: ['Bug', 'Grass'] }, { id: 48, name: 'Venonat', types: ['Bug', 'Poison'] },
  { id: 49, name: 'Venomoth', types: ['Bug', 'Poison'] }, { id: 50, name: 'Diglett', types: ['Ground'] },
  { id: 51, name: 'Dugtrio', types: ['Ground'] }, { id: 52, name: 'Meowth', types: ['Normal'] },
  { id: 53, name: 'Persian', types: ['Normal'] }, { id: 54, name: 'Psyduck', types: ['Water'] },
  { id: 55, name: 'Golduck', types: ['Water'] }, { id: 56, name: 'Mankey', types: ['Fighting'] },
  { id: 57, name: 'Primeape', types: ['Fighting'] }, { id: 58, name: 'Growlithe', types: ['Fire'] },
  { id: 59, name: 'Arcanine', types: ['Fire'] }, { id: 60, name: 'Poliwag', types: ['Water'] },
  { id: 61, name: 'Poliwhirl', types: ['Water'] }, { id: 62, name: 'Poliwrath', types: ['Water', 'Fighting'] },
  { id: 63, name: 'Abra', types: ['Psychic'] }, { id: 64, name: 'Kadabra', types: ['Psychic'] },
  { id: 65, name: 'Alakazam', types: ['Psychic'] }, { id: 66, name: 'Machop', types: ['Fighting'] },
  { id: 67, name: 'Machoke', types: ['Fighting'] }, { id: 68, name: 'Machamp', types: ['Fighting'] },
  { id: 69, name: 'Bellsprout', types: ['Grass', 'Poison'] }, { id: 70, name: 'Weepinbell', types: ['Grass', 'Poison'] },
  { id: 71, name: 'Victreebel', types: ['Grass', 'Poison'] }, { id: 72, name: 'Tentacool', types: ['Water', 'Poison'] },
  { id: 73, name: 'Tentacruel', types: ['Water', 'Poison'] }, { id: 74, name: 'Geodude', types: ['Rock', 'Ground'] },
  { id: 75, name: 'Graveler', types: ['Rock', 'Ground'] }, { id: 76, name: 'Golem', types: ['Rock', 'Ground'] },
  { id: 77, name: 'Ponyta', types: ['Fire'] }, { id: 78, name: 'Rapidash', types: ['Fire'] },
  { id: 79, name: 'Slowpoke', types: ['Water', 'Psychic'] }, { id: 80, name: 'Slowbro', types: ['Water', 'Psychic'] },
  { id: 81, name: 'Magnemite', types: ['Electric', 'Steel'] }, { id: 82, name: 'Magneton', types: ['Electric', 'Steel'] },
  { id: 83, name: "Farfetch'd", types: ['Normal', 'Flying'] }, { id: 84, name: 'Doduo', types: ['Normal', 'Flying'] },
  { id: 85, name: 'Dodrio', types: ['Normal', 'Flying'] }, { id: 86, name: 'Seel', types: ['Water'] },
  { id: 87, name: 'Dewgong', types: ['Water', 'Ice'] }, { id: 88, name: 'Grimer', types: ['Poison'] },
  { id: 89, name: 'Muk', types: ['Poison'] }, { id: 90, name: 'Shellder', types: ['Water'] },
  { id: 91, name: 'Cloyster', types: ['Water', 'Ice'] }, { id: 92, name: 'Gastly', types: ['Ghost', 'Poison'] },
  { id: 93, name: 'Haunter', types: ['Ghost', 'Poison'] }, { id: 94, name: 'Gengar', types: ['Ghost', 'Poison'] },
  { id: 95, name: 'Onix', types: ['Rock', 'Ground'] }, { id: 96, name: 'Drowzee', types: ['Psychic'] },
  { id: 97, name: 'Hypno', types: ['Psychic'] }, { id: 98, name: 'Krabby', types: ['Water'] },
  { id: 99, name: 'Kingler', types: ['Water'] }, { id: 100, name: 'Voltorb', types: ['Electric'] },
  { id: 101, name: 'Electrode', types: ['Electric'] }, { id: 102, name: 'Exeggcute', types: ['Grass', 'Psychic'] },
  { id: 103, name: 'Exeggutor', types: ['Grass', 'Psychic'] }, { id: 104, name: 'Cubone', types: ['Ground'] },
  { id: 105, name: 'Marowak', types: ['Ground'] }, { id: 106, name: 'Hitmonlee', types: ['Fighting'] },
  { id: 107, name: 'Hitmonchan', types: ['Fighting'] }, { id: 108, name: 'Lickitung', types: ['Normal'] },
  { id: 109, name: 'Koffing', types: ['Poison'] }, { id: 110, name: 'Weezing', types: ['Poison'] },
  { id: 111, name: 'Rhyhorn', types: ['Ground', 'Rock'] }, { id: 112, name: 'Rhydon', types: ['Ground', 'Rock'] },
  { id: 113, name: 'Chansey', types: ['Normal'] }, { id: 114, name: 'Tangela', types: ['Grass'] },
  { id: 115, name: 'Kangaskhan', types: ['Normal'] }, { id: 116, name: 'Horsea', types: ['Water'] },
  { id: 117, name: 'Seadra', types: ['Water'] }, { id: 118, name: 'Goldeen', types: ['Water'] },
  { id: 119, name: 'Seaking', types: ['Water'] }, { id: 120, name: 'Staryu', types: ['Water'] },
  { id: 121, name: 'Starmie', types: ['Water', 'Psychic'] }, { id: 122, name: 'Mr. Mime', types: ['Psychic', 'Fairy'] },
  { id: 123, name: 'Scyther', types: ['Bug', 'Flying'] }, { id: 124, name: 'Jynx', types: ['Ice', 'Psychic'] },
  { id: 125, name: 'Electabuzz', types: ['Electric'] }, { id: 126, name: 'Magmar', types: ['Fire'] },
  { id: 127, name: 'Pinsir', types: ['Bug'] }, { id: 128, name: 'Tauros', types: ['Normal'] },
  { id: 129, name: 'Magikarp', types: ['Water'] }, { id: 130, name: 'Gyarados', types: ['Water', 'Flying'] },
  { id: 131, name: 'Lapras', types: ['Water', 'Ice'] }, { id: 132, name: 'Ditto', types: ['Normal'] },
  { id: 133, name: 'Eevee', types: ['Normal'] }, { id: 134, name: 'Vaporeon', types: ['Water'] },
  { id: 135, name: 'Jolteon', types: ['Electric'] }, { id: 136, name: 'Flareon', types: ['Fire'] },
  { id: 137, name: 'Porygon', types: ['Normal'] }, { id: 138, name: 'Omanyte', types: ['Rock', 'Water'] },
  { id: 139, name: 'Omastar', types: ['Rock', 'Water'] }, { id: 140, name: 'Kabuto', types: ['Rock', 'Water'] },
  { id: 141, name: 'Kabutops', types: ['Rock', 'Water'] }, { id: 142, name: 'Aerodactyl', types: ['Rock', 'Flying'] },
  { id: 143, name: 'Snorlax', types: ['Normal'] }, { id: 144, name: 'Articuno', types: ['Ice', 'Flying'] },
  { id: 145, name: 'Zapdos', types: ['Electric', 'Flying'] }, { id: 146, name: 'Moltres', types: ['Fire', 'Flying'] },
  { id: 147, name: 'Dratini', types: ['Dragon'] }, { id: 148, name: 'Dragonair', types: ['Dragon'] },
  { id: 149, name: 'Dragonite', types: ['Dragon', 'Flying'] }, { id: 150, name: 'Mewtwo', types: ['Psychic'] },
  { id: 151, name: 'Mew', types: ['Psychic'] },
];

// Hex colours for each Pokémon type, used to tint the result card.
export const POKEMON_TYPE_COLORS: Record<string, string> = {
  Normal: '#9099a1', Fire: '#ff9d55', Water: '#4d90d5', Electric: '#f4d23c',
  Grass: '#63bc5a', Ice: '#73cec0', Fighting: '#ce4069', Poison: '#ab6ac8',
  Ground: '#d97845', Flying: '#8fa9de', Psychic: '#fa7179', Bug: '#90c12c',
  Rock: '#c5b78c', Ghost: '#5269ad', Dragon: '#0b6dc3',
  Steel: '#5a8ea1', Fairy: '#ec8fe6',
};

// Coined, non-trademarked "Pokémon-style" name parts for the fantasy generator.
export const FAKEMON_PREFIX = [
  'Char', 'Bulb', 'Squir', 'Pika', 'Eev', 'Vulp', 'Growl', 'Gast', 'Machop', 'Drat',
  'Mag', 'Zap', 'Flare', 'Aqua', 'Terra', 'Pyro', 'Cryo', 'Volt', 'Umbra', 'Lumi',
  'Fern', 'Bramb', 'Ember', 'Frost', 'Gale', 'Root', 'Spark', 'Tide', 'Cinder', 'Petal',
];
export const FAKEMON_SUFFIX = [
  'mander', 'asaur', 'chu', 'eon', 'puff', 'ling', 'dactyl', 'tortle', 'zard', 'mite',
  'quill', 'fin', 'wing', 'claw', 'tail', 'horn', 'fang', 'paw', 'shell', 'bloom',
  'ny', 'go', 'zor', 'rex', 'dile', 'monk', 'roo', 'oth', 'ika', 'una',
];

/* ------------------------------------------------------------------ *
 * Pet names
 * ------------------------------------------------------------------ */
export interface PetNameBank {
  unisex: string[];
  cutesy: string[];
  tough: string[];
  foodie: string[];
  mythic: string[];
}

export const PET_NAMES: PetNameBank = {
  unisex: [
    'Charlie', 'Bailey', 'Riley', 'Sam', 'Alex', 'Casey', 'Finley', 'Quinn', 'Rowan',
    'Sky', 'River', 'Sage', 'Scout', 'Ash', 'Jordan', 'Frankie', 'Toby', 'Milo', 'Ollie',
    'Remy', 'Winnie', 'Bear', 'Pepper', 'Shadow', 'Cricket', 'Juno', 'Marley', 'Sunny',
  ],
  cutesy: [
    'Biscuit', 'Peanut', 'Buttons', 'Snickers', 'Cupcake', 'Waffles', 'Marshmallow',
    'Pickles', 'Pumpkin', 'Bubbles', 'Noodle', 'Muffin', 'Jellybean', 'Cuddles',
    'Sprinkles', 'Boo', 'Nibbles', 'Puddles', 'Coco', 'Honey', 'Peaches', 'Dumpling',
  ],
  tough: [
    'Diesel', 'Bruno', 'Rex', 'Titan', 'Ace', 'Blade', 'Rocky', 'Zeus', 'Bandit',
    'Ranger', 'Tank', 'Duke', 'Bruiser', 'Maverick', 'Boss', 'Rebel', 'Storm', 'Jax',
    'Hunter', 'Fang', 'Brutus', 'Rogue', 'Chief', 'Colt',
  ],
  foodie: [
    'Mochi', 'Miso', 'Basil', 'Olive', 'Ginger', 'Nacho', 'Waffle', 'Pretzel', 'Taco',
    'Sushi', 'Kiwi', 'Mango', 'Espresso', 'Cocoa', 'Biscotti', 'Ramen', 'Churro',
    'Cinnamon', 'Pepper', 'Saffron', 'Truffle', 'Wasabi',
  ],
  mythic: [
    'Loki', 'Athena', 'Odin', 'Freya', 'Apollo', 'Luna', 'Thor', 'Nyx', 'Atlas',
    'Hera', 'Orion', 'Selene', 'Zephyr', 'Draco', 'Phoenix', 'Nova', 'Onyx', 'Aurora',
    'Cyrus', 'Isis', 'Ra', 'Juno', 'Titan', 'Echo',
  ],
};

export const PET_TRAITS = [
  'playful', 'sleepy', 'grumpy', 'fluffy', 'tiny', 'majestic', 'chaotic', 'gentle',
  'speedy', 'clumsy', 'regal', 'mischievous', 'cuddly', 'brave', 'goofy', 'curious',
];

/* ------------------------------------------------------------------ *
 * Gamertag parts
 * ------------------------------------------------------------------ */
export const GAMERTAG_ADJ = [
  'Shadow', 'Toxic', 'Silent', 'Rapid', 'Frost', 'Blaze', 'Cyber', 'Neon', 'Iron',
  'Ghost', 'Dark', 'Savage', 'Rogue', 'Mystic', 'Crimson', 'Venom', 'Hyper', 'Turbo',
  'Chaos', 'Grim', 'Lunar', 'Solar', 'Wicked', 'Feral', 'Arctic', 'Phantom', 'Nova',
  'Vortex', 'Rift', 'Zero', 'Elite', 'Mega', 'Ultra', 'Primal', 'Void', 'Storm',
];
export const GAMERTAG_NOUN = [
  'Sniper', 'Reaper', 'Wolf', 'Dragon', 'Ninja', 'Viper', 'Falcon', 'Hunter', 'Ghost',
  'Blade', 'Knight', 'Raven', 'Titan', 'Wizard', 'Phoenix', 'Demon', 'Beast', 'Slayer',
  'Ranger', 'Assassin', 'Warlord', 'Specter', 'Golem', 'Kraken', 'Cobra', 'Panther',
  'Fury', 'Striker', 'Bandit', 'Rider', 'Menace', 'Gambit', 'Fox', 'Hawk', 'Bear',
];
export const GAMERTAG_SUFFIX = [
  'X', 'YT', 'TTV', 'HD', 'Pro', 'GG', 'FX', 'Zz', 'xX', '99', '007', '360', 'OP',
];
