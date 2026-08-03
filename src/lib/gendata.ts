

export type PictionaryTier = 'easy' | 'medium' | 'hard';

export interface PictionaryWord {
  word: string;
  tier: PictionaryTier;
  category: string;
}

const P = (category: string, tier: PictionaryTier, words: string[]): PictionaryWord[] =>
  words.map((word) => ({ word, tier, category }));

export const PICTIONARY_WORDS: PictionaryWord[] = [
  ...P('Animals', 'easy', ['cat', 'dog', 'fish', 'bird', 'cow', 'pig', 'duck', 'bee', 'ant', 'frog', 'snake', 'spider', 'horse', 'sheep', 'mouse']),
  ...P('Animals', 'medium', ['elephant', 'kangaroo', 'octopus', 'penguin', 'jellyfish', 'flamingo', 'hedgehog', 'squirrel', 'dolphin', 'butterfly', 'crocodile', 'peacock']),
  ...P('Animals', 'hard', ['platypus', 'chameleon', 'narwhal', 'armadillo', 'wolverine', 'seahorse', 'pangolin', 'axolotl']),

  ...P('Food & Drink', 'easy', ['apple', 'egg', 'cake', 'pizza', 'banana', 'carrot', 'bread', 'milk', 'cheese', 'cookie', 'ice cream', 'burger']),
  ...P('Food & Drink', 'medium', ['spaghetti', 'pineapple', 'popcorn', 'sandwich', 'pancake', 'watermelon', 'cupcake', 'hot dog', 'sushi', 'taco', 'waffle']),
  ...P('Food & Drink', 'hard', ['croissant', 'guacamole', 'lasagna', 'espresso', 'smoothie', 'barbecue']),

  ...P('Household', 'easy', ['chair', 'table', 'bed', 'lamp', 'cup', 'key', 'door', 'clock', 'spoon', 'fork', 'broom', 'pillow', 'mirror', 'candle']),
  ...P('Household', 'medium', ['umbrella', 'toothbrush', 'refrigerator', 'vacuum', 'stapler', 'blender', 'hairdryer', 'ladder', 'mousetrap', 'doorbell']),
  ...P('Household', 'hard', ['chandelier', 'thermostat', 'corkscrew', 'grandfather clock']),

  ...P('Nature', 'easy', ['sun', 'moon', 'star', 'tree', 'cloud', 'rain', 'snow', 'fire', 'flower', 'leaf', 'rock', 'river', 'mountain', 'beach']),
  ...P('Nature', 'medium', ['rainbow', 'volcano', 'waterfall', 'iceberg', 'tornado', 'lightning', 'cactus', 'desert', 'island', 'forest']),
  ...P('Nature', 'hard', ['photosynthesis', 'ecosystem', 'avalanche', 'geyser', 'aurora']),

  ...P('Sports & Games', 'easy', ['ball', 'kite', 'swing', 'slide', 'jump rope', 'dice', 'chess', 'darts', 'bowling']),
  ...P('Sports & Games', 'medium', ['skateboard', 'basketball', 'tennis', 'surfing', 'baseball', 'boxing', 'archery', 'trampoline', 'hula hoop', 'skiing']),
  ...P('Sports & Games', 'hard', ['gymnastics', 'badminton', 'water polo', 'checkmate', 'tug of war']),

  ...P('Places', 'easy', ['house', 'school', 'park', 'shop', 'farm', 'zoo', 'church', 'bridge', 'castle', 'tent']),
  ...P('Places', 'medium', ['airport', 'lighthouse', 'igloo', 'greenhouse', 'windmill', 'skyscraper', 'stadium', 'hospital', 'library', 'aquarium']),
  ...P('Places', 'hard', ['observatory', 'amphitheater', 'labyrinth', 'penthouse']),

  ...P('Actions', 'easy', ['run', 'jump', 'swim', 'sleep', 'eat', 'sing', 'dance', 'cry', 'laugh', 'read', 'sit', 'throw', 'clap', 'wave']),
  ...P('Actions', 'medium', ['juggle', 'tiptoe', 'sneeze', 'whisper', 'stretch', 'skateboard', 'snore', 'shiver', 'yawn', 'balance']),
  ...P('Actions', 'hard', ['procrastinate', 'hibernate', 'levitate', 'meditate', 'improvise']),

  ...P('Jobs', 'easy', ['doctor', 'chef', 'teacher', 'farmer', 'pilot', 'clown', 'nurse', 'baker', 'artist', 'singer']),
  ...P('Jobs', 'medium', ['dentist', 'astronaut', 'firefighter', 'magician', 'lifeguard', 'plumber', 'detective', 'referee', 'librarian', 'scientist']),
  ...P('Jobs', 'hard', ['archaeologist', 'entrepreneur', 'meteorologist', 'ventriloquist']),

  ...P('Vehicles', 'easy', ['car', 'boat', 'bus', 'train', 'plane', 'bike', 'truck', 'ship', 'rocket', 'scooter']),
  ...P('Vehicles', 'medium', ['helicopter', 'submarine', 'bicycle', 'tractor', 'ambulance', 'sailboat', 'motorcycle', 'canoe', 'hot air balloon']),
  ...P('Vehicles', 'hard', ['hovercraft', 'zeppelin', 'monorail', 'gondola']),

  ...P('Body', 'easy', ['eye', 'nose', 'hand', 'foot', 'ear', 'mouth', 'hair', 'tooth', 'heart', 'smile', 'thumb', 'knee']),
  ...P('Body', 'medium', ['eyebrow', 'freckle', 'fingernail', 'shoulder', 'elbow', 'ankle', 'muscle', 'skeleton']),
  ...P('Body', 'hard', ['metabolism', 'bloodstream', 'nervous system']),

  ...P('Clothing', 'easy', ['hat', 'shoe', 'sock', 'shirt', 'dress', 'glove', 'scarf', 'belt', 'boot', 'ring']),
  ...P('Clothing', 'medium', ['zipper', 'necklace', 'sunglasses', 'raincoat', 'backpack', 'mitten', 'bowtie', 'sandals', 'costume']),
  ...P('Clothing', 'hard', ['tuxedo', 'kimono', 'wristwatch', 'suspenders']),

  ...P('Abstract', 'medium', ['birthday', 'treasure', 'jackpot', 'nightmare', 'daydream', 'echo', 'shadow', 'gravity', 'silence', 'teamwork']),
  ...P('Abstract', 'hard', ['nostalgia', 'serendipity', 'wanderlust', 'déjà vu', 'optimism', 'infinity', 'paradox', 'momentum', 'telepathy', 'zeitgeist', 'claustrophobia', 'vertigo']),
];

export const PICTIONARY_CATEGORIES: string[] = [
  ...new Set(PICTIONARY_WORDS.map((w) => w.category)),
];

export interface Animal {
  name: string;
  emoji: string;
  group: string;
  fact: string;
}

export const ANIMALS: Animal[] = [
  // Mammals
  { name: 'Red Fox', emoji: '🦊', group: 'Mammal', fact: 'Uses the earth’s magnetic field to help pounce on prey under snow.' },
  { name: 'Sloth', emoji: '🦥', group: 'Mammal', fact: 'Moves so slowly that algae grows on its fur, camouflaging it.' },
  { name: 'Giant Panda', emoji: '🐼', group: 'Mammal', fact: 'Spends up to 14 hours a day eating bamboo.' },
  { name: 'Narwhal', emoji: '🐋', group: 'Mammal', fact: 'Its "tusk" is actually a spiral tooth packed with nerve endings.' },
  { name: 'Arctic Fox', emoji: '🦊', group: 'Mammal', fact: 'Its coat changes from brown in summer to white in winter.' },
  { name: 'Platypus', emoji: '🦫', group: 'Mammal', fact: 'A venomous, egg-laying mammal that senses prey by electric field.' },
  { name: 'Snow Leopard', emoji: '🐆', group: 'Mammal', fact: 'Can leap up to six times the length of its own body.' },
  { name: 'Blue Whale', emoji: '🐋', group: 'Mammal', fact: 'The largest animal to have ever lived — its heart is the size of a car.' },
  { name: 'Pangolin', emoji: '🦔', group: 'Mammal', fact: 'The only mammal fully covered in scales; rolls into a ball for defence.' },
  { name: 'Meerkat', emoji: '🦫', group: 'Mammal', fact: 'Takes turns as a sentry, standing guard while the group forages.' },
  { name: 'Wolverine', emoji: '🦡', group: 'Mammal', fact: 'Small but ferocious — can take down prey many times its size.' },
  { name: 'Jaguar', emoji: '🐆', group: 'Mammal', fact: 'Has the strongest bite of any big cat, cracking turtle shells.' },
  { name: 'Koala', emoji: '🐨', group: 'Mammal', fact: 'Has fingerprints nearly indistinguishable from a human’s.' },
  { name: 'Dolphin', emoji: '🐬', group: 'Mammal', fact: 'Sleeps with one half of its brain awake to keep breathing.' },
  { name: 'Chimpanzee', emoji: '🐵', group: 'Mammal', fact: 'Shares about 98.8% of its DNA with humans.' },
  { name: 'Star-nosed Mole', emoji: '🐀', group: 'Mammal', fact: 'Identifies and eats food faster than the human eye can follow.' },
  { name: 'Reindeer', emoji: '🦌', group: 'Mammal', fact: 'Can see ultraviolet light, invisible to humans.' },
  { name: 'Manatee', emoji: '🦭', group: 'Mammal', fact: 'A gentle grazer whose closest living relative is the elephant.' },
  { name: 'Tiger', emoji: '🐅', group: 'Mammal', fact: 'Its skin, not just its fur, is striped.' },
  { name: 'African Elephant', emoji: '🐘', group: 'Mammal', fact: 'The largest land animal, communicating over kilometres with infrasound.' },
  { name: 'Giraffe', emoji: '🦒', group: 'Mammal', fact: 'Has the same number of neck vertebrae as a human — just seven.' },
  { name: 'Hippopotamus', emoji: '🦛', group: 'Mammal', fact: 'Secretes a red "blood sweat" that works as sunscreen and antibiotic.' },
  { name: 'Kangaroo', emoji: '🦘', group: 'Mammal', fact: 'Cannot move its hind legs independently while on the ground.' },
  { name: 'Gray Wolf', emoji: '🐺', group: 'Mammal', fact: 'Can hear other wolves howling up to 16 km away.' },
  { name: 'Grizzly Bear', emoji: '🐻', group: 'Mammal', fact: 'Can smell food from over 30 km away.' },
  { name: 'Polar Bear', emoji: '🐻‍❄️', group: 'Mammal', fact: 'Has black skin under transparent fur that only looks white.' },
  { name: 'Bottlenose Dolphin', emoji: '🐬', group: 'Mammal', fact: 'Each individual has a signature whistle that works like a name.' },
  { name: 'Orca', emoji: '🐋', group: 'Mammal', fact: 'Different pods speak distinct dialects passed down through generations.' },
  { name: 'Lion', emoji: '🦁', group: 'Mammal', fact: 'A male’s roar can be heard up to 8 km away.' },
  { name: 'Cheetah', emoji: '🐆', group: 'Mammal', fact: 'Accelerates faster than most sports cars, hitting 100 km/h in three seconds.' },
  { name: 'Bat', emoji: '🦇', group: 'Mammal', fact: 'The only mammal capable of true, sustained flight.' },
  { name: 'Hedgehog', emoji: '🦔', group: 'Mammal', fact: 'Anoints its spines with frothy saliva when it smells something new.' },
  { name: 'Raccoon', emoji: '🦝', group: 'Mammal', fact: 'Has hyper-sensitive front paws that "see" objects by touch.' },
  { name: 'Otter', emoji: '🦦', group: 'Mammal', fact: 'Holds hands while sleeping so the group doesn’t drift apart.' },
  { name: 'Beaver', emoji: '🦫', group: 'Mammal', fact: 'Its teeth never stop growing and are orange from iron in the enamel.' },
  { name: 'Red Panda', emoji: '🐾', group: 'Mammal', fact: 'Uses a false thumb — an enlarged wrist bone — to grip bamboo.' },
  { name: 'Aardvark', emoji: '🐖', group: 'Mammal', fact: 'Can eat up to 50,000 ants and termites in a single night.' },
  { name: 'Bison', emoji: '🦬', group: 'Mammal', fact: 'Despite weighing a tonne, it can sprint at 55 km/h.' },
  { name: 'Camel', emoji: '🐫', group: 'Mammal', fact: 'Its hump stores fat, not water, fuelling weeks without food.' },
  { name: 'Zebra', emoji: '🦓', group: 'Mammal', fact: 'Each zebra’s stripe pattern is as unique as a fingerprint.' },
  { name: 'Gorilla', emoji: '🦍', group: 'Mammal', fact: 'Each individual has a unique nose print used to tell them apart.' },
  { name: 'Orangutan', emoji: '🦧', group: 'Mammal', fact: 'Builds a fresh sleeping nest in the trees almost every night.' },
  { name: 'Sea Otter', emoji: '🦦', group: 'Mammal', fact: 'Keeps a favourite rock in a skin pocket to crack open shellfish.' },
  { name: 'Fennec Fox', emoji: '🦊', group: 'Mammal', fact: 'Its huge ears radiate body heat to keep it cool in the desert.' },
  { name: 'Tasmanian Devil', emoji: '🦡', group: 'Mammal', fact: 'Has one of the strongest bites for its size of any land mammal.' },
  { name: 'Armadillo', emoji: '🦔', group: 'Mammal', fact: 'The three-banded species can roll into a fully sealed ball.' },
  { name: 'Walrus', emoji: '🦭', group: 'Mammal', fact: 'Uses its sensitive whiskers to find clams on the dark seafloor.' },
  { name: 'Moose', emoji: '🦌', group: 'Mammal', fact: 'Can dive over 5 m deep to feed on plants at the bottom of lakes.' },
  { name: 'Capybara', emoji: '🐹', group: 'Mammal', fact: 'The world’s largest rodent, completely at ease around other species.' },
  { name: 'Bengal Tiger', emoji: '🐅', group: 'Mammal', fact: 'Its night vision is roughly six times sharper than a human’s.' },

  // Birds
  { name: 'Emperor Penguin', emoji: '🐧', group: 'Bird', fact: 'Males incubate the egg on their feet through the Antarctic winter.' },
  { name: 'Peregrine Falcon', emoji: '🦅', group: 'Bird', fact: 'The fastest animal alive, diving at over 380 km/h.' },
  { name: 'Hummingbird', emoji: '🐦', group: 'Bird', fact: 'The only bird that can fly backwards.' },
  { name: 'Flamingo', emoji: '🦩', group: 'Bird', fact: 'Turns pink from the carotenoids in the shrimp and algae it eats.' },
  { name: 'Bald Eagle', emoji: '🦅', group: 'Bird', fact: 'Can see prey from nearly 5 km away.' },
  { name: 'Owl', emoji: '🦉', group: 'Bird', fact: 'Can rotate its head about 270° without moving its body.' },
  { name: 'Raven', emoji: '🐦‍⬛', group: 'Bird', fact: 'Can solve multi-step puzzles and remembers human faces.' },
  { name: 'Atlantic Puffin', emoji: '🐧', group: 'Bird', fact: 'Can hold a dozen small fish crosswise in its beak at once.' },
  { name: 'Ostrich', emoji: '🦃', group: 'Bird', fact: 'The largest bird, with an eye bigger than its own brain.' },
  { name: 'Emu', emoji: '🦃', group: 'Bird', fact: 'Can run at 50 km/h and swim when it needs to.' },
  { name: 'Kiwi', emoji: '🥝', group: 'Bird', fact: 'Lays an egg up to a fifth of the mother’s body weight.' },
  { name: 'Toucan', emoji: '🦜', group: 'Bird', fact: 'Its huge beak sheds heat like a radiator to cool the bird down.' },
  { name: 'Kingfisher', emoji: '🐦', group: 'Bird', fact: 'Its beak shape inspired the nose of Japan’s bullet train.' },
  { name: 'Arctic Tern', emoji: '🕊️', group: 'Bird', fact: 'Migrates pole to pole, seeing two summers and the most daylight of any animal.' },
  { name: 'Peacock', emoji: '🦚', group: 'Bird', fact: 'Its shimmering colours come from light-bending crystals, not pigment.' },
  { name: 'Albatross', emoji: '🕊️', group: 'Bird', fact: 'Can glide for hours over the ocean without a single wingbeat.' },
  { name: 'Woodpecker', emoji: '🐦', group: 'Bird', fact: 'A shock-absorbing skull lets it hammer wood without a concussion.' },
  { name: 'Cassowary', emoji: '🦃', group: 'Bird', fact: 'Sports a dagger-like claw and is often called the world’s most dangerous bird.' },
  { name: 'Pelican', emoji: '🦩', group: 'Bird', fact: 'Its throat pouch can hold more fish than its stomach can.' },
  { name: 'Swan', emoji: '🦢', group: 'Bird', fact: 'Has more neck vertebrae than almost any other animal.' },
  { name: 'Mallard', emoji: '🦆', group: 'Bird', fact: 'A duckling can walk, swim and feed itself hours after hatching.' },
  { name: 'Barn Owl', emoji: '🦉', group: 'Bird', fact: 'Hears so precisely it can catch prey in total darkness.' },
  { name: 'Golden Eagle', emoji: '🦅', group: 'Bird', fact: 'Can spot a rabbit from over 3 km away while soaring.' },
  { name: 'Blue Jay', emoji: '🐦', group: 'Bird', fact: 'Mimics hawk calls to scare other birds away from food.' },
  { name: 'Cardinal', emoji: '🐦', group: 'Bird', fact: 'The male’s red feathers come from pigments in the seeds it eats.' },
  { name: 'Macaw', emoji: '🦜', group: 'Bird', fact: 'Can live over 60 years and mimic dozens of words.' },
  { name: 'Cockatoo', emoji: '🦜', group: 'Bird', fact: 'Some wild individuals dance and keep a beat to music.' },
  { name: 'Rooster', emoji: '🐓', group: 'Bird', fact: 'Anticipates dawn using an internal clock, not just the light.' },
  { name: 'Turkey', emoji: '🦃', group: 'Bird', fact: 'Its bare head changes colour with its mood.' },
  { name: 'Robin', emoji: '🐦', group: 'Bird', fact: 'Can sense the earth’s magnetic field to navigate on migration.' },
  { name: 'Sparrow', emoji: '🐦', group: 'Bird', fact: 'One of the most widespread wild birds on the planet.' },
  { name: 'Crow', emoji: '🐦‍⬛', group: 'Bird', fact: 'Makes and uses tools, and holds grudges against specific humans.' },
  { name: 'Magpie', emoji: '🐦‍⬛', group: 'Bird', fact: 'One of the few animals that can recognise itself in a mirror.' },
  { name: 'Heron', emoji: '🐦', group: 'Bird', fact: 'Uses bait — dropping insects on water — to lure fish within reach.' },
  { name: 'Stork', emoji: '🕊️', group: 'Bird', fact: 'Migrates thousands of kilometres, often reusing the same nest for decades.' },
  { name: 'Vulture', emoji: '🦅', group: 'Bird', fact: 'Stomach acid strong enough to digest anthrax and rotting flesh.' },
  { name: 'Condor', emoji: '🦅', group: 'Bird', fact: 'Has one of the largest wingspans of any land bird, over 3 m.' },
  { name: 'Pigeon', emoji: '🐦', group: 'Bird', fact: 'Can find its way home over hundreds of kilometres of unfamiliar terrain.' },
  { name: 'Seagull', emoji: '🐦', group: 'Bird', fact: 'Learns to drum its feet on the ground to imitate rain and lure worms.' },
  { name: 'Hoatzin', emoji: '🐦', group: 'Bird', fact: 'Its chicks are born with claws on their wings for climbing.' },
  { name: 'Lyrebird', emoji: '🐦', group: 'Bird', fact: 'Mimics chainsaws, camera shutters and other birds with eerie accuracy.' },
  { name: 'Shoebill', emoji: '🐦', group: 'Bird', fact: 'Stands motionless for hours, then strikes fish with a huge shoe-shaped bill.' },
  { name: 'Frigatebird', emoji: '🕊️', group: 'Bird', fact: 'Can stay aloft for weeks, even sleeping mid-flight.' },
  { name: 'Great Horned Owl', emoji: '🦉', group: 'Bird', fact: 'Its grip is strong enough to sever the spine of large prey.' },
  { name: 'Snowy Owl', emoji: '🦉', group: 'Bird', fact: 'Hunts by day across the Arctic, unlike most owls.' },
  { name: 'Bee Hummingbird', emoji: '🐦', group: 'Bird', fact: 'The smallest bird on earth, lighter than a coin.' },
  { name: 'Weaver Bird', emoji: '🐦', group: 'Bird', fact: 'Knots elaborate hanging nests using only its beak and feet.' },
  { name: 'Bowerbird', emoji: '🐦', group: 'Bird', fact: 'Builds and decorates a display arena to attract a mate.' },
  { name: 'Roadrunner', emoji: '🐦', group: 'Bird', fact: 'Prefers running at 30 km/h to flying.' },
  { name: 'Kea', emoji: '🦜', group: 'Bird', fact: 'An alpine parrot famous for solving puzzles and dismantling cars.' },

  // Reptiles
  { name: 'Chameleon', emoji: '🦎', group: 'Reptile', fact: 'Its eyes move independently, giving a full 360° field of view.' },
  { name: 'Komodo Dragon', emoji: '🦎', group: 'Reptile', fact: 'The largest living lizard, with a venomous bite.' },
  { name: 'Gecko', emoji: '🦎', group: 'Reptile', fact: 'Climbs glass using millions of tiny hairs and van der Waals forces.' },
  { name: 'King Cobra', emoji: '🐍', group: 'Reptile', fact: 'The longest venomous snake, and the only one that builds a nest.' },
  { name: 'Green Sea Turtle', emoji: '🐢', group: 'Reptile', fact: 'Returns to the very beach where it hatched to lay its own eggs.' },
  { name: 'Saltwater Crocodile', emoji: '🐊', group: 'Reptile', fact: 'The largest living reptile, with the strongest measured bite on earth.' },
  { name: 'Galápagos Tortoise', emoji: '🐢', group: 'Reptile', fact: 'Can live over 150 years and go a year without food or water.' },
  { name: 'Rattlesnake', emoji: '🐍', group: 'Reptile', fact: 'Adds a new segment to its rattle every time it sheds its skin.' },
  { name: 'Iguana', emoji: '🦎', group: 'Reptile', fact: 'Has a light-sensing "third eye" on top of its head.' },
  { name: 'Frilled Lizard', emoji: '🦎', group: 'Reptile', fact: 'Flares a huge neck frill and runs on two legs to scare off threats.' },
  { name: 'Basilisk Lizard', emoji: '🦎', group: 'Reptile', fact: 'Can sprint across the surface of water to escape predators.' },
  { name: 'Gila Monster', emoji: '🦎', group: 'Reptile', fact: 'One of the few venomous lizards; its venom inspired a diabetes drug.' },
  { name: 'Leatherback Turtle', emoji: '🐢', group: 'Reptile', fact: 'The largest turtle, diving over 1,000 m for jellyfish.' },
  { name: 'Boa Constrictor', emoji: '🐍', group: 'Reptile', fact: 'Squeezes prey just enough to stop its heart, not to crush it.' },
  { name: 'Anaconda', emoji: '🐍', group: 'Reptile', fact: 'The heaviest snake, capable of swallowing prey as large as a deer.' },
  { name: 'Python', emoji: '🐍', group: 'Reptile', fact: 'Senses the body heat of prey with pits along its lips.' },
  { name: 'Alligator', emoji: '🐊', group: 'Reptile', fact: 'The temperature of the nest decides whether hatchlings are male or female.' },
  { name: 'Monitor Lizard', emoji: '🦎', group: 'Reptile', fact: 'Uses a forked tongue to "taste" the direction of prey.' },
  { name: 'Horned Lizard', emoji: '🦎', group: 'Reptile', fact: 'Can squirt a jet of blood from its eyes to deter predators.' },
  { name: 'Tuatara', emoji: '🦎', group: 'Reptile', fact: 'A living fossil whose lineage predates the dinosaurs.' },
  { name: 'Green Anole', emoji: '🦎', group: 'Reptile', fact: 'Changes between green and brown depending on mood and temperature.' },
  { name: 'Skink', emoji: '🦎', group: 'Reptile', fact: 'Can drop its tail to escape and later grow a new one.' },
  { name: 'Cottonmouth', emoji: '🐍', group: 'Reptile', fact: 'Gapes its white mouth open as a warning before it strikes.' },
  { name: 'Black Mamba', emoji: '🐍', group: 'Reptile', fact: 'Africa’s fastest snake, gliding at up to 20 km/h.' },
  { name: 'Sidewinder', emoji: '🐍', group: 'Reptile', fact: 'Loops sideways across loose sand to keep most of its body off the heat.' },
  { name: 'Sea Snake', emoji: '🐍', group: 'Reptile', fact: 'Can absorb some oxygen straight from seawater through its skin.' },
  { name: 'Nile Crocodile', emoji: '🐊', group: 'Reptile', fact: 'Mothers gently carry their hatchlings to water inside their jaws.' },
  { name: 'Gharial', emoji: '🐊', group: 'Reptile', fact: 'Its slender snout is built for snapping up fish underwater.' },
  { name: 'Box Turtle', emoji: '🐢', group: 'Reptile', fact: 'A hinged shell lets it close up completely like a box.' },
  { name: 'Snapping Turtle', emoji: '🐢', group: 'Reptile', fact: 'Its neck can strike out nearly as long as its own shell.' },
  { name: 'Leopard Gecko', emoji: '🦎', group: 'Reptile', fact: 'Unlike most geckos, it has movable eyelids and can blink.' },
  { name: 'Bearded Dragon', emoji: '🦎', group: 'Reptile', fact: 'Waves an arm at other dragons to signal submission.' },
  { name: 'Thorny Devil', emoji: '🦎', group: 'Reptile', fact: 'Channels dew along grooves in its skin straight to its mouth.' },
  { name: 'Chuckwalla', emoji: '🦎', group: 'Reptile', fact: 'Wedges into a rock crack and puffs up so predators can’t pull it out.' },
  { name: 'Green Tree Python', emoji: '🐍', group: 'Reptile', fact: 'Drapes itself in neat coils over a branch to ambush prey.' },
  { name: 'Coral Snake', emoji: '🐍', group: 'Reptile', fact: 'Its bright bands warn of one of the most potent snake venoms.' },
  { name: 'Garter Snake', emoji: '🐍', group: 'Reptile', fact: 'Thousands can gather in a single writhing mating ball.' },
  { name: 'Hognose Snake', emoji: '🐍', group: 'Reptile', fact: 'Plays dead dramatically, flipping belly-up when threatened.' },
  { name: 'Slow Worm', emoji: '🦎', group: 'Reptile', fact: 'Looks like a snake but is actually a legless lizard.' },
  { name: 'Marine Iguana', emoji: '🦎', group: 'Reptile', fact: 'The only lizard that forages by diving into the sea.' },
  { name: 'Flying Dragon Lizard', emoji: '🦎', group: 'Reptile', fact: 'Glides between trees on wing-like flaps of skin.' },
  { name: 'Caiman', emoji: '🐊', group: 'Reptile', fact: 'Its bony plates make its hide nearly bulletproof.' },
  { name: 'Painted Turtle', emoji: '🐢', group: 'Reptile', fact: 'Hatchlings can survive being frozen through their first winter.' },
  { name: 'Softshell Turtle', emoji: '🐢', group: 'Reptile', fact: 'Breathes partly through its skin and throat while underwater.' },
  { name: 'Reticulated Python', emoji: '🐍', group: 'Reptile', fact: 'The world’s longest snake, exceeding 6 m.' },
  { name: 'Green Iguana', emoji: '🦎', group: 'Reptile', fact: 'Can leap from high branches and land unharmed.' },
  { name: 'Desert Tortoise', emoji: '🐢', group: 'Reptile', fact: 'Stores water in its bladder to survive months of drought.' },
  { name: 'Chinese Water Dragon', emoji: '🦎', group: 'Reptile', fact: 'Dives underwater and can stay submerged for up to 25 minutes.' },
  { name: 'Gaboon Viper', emoji: '🐍', group: 'Reptile', fact: 'Has the longest fangs of any snake, up to 5 cm.' },
  { name: 'Egg-eating Snake', emoji: '🐍', group: 'Reptile', fact: 'Swallows eggs whole, then crushes them with bony spines in its throat.' },

  // Amphibians
  { name: 'Axolotl', emoji: '🦎', group: 'Amphibian', fact: 'Can regrow limbs, spinal cord and even parts of its heart and brain.' },
  { name: 'Poison Dart Frog', emoji: '🐸', group: 'Amphibian', fact: 'A single frog holds enough toxin to threaten ten adult humans.' },
  { name: 'Red-eyed Tree Frog', emoji: '🐸', group: 'Amphibian', fact: 'Flashes its red eyes to startle predators long enough to leap away.' },
  { name: 'Goliath Frog', emoji: '🐸', group: 'Amphibian', fact: 'The largest frog on earth, big enough to fill a dinner plate.' },
  { name: 'Glass Frog', emoji: '🐸', group: 'Amphibian', fact: 'Its translucent belly reveals its beating heart and organs.' },
  { name: 'Wood Frog', emoji: '🐸', group: 'Amphibian', fact: 'Freezes almost solid in winter, then thaws back to life in spring.' },
  { name: 'Cane Toad', emoji: '🐸', group: 'Amphibian', fact: 'Secretes a toxin strong enough to kill animals that try to eat it.' },
  { name: 'Fire Salamander', emoji: '🦎', group: 'Amphibian', fact: 'Its bold yellow markings warn of skin toxins.' },
  { name: 'Hellbender', emoji: '🦎', group: 'Amphibian', fact: 'A giant salamander that breathes through wrinkly folds of skin.' },
  { name: 'Caecilian', emoji: '🐍', group: 'Amphibian', fact: 'A limbless, nearly blind amphibian that burrows like a worm.' },
  { name: 'Bullfrog', emoji: '🐸', group: 'Amphibian', fact: 'Its deep call can be heard from nearly a kilometre away.' },
  { name: 'Tree Frog', emoji: '🐸', group: 'Amphibian', fact: 'Sticky toe pads let it cling to smooth leaves and glass.' },
  { name: 'Surinam Toad', emoji: '🐸', group: 'Amphibian', fact: 'Carries its eggs embedded in the skin of its own back.' },
  { name: 'Common Toad', emoji: '🐸', group: 'Amphibian', fact: 'Returns to the same breeding pond year after year.' },
  { name: 'Marbled Salamander', emoji: '🦎', group: 'Amphibian', fact: 'Lays eggs on dry land and guards them until rain arrives.' },
  { name: 'Tiger Salamander', emoji: '🦎', group: 'Amphibian', fact: 'One of the largest land-dwelling salamanders in the world.' },
  { name: 'Newt', emoji: '🦎', group: 'Amphibian', fact: 'Can regrow lost limbs, eyes and even parts of its heart.' },
  { name: 'Mudpuppy', emoji: '🦎', group: 'Amphibian', fact: 'Keeps its feathery external gills for its entire life.' },
  { name: 'Olm', emoji: '🦎', group: 'Amphibian', fact: 'A blind cave dweller that can survive years without eating.' },
  { name: 'Golden Poison Frog', emoji: '🐸', group: 'Amphibian', fact: 'One of the most toxic animals alive, its skin lethal to the touch.' },
  { name: 'Pacman Frog', emoji: '🐸', group: 'Amphibian', fact: 'A round ambush predator that eats prey nearly its own size.' },
  { name: 'Tomato Frog', emoji: '🐸', group: 'Amphibian', fact: 'Puffs up and oozes a sticky white goo when threatened.' },
  { name: 'Darwin’s Frog', emoji: '🐸', group: 'Amphibian', fact: 'The father shelters tadpoles inside his vocal sac until they mature.' },
  { name: 'Waxy Monkey Frog', emoji: '🐸', group: 'Amphibian', fact: 'Coats itself in a waxy secretion to avoid drying out.' },
  { name: 'Spadefoot Toad', emoji: '🐸', group: 'Amphibian', fact: 'Digs backwards into the soil using hardened spades on its feet.' },
  { name: 'African Clawed Frog', emoji: '🐸', group: 'Amphibian', fact: 'Was once used worldwide as a living pregnancy test.' },
  { name: 'Leopard Frog', emoji: '🐸', group: 'Amphibian', fact: 'Its spotted skin helps it vanish into pond-edge vegetation.' },
  { name: 'Pool Frog', emoji: '🐸', group: 'Amphibian', fact: 'Basks in the sun far more than most other frogs.' },
  { name: 'Common Frog', emoji: '🐸', group: 'Amphibian', fact: 'Breathes partly through its moist, permeable skin.' },
  { name: 'Midwife Toad', emoji: '🐸', group: 'Amphibian', fact: 'The male carries strings of eggs wrapped around his hind legs.' },
  { name: 'Cricket Frog', emoji: '🐸', group: 'Amphibian', fact: 'Can leap over 30 times its own body length.' },
  { name: 'Painted Reed Frog', emoji: '🐸', group: 'Amphibian', fact: 'Its bold patterns can vary wildly even within one population.' },
  { name: 'Horned Frog', emoji: '🐸', group: 'Amphibian', fact: 'Fleshy "horns" over its eyes help it hide among leaf litter.' },
  { name: 'Spring Peeper', emoji: '🐸', group: 'Amphibian', fact: 'Its high peeping chorus is one of the first signs of spring.' },
  { name: 'Amazon Milk Frog', emoji: '🐸', group: 'Amphibian', fact: 'Secretes a milky toxin from its skin when stressed.' },
  { name: 'Fire-bellied Toad', emoji: '🐸', group: 'Amphibian', fact: 'Arches its back to flash a bright warning belly.' },
  { name: 'Rocket Frog', emoji: '🐸', group: 'Amphibian', fact: 'Launches into enormous leaps to escape danger.' },
  { name: 'Purple Frog', emoji: '🐸', group: 'Amphibian', fact: 'Spends almost its whole life underground, surfacing only to breed.' },
  { name: 'Yellow-bellied Toad', emoji: '🐸', group: 'Amphibian', fact: 'Can live over 20 years despite its small size.' },
  { name: 'Green Tree Frog', emoji: '🐸', group: 'Amphibian', fact: 'Changes shade from bright green to brown with temperature.' },
  { name: 'Wallace’s Flying Frog', emoji: '🐸', group: 'Amphibian', fact: 'Glides between trees using huge webbed feet as parachutes.' },
  { name: 'Mossy Frog', emoji: '🐸', group: 'Amphibian', fact: 'Its bumpy skin mimics moss so perfectly it seems to vanish.' },
  { name: 'Corroboree Frog', emoji: '🐸', group: 'Amphibian', fact: 'Makes its own toxin rather than getting it from its diet.' },
  { name: 'Common Mudpuppy', emoji: '🦎', group: 'Amphibian', fact: 'Its gills grow bushier in oxygen-poor water.' },
  { name: 'Emperor Newt', emoji: '🦎', group: 'Amphibian', fact: 'Warty orange skin advertises a powerful toxin.' },
  { name: 'Blue Poison Frog', emoji: '🐸', group: 'Amphibian', fact: 'Each frog’s pattern of black spots is unique.' },
  { name: 'Giant Chinese Salamander', emoji: '🦎', group: 'Amphibian', fact: 'The largest amphibian alive, reaching nearly 1.8 m.' },
  { name: 'Strawberry Poison Frog', emoji: '🐸', group: 'Amphibian', fact: 'The mother feeds her tadpoles unfertilised eggs one by one.' },
  { name: 'Barking Tree Frog', emoji: '🐸', group: 'Amphibian', fact: 'Its call sounds startlingly like a barking dog.' },
  { name: 'Cave Salamander', emoji: '🦎', group: 'Amphibian', fact: 'Uses its prehensile tail to climb damp cave walls.' },

  // Fish
  { name: 'Seahorse', emoji: '🐠', group: 'Fish', fact: 'The male, not the female, carries and gives birth to the young.' },
  { name: 'Electric Eel', emoji: '🐍', group: 'Fish', fact: 'Delivers shocks of up to 600 volts to stun prey.' },
  { name: 'Great White Shark', emoji: '🦈', group: 'Fish', fact: 'Senses the faint electric fields of prey through jelly-filled pores.' },
  { name: 'Clownfish', emoji: '🐠', group: 'Fish', fact: 'Lives unharmed among stinging anemone tentacles.' },
  { name: 'Anglerfish', emoji: '🐟', group: 'Fish', fact: 'Dangles a glowing lure grown from its own spine to attract prey.' },
  { name: 'Pufferfish', emoji: '🐡', group: 'Fish', fact: 'Inflates into a spiny ball and carries a deadly toxin.' },
  { name: 'Manta Ray', emoji: '🐟', group: 'Fish', fact: 'Has the largest brain of any fish and passes the mirror test.' },
  { name: 'Swordfish', emoji: '🗡️', group: 'Fish', fact: 'Heats its own eyes and brain to see better in cold deep water.' },
  { name: 'Salmon', emoji: '🐟', group: 'Fish', fact: 'Navigates thousands of kilometres back to its birth stream to spawn.' },
  { name: 'Piranha', emoji: '🐟', group: 'Fish', fact: 'Communicates with barks and drumming sounds from its swim bladder.' },
  { name: 'Betta Fish', emoji: '🐠', group: 'Fish', fact: 'Gulps air from the surface using a special labyrinth organ.' },
  { name: 'Whale Shark', emoji: '🦈', group: 'Fish', fact: 'The largest fish alive, yet it feeds mostly on tiny plankton.' },
  { name: 'Hammerhead Shark', emoji: '🦈', group: 'Fish', fact: 'Its wide head spreads sensors for near-360° prey detection.' },
  { name: 'Moray Eel', emoji: '🐍', group: 'Fish', fact: 'Has a second set of jaws in its throat to drag prey down.' },
  { name: 'Lionfish', emoji: '🐠', group: 'Fish', fact: 'Fans out venomous spines to warn off any attacker.' },
  { name: 'Mudskipper', emoji: '🐟', group: 'Fish', fact: 'Walks on land and breathes through its skin out of water.' },
  { name: 'Flying Fish', emoji: '🐟', group: 'Fish', fact: 'Glides over 100 m above the waves to escape predators.' },
  { name: 'Stonefish', emoji: '🐟', group: 'Fish', fact: 'The most venomous fish, disguised as a lump of rock.' },
  { name: 'Parrotfish', emoji: '🐠', group: 'Fish', fact: 'Sleeps inside a self-made cocoon of mucus each night.' },
  { name: 'Sunfish', emoji: '🐟', group: 'Fish', fact: 'The heaviest bony fish, laying up to 300 million eggs at once.' },
  { name: 'Barracuda', emoji: '🐟', group: 'Fish', fact: 'Ambushes prey with sudden bursts of over 40 km/h.' },
  { name: 'Archerfish', emoji: '🐟', group: 'Fish', fact: 'Shoots down insects by spitting a precise jet of water.' },
  { name: 'Goldfish', emoji: '🐠', group: 'Fish', fact: 'Can remember things for months, not just seconds.' },
  { name: 'Koi', emoji: '🐠', group: 'Fish', fact: 'Well-kept individuals can live for over a century.' },
  { name: 'Tuna', emoji: '🐟', group: 'Fish', fact: 'Warm-blooded muscles let it cruise the open ocean at high speed.' },
  { name: 'Catfish', emoji: '🐟', group: 'Fish', fact: 'Tastes with its whole body — its skin is covered in taste buds.' },
  { name: 'Cod', emoji: '🐟', group: 'Fish', fact: 'A single female can release millions of eggs in one spawning.' },
  { name: 'Herring', emoji: '🐟', group: 'Fish', fact: 'Communicates by releasing bursts of bubbles from its rear.' },
  { name: 'Mackerel', emoji: '🐟', group: 'Fish', fact: 'Swims in tight, glittering schools to confuse predators.' },
  { name: 'Sardine', emoji: '🐟', group: 'Fish', fact: 'Forms shoals so vast they can be seen from the air.' },
  { name: 'Rainbow Trout', emoji: '🐟', group: 'Fish', fact: 'Can sense tiny water vibrations through a line of sensory pores.' },
  { name: 'Carp', emoji: '🐟', group: 'Fish', fact: 'Uses barbels around its mouth to taste for food in murky mud.' },
  { name: 'Guppy', emoji: '🐠', group: 'Fish', fact: 'Gives birth to live young rather than laying eggs.' },
  { name: 'Angelfish', emoji: '🐠', group: 'Fish', fact: 'Pairs often stay together for life.' },
  { name: 'Discus', emoji: '🐠', group: 'Fish', fact: 'Parents feed their fry a nutritious slime from their own skin.' },
  { name: 'Tetra', emoji: '🐠', group: 'Fish', fact: 'The neon tetra glows thanks to light-reflecting crystals in its skin.' },
  { name: 'Gar', emoji: '🐟', group: 'Fish', fact: 'Can gulp air, letting it survive in oxygen-starved water.' },
  { name: 'Sturgeon', emoji: '🐟', group: 'Fish', fact: 'An ancient armoured fish that can live over 100 years.' },
  { name: 'Eel', emoji: '🐍', group: 'Fish', fact: 'Some species migrate across the ocean to spawn in the Sargasso Sea.' },
  { name: 'Wolffish', emoji: '🐟', group: 'Fish', fact: 'Produces natural antifreeze to survive near-freezing seas.' },
  { name: 'Coelacanth', emoji: '🐟', group: 'Fish', fact: 'A "living fossil" thought extinct until rediscovered in 1938.' },
  { name: 'Lungfish', emoji: '🐟', group: 'Fish', fact: 'Can survive drought by burrowing into mud and breathing air.' },
  { name: 'Remora', emoji: '🐟', group: 'Fish', fact: 'Hitchhikes on sharks using a suction disc on its head.' },
  { name: 'Sawfish', emoji: '🐟', group: 'Fish', fact: 'Its toothed snout senses and slashes prey in murky water.' },
  { name: 'Stingray', emoji: '🐟', group: 'Fish', fact: 'Buries in sand and detects prey through electrical sensors.' },
  { name: 'Blobfish', emoji: '🐟', group: 'Fish', fact: 'Its gelatinous body holds shape only under crushing deep-sea pressure.' },
  { name: 'Napoleon Wrasse', emoji: '🐠', group: 'Fish', fact: 'Can change from female to male as it grows.' },
  { name: 'Triggerfish', emoji: '🐠', group: 'Fish', fact: 'Locks a spine upright to wedge itself safely into crevices.' },
  { name: 'Cleaner Wrasse', emoji: '🐠', group: 'Fish', fact: 'Runs cleaning stations, nibbling parasites off larger fish.' },
  { name: 'Oarfish', emoji: '🐟', group: 'Fish', fact: 'The longest bony fish, sometimes reaching over 8 m.' },

  // Insects
  { name: 'Honey Bee', emoji: '🐝', group: 'Insect', fact: 'Communicates the direction of flowers with a figure-eight "waggle dance".' },
  { name: 'Firefly', emoji: '🪲', group: 'Insect', fact: 'Produces near-100%-efficient "cold light" through bioluminescence.' },
  { name: 'Monarch Butterfly', emoji: '🦋', group: 'Insect', fact: 'Migrates thousands of kilometres over several generations.' },
  { name: 'Praying Mantis', emoji: '🦗', group: 'Insect', fact: 'The only insect that can swivel its head to look over its shoulder.' },
  { name: 'Dung Beetle', emoji: '🪲', group: 'Insect', fact: 'Navigates in a straight line using the Milky Way.' },
  { name: 'Dragonfly', emoji: '🦟', group: 'Insect', fact: 'Catches prey mid-air with a stunning 95% success rate.' },
  { name: 'Leafcutter Ant', emoji: '🐜', group: 'Insect', fact: 'Farms fungus on the leaf fragments it harvests.' },
  { name: 'Bombardier Beetle', emoji: '🪲', group: 'Insect', fact: 'Sprays a boiling, explosive chemical jet at attackers.' },
  { name: 'Atlas Moth', emoji: '🦋', group: 'Insect', fact: 'One of the largest moths, with no mouth — it never eats as an adult.' },
  { name: 'Cicada', emoji: '🦗', group: 'Insect', fact: 'Some species stay underground for 17 years before emerging.' },
  { name: 'Ladybug', emoji: '🐞', group: 'Insect', fact: 'Can devour thousands of aphids in its lifetime.' },
  { name: 'Ant', emoji: '🐜', group: 'Insect', fact: 'Can lift objects around 50 times its own body weight.' },
  { name: 'Termite', emoji: '🐜', group: 'Insect', fact: 'Builds towering mounds with built-in air conditioning.' },
  { name: 'Grasshopper', emoji: '🦗', group: 'Insect', fact: 'Hears through an organ on its abdomen, not its head.' },
  { name: 'Cricket', emoji: '🦗', group: 'Insect', fact: 'You can estimate the temperature by counting its chirps.' },
  { name: 'Wasp', emoji: '🐝', group: 'Insect', fact: 'Paper wasps recognise each other by their facial markings.' },
  { name: 'Hornet', emoji: '🐝', group: 'Insect', fact: 'A colony can raise its nest temperature to cook invading beetles.' },
  { name: 'Bumblebee', emoji: '🐝', group: 'Insect', fact: 'Vibrates flowers to shake loose pollen other bees can’t reach.' },
  { name: 'Housefly', emoji: '🪰', group: 'Insect', fact: 'Tastes food with sensors on its feet.' },
  { name: 'Mosquito', emoji: '🦟', group: 'Insect', fact: 'Only the females bite; they hunt by sensing exhaled carbon dioxide.' },
  { name: 'Stick Insect', emoji: '🦗', group: 'Insect', fact: 'Mimics a twig so well that it sways to imitate wind.' },
  { name: 'Leaf Insect', emoji: '🦗', group: 'Insect', fact: 'Its body copies the veins and even bite marks of real leaves.' },
  { name: 'Weevil', emoji: '🪲', group: 'Insect', fact: 'Its long snout drills holes to lay eggs deep inside seeds.' },
  { name: 'Stag Beetle', emoji: '🪲', group: 'Insect', fact: 'Males wrestle with huge jaw-like mandibles over mates.' },
  { name: 'Rhinoceros Beetle', emoji: '🪲', group: 'Insect', fact: 'Can carry hundreds of times its own weight.' },
  { name: 'Jewel Beetle', emoji: '🪲', group: 'Insect', fact: 'Can detect forest fires from tens of kilometres away.' },
  { name: 'Water Strider', emoji: '🦟', group: 'Insect', fact: 'Walks on water using tiny water-repellent leg hairs.' },
  { name: 'Backswimmer', emoji: '🦟', group: 'Insect', fact: 'Swims upside down carrying a bubble of air like a scuba tank.' },
  { name: 'Antlion', emoji: '🐜', group: 'Insect', fact: 'Its larva digs a sand pit trap to catch tumbling ants.' },
  { name: 'Lacewing', emoji: '🦋', group: 'Insect', fact: 'Its larvae camouflage themselves with the corpses of their prey.' },
  { name: 'Aphid', emoji: '🐜', group: 'Insect', fact: 'Females are born already pregnant with their next generation.' },
  { name: 'Flea', emoji: '🦗', group: 'Insect', fact: 'Can jump over 100 times its own body length.' },
  { name: 'Cockroach', emoji: '🪳', group: 'Insect', fact: 'Can survive for a week without its head.' },
  { name: 'Earwig', emoji: '🦗', group: 'Insect', fact: 'A rare insect that carefully guards and grooms its eggs.' },
  { name: 'Silverfish', emoji: '🦗', group: 'Insect', fact: 'A wingless insect whose lineage is over 400 million years old.' },
  { name: 'Weaver Ant', emoji: '🐜', group: 'Insect', fact: 'Stitches leaf nests together using silk from its own larvae.' },
  { name: 'Bullet Ant', emoji: '🐜', group: 'Insect', fact: 'Delivers what’s rated the most painful insect sting on earth.' },
  { name: 'Fire Ant', emoji: '🐜', group: 'Insect', fact: 'Links bodies into living rafts to float through floods.' },
  { name: 'Army Ant', emoji: '🐜', group: 'Insect', fact: 'Marches in raiding columns and builds bridges from its own bodies.' },
  { name: 'Luna Moth', emoji: '🦋', group: 'Insect', fact: 'Its long tails spin to jam bat sonar mid-flight.' },
  { name: 'Hawk Moth', emoji: '🦋', group: 'Insect', fact: 'Hovers like a hummingbird to sip nectar in flight.' },
  { name: 'Swallowtail Butterfly', emoji: '🦋', group: 'Insect', fact: 'Its caterpillar flashes eye-spots to mimic a snake.' },
  { name: 'Morpho Butterfly', emoji: '🦋', group: 'Insect', fact: 'Its brilliant blue comes from wing structure, not pigment.' },
  { name: 'Glowworm', emoji: '🪲', group: 'Insect', fact: 'Its larvae hang sticky glowing threads to snare flying insects.' },
  { name: 'Water Beetle', emoji: '🪲', group: 'Insect', fact: 'Traps a shimmering air bubble beneath its wings to breathe underwater.' },
  { name: 'Cockchafer', emoji: '🪲', group: 'Insect', fact: 'Its grubs can spend up to four years underground.' },
  { name: 'Mayfly', emoji: '🦟', group: 'Insect', fact: 'Some adults live only a single day, just long enough to mate.' },
  { name: 'Assassin Bug', emoji: '🦗', group: 'Insect', fact: 'Injects prey with saliva that liquefies its insides.' },
  { name: 'Giant Weta', emoji: '🦗', group: 'Insect', fact: 'One of the heaviest insects, outweighing a small bird.' },
  { name: 'Velvet Ant', emoji: '🐜', group: 'Insect', fact: 'Actually a wasp, nicknamed "cow killer" for its fierce sting.' },

  // Sea creatures
  { name: 'Octopus', emoji: '🐙', group: 'Sea creature', fact: 'Has three hearts and blue, copper-based blood.' },
  { name: 'Cuttlefish', emoji: '🦑', group: 'Sea creature', fact: 'Can hypnotise prey with rippling waves of colour across its skin.' },
  { name: 'Mantis Shrimp', emoji: '🦐', group: 'Sea creature', fact: 'Punches with the acceleration of a .22 calibre bullet.' },
  { name: 'Giant Squid', emoji: '🦑', group: 'Sea creature', fact: 'Has eyes the size of dinner plates, the largest of any animal.' },
  { name: 'Jellyfish', emoji: '🪼', group: 'Sea creature', fact: 'Has drifted the oceans for over 500 million years, with no brain or heart.' },
  { name: 'Sea Star', emoji: '⭐', group: 'Sea creature', fact: 'Can regrow an entire body from a single severed arm.' },
  { name: 'Hermit Crab', emoji: '🦀', group: 'Sea creature', fact: 'Trades up to bigger empty shells as it grows.' },
  { name: 'Nautilus', emoji: '🐚', group: 'Sea creature', fact: 'A living fossil that jets through water using a chambered shell.' },
  { name: 'Coral', emoji: '🪸', group: 'Sea creature', fact: 'A colony of tiny animals that builds the largest structures made by life.' },
  { name: 'Sea Cucumber', emoji: '🥒', group: 'Sea creature', fact: 'Can expel its own guts to distract predators, then regrow them.' },
  { name: 'Horseshoe Crab', emoji: '🦀', group: 'Sea creature', fact: 'Its blue blood is used to test medicines for contamination.' },
  { name: 'Sea Urchin', emoji: '🦔', group: 'Sea creature', fact: 'Its whole body surface can sense light, acting like one big eye.' },
  { name: 'Lobster', emoji: '🦞', group: 'Sea creature', fact: 'Tastes with its legs and can live for over a century.' },
  { name: 'King Crab', emoji: '🦀', group: 'Sea creature', fact: 'Marches across the seafloor in vast migrating herds.' },
  { name: 'Sea Slug', emoji: '🐌', group: 'Sea creature', fact: 'Some steal stinging cells or even solar power from what they eat.' },
  { name: 'Blue-ringed Octopus', emoji: '🐙', group: 'Sea creature', fact: 'Tiny but carries venom potent enough to kill a human.' },
  { name: 'Portuguese Man o’ War', emoji: '🪼', group: 'Sea creature', fact: 'Not one animal but a colony of specialised organisms living as one.' },
  { name: 'Anemone', emoji: '🪸', group: 'Sea creature', fact: 'Stings and paralyses prey with harpoon-like cells.' },
  { name: 'Barnacle', emoji: '🐚', group: 'Sea creature', fact: 'Glues its head to rocks and kicks food in with feathery legs.' },
  { name: 'Krill', emoji: '🦐', group: 'Sea creature', fact: 'Its swarms are among the largest gatherings of animals on earth.' },
  { name: 'Sea Sponge', emoji: '🧽', group: 'Sea creature', fact: 'One of the simplest animals, filtering thousands of litres of water a day.' },
  { name: 'Starfish', emoji: '⭐', group: 'Sea creature', fact: 'Pushes its stomach out of its body to digest prey outside itself.' },
  { name: 'Sand Dollar', emoji: '🪙', group: 'Sea creature', fact: 'A flat relative of the urchin, covered in tiny moving spines.' },
  { name: 'Vampire Squid', emoji: '🦑', group: 'Sea creature', fact: 'Turns itself inside out to hide its spines when threatened.' },
  { name: 'Dumbo Octopus', emoji: '🐙', group: 'Sea creature', fact: 'Flaps ear-like fins to "fly" through the deep sea.' },
  { name: 'Crab', emoji: '🦀', group: 'Sea creature', fact: 'Walks sideways because of the way its legs are hinged.' },
  { name: 'Shrimp', emoji: '🦐', group: 'Sea creature', fact: 'The pistol shrimp snaps its claw fast enough to stun prey with a bubble.' },
  { name: 'Cone Snail', emoji: '🐚', group: 'Sea creature', fact: 'Fires a venomous harpoon to spear passing fish.' },
  { name: 'Giant Clam', emoji: '🐚', group: 'Sea creature', fact: 'Farms algae in its own flesh and can live over 100 years.' },
  { name: 'Christmas Tree Worm', emoji: '🪸', group: 'Sea creature', fact: 'Retracts its colourful feeding crowns in a flash when disturbed.' },
  { name: 'Sea Pig', emoji: '🥒', group: 'Sea creature', fact: 'A plump deep-sea cucumber that walks the seabed on tube feet.' },
  { name: 'Feather Star', emoji: '⭐', group: 'Sea creature', fact: 'Swims by gracefully flapping its many feathery arms.' },
  { name: 'Brittle Star', emoji: '⭐', group: 'Sea creature', fact: 'Moves with surprising speed by whipping its slender arms.' },
  { name: 'Comb Jelly', emoji: '🪼', group: 'Sea creature', fact: 'Rows of beating cilia scatter light into shimmering rainbows.' },
  { name: 'Box Jellyfish', emoji: '🪼', group: 'Sea creature', fact: 'Has 24 eyes and some of the most potent venom in the sea.' },
  { name: 'Immortal Jellyfish', emoji: '🪼', group: 'Sea creature', fact: 'Can revert to its juvenile form, cheating death indefinitely.' },
  { name: 'Coconut Crab', emoji: '🦀', group: 'Sea creature', fact: 'The largest land arthropod, strong enough to crack coconuts.' },
  { name: 'Fiddler Crab', emoji: '🦀', group: 'Sea creature', fact: 'Males wave one giant claw to court and to warn off rivals.' },
  { name: 'Spider Crab', emoji: '🦀', group: 'Sea creature', fact: 'The Japanese giant has a leg span wider than a person is tall.' },
  { name: 'Mussel', emoji: '🐚', group: 'Sea creature', fact: 'Anchors to rocks with threads tough enough to inspire medical glue.' },
  { name: 'Oyster', emoji: '🦪', group: 'Sea creature', fact: 'Coats an irritating grain of sand in nacre to form a pearl.' },
  { name: 'Scallop', emoji: '🐚', group: 'Sea creature', fact: 'Swims by clapping its shells and has dozens of tiny blue eyes.' },
  { name: 'Sea Angel', emoji: '🪼', group: 'Sea creature', fact: 'A shell-less sea snail that "flies" through the water with wing-like flaps.' },
  { name: 'Flamingo Tongue Snail', emoji: '🐚', group: 'Sea creature', fact: 'Its bright spots are living tissue draped over a plain shell.' },
  { name: 'Peacock Mantis Shrimp', emoji: '🦐', group: 'Sea creature', fact: 'Sees a spectrum of colour far beyond the human eye.' },
  { name: 'Ghost Shrimp', emoji: '🦐', group: 'Sea creature', fact: 'Its transparent body makes it nearly invisible in the water.' },
  { name: 'Sea Lily', emoji: '🪸', group: 'Sea creature', fact: 'An ancient animal that anchors to the seabed on a long stalk.' },
  { name: 'Basket Star', emoji: '⭐', group: 'Sea creature', fact: 'Unfurls a lattice of branching arms to sieve food from the current.' },
  { name: 'Moon Jellyfish', emoji: '🪼', group: 'Sea creature', fact: 'You can see its four horseshoe-shaped organs through its clear bell.' },
  { name: 'Nudibranch', emoji: '🐌', group: 'Sea creature', fact: 'Its dazzling colours warn predators of borrowed toxins.' },
];

export type TarotElement = 'Fire' | 'Water' | 'Air' | 'Earth';
export type TarotVerdict = 'Yes' | 'No' | 'Maybe';

export interface TarotCard {
  name: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  keywords: string[];
  element: TarotElement;
  astrology: string;
  yesNo: TarotVerdict;
  upright: string;
  reversed: string;
  love: string;

  img: string;
}

const SUIT_CODE: Record<NonNullable<TarotCard['suit']>, string> = {
  Wands: 'wa', Cups: 'cu', Swords: 'sw', Pentacles: 'pe',
};
const RANK_CODE = ['ac', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'pa', 'kn', 'qu', 'ki'];

type MajorRow = [string, TarotElement, string, TarotVerdict, string, string, string, string];

const MAJOR: MajorRow[] = [
  ['The Fool', 'Air', 'Uranus', 'Yes', 'new beginnings, spontaneity, leap of faith, innocence', 'New beginnings, spontaneity and a leap of faith.', 'Recklessness, hesitation and fear of the unknown.', 'A carefree new romance — say yes to the adventure.'],
  ['The Magician', 'Air', 'Mercury', 'Yes', 'willpower, manifestation, skill, resourcefulness', 'Willpower, skill and manifesting your intent.', 'Manipulation, untapped talent and self-doubt.', 'You have everything you need to make it work.'],
  ['The High Priestess', 'Water', 'The Moon', 'Maybe', 'intuition, mystery, subconscious, inner voice', 'Intuition, mystery and the subconscious speaking.', 'Secrets withheld and disconnection from instinct.', 'Trust your gut; something is unspoken.'],
  ['The Empress', 'Earth', 'Venus', 'Yes', 'abundance, nurturing, fertility, sensuality', 'Abundance, nurturing and blooming creativity.', 'Dependence, creative block and neglect.', 'A warm, sensual and fertile connection.'],
  ['The Emperor', 'Fire', 'Aries', 'Yes', 'structure, authority, stability, protection', 'Structure, authority and steady stability.', 'Domination, rigidity and loss of control.', 'A committed, dependable partner.'],
  ['The Hierophant', 'Earth', 'Taurus', 'Yes', 'tradition, guidance, commitment, belief', 'Tradition, guidance and shared belief.', 'Rebellion, dogma and breaking convention.', 'A conventional, long-term commitment — marriage energy.'],
  ['The Lovers', 'Air', 'Gemini', 'Yes', 'union, choice, values, attraction', 'Union, choice and alignment of values.', 'Disharmony, imbalance and misaligned choices.', 'Deep connection and a meaningful choice in love.'],
  ['The Chariot', 'Water', 'Cancer', 'Yes', 'determination, control, drive, willpower', 'Determination, control and forward drive.', 'Loss of direction, opposition and no discipline.', 'Push forward — the relationship needs momentum.'],
  ['Strength', 'Fire', 'Leo', 'Yes', 'courage, patience, compassion, inner strength', 'Courage, patience and gentle power.', 'Self-doubt, raw emotion and low energy.', 'Lead with compassion, not force.'],
  ['The Hermit', 'Earth', 'Virgo', 'No', 'introspection, solitude, guidance, searching', 'Introspection, solitude and inner guidance.', 'Isolation, withdrawal and losing your way.', 'A time for space and soul-searching, not romance.'],
  ['Wheel of Fortune', 'Fire', 'Jupiter', 'Yes', 'change, cycles, luck, turning point', 'Change, cycles and fortunate turning points.', 'Bad luck, resistance to change and delay.', 'Fate is turning things in your favour.'],
  ['Justice', 'Air', 'Libra', 'Yes', 'fairness, truth, cause and effect, accountability', 'Fairness, truth and cause and effect.', 'Unfairness, dishonesty and avoiding accountability.', 'Honesty and balance decide the outcome.'],
  ['The Hanged Man', 'Water', 'Neptune', 'No', 'surrender, pause, new perspective, letting go', 'Surrender, a new perspective and a needed pause.', 'Stalling, indecision and needless sacrifice.', 'A relationship in limbo — wait and reflect.'],
  ['Death', 'Water', 'Scorpio', 'No', 'endings, transformation, transition, release', 'Endings, transformation and transition.', 'Resistance to change, stagnation and holding on.', 'One chapter closes so another can begin.'],
  ['Temperance', 'Fire', 'Sagittarius', 'Yes', 'balance, moderation, patience, harmony', 'Balance, moderation and patient harmony.', 'Excess, imbalance and misalignment.', 'A calm, well-balanced partnership.'],
  ['The Devil', 'Earth', 'Capricorn', 'No', 'attachment, temptation, materialism, addiction', 'Attachment, temptation and materialism.', 'Release, breaking free and reclaiming power.', 'Intense chemistry — watch for unhealthy patterns.'],
  ['The Tower', 'Fire', 'Mars', 'No', 'upheaval, revelation, chaos, sudden change', 'Sudden upheaval, revelation and chaos.', 'Averted disaster, fear of change and delay.', 'A shock that shakes the foundation of things.'],
  ['The Star', 'Air', 'Aquarius', 'Yes', 'hope, renewal, faith, healing', 'Hope, renewal and serene faith.', 'Discouragement, lost faith and disconnection.', 'Healing and renewed hope after hard times.'],
  ['The Moon', 'Water', 'Pisces', 'No', 'illusion, intuition, fear, the unconscious', 'Illusion, intuition and the unconscious.', 'Confusion clearing, fear released and truth surfacing.', 'Something is hidden — don’t trust appearances yet.'],
  ['The Sun', 'Fire', 'The Sun', 'Yes', 'joy, success, vitality, positivity', 'Joy, success and radiant vitality.', 'Temporary gloom and blocked positivity.', 'Warmth, joy and a glowing relationship.'],
  ['Judgement', 'Fire', 'Pluto', 'Yes', 'reckoning, awakening, renewal, absolution', 'Reckoning, awakening and renewal.', 'Self-doubt, ignoring the call and harsh judgement.', 'A second chance or meaningful reunion.'],
  ['The World', 'Earth', 'Saturn', 'Yes', 'completion, wholeness, achievement, fulfilment', 'Completion, wholeness and achievement.', 'Incompletion, loose ends and delayed closure.', 'A relationship that feels whole and complete.'],
];

type MinorRow = [string, string, TarotVerdict, string, string, string, string];

interface SuitDef {
  suit: NonNullable<TarotCard['suit']>;
  element: TarotElement;
  rows: MinorRow[];
}

const SUITS: SuitDef[] = [
  {
    suit: 'Wands', element: 'Fire',
    rows: [
      ['Ace', 'Fire (root of Fire)', 'Yes', 'inspiration, new energy, potential, creation', 'Inspiration and a spark of new creative energy.', 'Delays, false starts and lack of direction.', 'A passionate new spark.'],
      ['Two', 'Mars in Aries', 'Maybe', 'planning, decisions, discovery, future', 'Planning, first steps and weighing your options.', 'Fear of change, playing safe and poor planning.', 'Deciding where things are headed.'],
      ['Three', 'Sun in Aries', 'Yes', 'expansion, foresight, progress, growth', 'Expansion, foresight and ventures paying off.', 'Delays, obstacles and limited foresight.', 'Looking ahead together.'],
      ['Four', 'Venus in Aries', 'Yes', 'celebration, home, harmony, milestone', 'Celebration, harmony and a joyful homecoming.', 'Transition, lack of harmony and cancelled plans.', 'A happy milestone, maybe moving in.'],
      ['Five', 'Saturn in Leo', 'No', 'competition, conflict, tension, friction', 'Competition, friction and clashing energy.', 'Avoiding conflict, resolution and tension released.', 'Petty arguments to work through.'],
      ['Six', 'Jupiter in Leo', 'Yes', 'victory, recognition, success, reward', 'Victory, recognition and public reward.', 'Ego, a fall from grace and no recognition.', 'Confidence and public commitment.'],
      ['Seven', 'Mars in Leo', 'Maybe', 'defence, perseverance, challenge, courage', 'Standing your ground and persevering.', 'Overwhelm, giving up and yielding.', 'Defending the relationship.'],
      ['Eight', 'Mercury in Sagittarius', 'Yes', 'speed, action, movement, momentum', 'Speed, movement and swift action.', 'Delays, frustration and slowing down.', 'Fast developments and messages of love.'],
      ['Nine', 'Moon in Sagittarius', 'Maybe', 'resilience, grit, boundaries, persistence', 'Resilience, persistence and a last stand.', 'Exhaustion, defensiveness and paranoia.', 'Guarded, but hanging on.'],
      ['Ten', 'Saturn in Sagittarius', 'No', 'burden, responsibility, strain, overload', 'Burden, responsibility and carrying too much.', 'Release, delegation and letting go.', 'Carrying too much weight alone.'],
      ['Page', 'Fire signs (Aries · Leo · Sagittarius)', 'Yes', 'exploration, enthusiasm, free spirit, news', 'A free spirit bursting with enthusiasm and ideas.', 'Restlessness, hastiness and immaturity.', 'Flirty, playful new energy.'],
      ['Knight', 'Fire signs (Aries · Leo · Sagittarius)', 'Yes', 'action, adventure, passion, impulsiveness', 'Bold action, adventure and charging ahead.', 'Recklessness, impatience and burning out.', 'A passionate, impulsive pursuit.'],
      ['Queen', 'Fire signs (Aries · Leo · Sagittarius)', 'Yes', 'confidence, warmth, determination, charisma', 'Confidence, warmth and magnetic charisma.', 'Demanding, jealous and short-tempered.', 'A vibrant, self-assured partner.'],
      ['King', 'Fire signs (Aries · Leo · Sagittarius)', 'Yes', 'leadership, vision, boldness, honour', 'Natural leadership, vision and bold direction.', 'Impulsiveness, domineering and high expectations.', 'A charismatic, driven partner.'],
    ],
  },
  {
    suit: 'Cups', element: 'Water',
    rows: [
      ['Ace', 'Water (root of Water)', 'Yes', 'new love, emotion, compassion, intuition', 'New love and overflowing emotional beginnings.', 'Blocked emotions, emptiness and repressed feelings.', 'A new romance blossoms.'],
      ['Two', 'Venus in Cancer', 'Yes', 'partnership, union, attraction, harmony', 'Partnership, mutual attraction and union.', 'Disharmony, imbalance and broken communication.', 'A balanced, loving connection.'],
      ['Three', 'Mercury in Cancer', 'Yes', 'friendship, joy, community, celebration', 'Friendship, celebration and community.', 'Gossip, overindulgence and isolation.', 'Celebrating love with friends.'],
      ['Four', 'Moon in Cancer', 'No', 'apathy, contemplation, withdrawal, boredom', 'Apathy, contemplation and re-evaluation.', 'New awareness, acceptance and moving on.', 'Taking love for granted.'],
      ['Five', 'Mars in Scorpio', 'No', 'loss, regret, grief, disappointment', 'Loss, regret and dwelling on disappointment.', 'Acceptance, recovery and moving forward.', 'Grief over what went wrong.'],
      ['Six', 'Sun in Scorpio', 'Yes', 'nostalgia, memories, innocence, reunion', 'Nostalgia, sweet memories and reunions.', 'Stuck in the past and unrealistic nostalgia.', 'An old flame or reunion.'],
      ['Seven', 'Venus in Scorpio', 'Maybe', 'choices, illusion, imagination, fantasy', 'Many choices, fantasy and illusion.', 'Clarity, decision and a reality check.', 'Too many options, wishful thinking.'],
      ['Eight', 'Saturn in Pisces', 'Maybe', 'departure, withdrawal, seeking, meaning', 'Walking away to seek deeper meaning.', 'Fear of change, drifting and staying stuck.', 'Leaving what no longer fulfils you.'],
      ['Nine', 'Jupiter in Pisces', 'Yes', 'contentment, satisfaction, wishes, gratitude', 'Contentment, satisfaction and wishes fulfilled.', 'Dissatisfaction, greed and unmet wishes.', 'Emotional fulfilment — a wish granted.'],
      ['Ten', 'Mars in Pisces', 'Yes', 'happiness, family, harmony, belonging', 'Lasting happiness, harmony and family bliss.', 'A broken home, disharmony and misaligned values.', 'A happy, lasting relationship.'],
      ['Page', 'Water signs (Cancer · Scorpio · Pisces)', 'Yes', 'creativity, intuition, sensitivity, messages', 'A sensitive dreamer open to intuitive messages.', 'Moodiness, escapism and emotional immaturity.', 'A sweet, heartfelt overture.'],
      ['Knight', 'Water signs (Cancer · Scorpio · Pisces)', 'Yes', 'romance, charm, idealism, invitation', 'A romantic bringing charm and an invitation.', 'Moodiness, unrealistic ideals and jealousy.', 'A charming, romantic proposal.'],
      ['Queen', 'Water signs (Cancer · Scorpio · Pisces)', 'Yes', 'compassion, empathy, nurturing, intuition', 'Deep compassion, empathy and emotional wisdom.', 'Insecurity, over-giving and martyrdom.', 'A caring, emotionally attuned partner.'],
      ['King', 'Water signs (Cancer · Scorpio · Pisces)', 'Yes', 'emotional balance, diplomacy, calm, wisdom', 'Emotional balance, diplomacy and calm wisdom.', 'Moodiness, manipulation and emotional coldness.', 'A steady, emotionally mature partner.'],
    ],
  },
  {
    suit: 'Swords', element: 'Air',
    rows: [
      ['Ace', 'Air (root of Air)', 'Yes', 'clarity, truth, breakthrough, insight', 'Mental clarity, truth and breakthrough.', 'Confusion, clouded judgement and misinformation.', 'Honest truth cuts through.'],
      ['Two', 'Moon in Libra', 'No', 'indecision, stalemate, avoidance, impasse', 'A stalemate and a difficult, avoided choice.', 'Indecision released, confusion and overload.', 'Avoiding a decision.'],
      ['Three', 'Saturn in Libra', 'No', 'heartbreak, sorrow, hurt, betrayal', 'Heartbreak, grief and painful truth.', 'Recovery, forgiveness and releasing pain.', 'Heartache and betrayal.'],
      ['Four', 'Jupiter in Libra', 'Maybe', 'rest, recovery, respite, contemplation', 'Rest, recovery and quiet contemplation.', 'Restlessness, burnout and stagnation.', 'A needed pause.'],
      ['Five', 'Venus in Aquarius', 'No', 'conflict, defeat, tension, discord', 'Conflict, defeat and winning at all costs.', 'Reconciliation, making amends and moving on.', 'Arguments with no real winner.'],
      ['Six', 'Mercury in Aquarius', 'Maybe', 'transition, recovery, moving on, change', 'Transition, moving on and calmer waters.', 'Resistance to change and unfinished business.', 'Moving past a rough patch.'],
      ['Seven', 'Moon in Aquarius', 'No', 'deception, strategy, stealth, secrecy', 'Deception, strategy and acting alone.', 'Coming clean, conscience and owning up.', 'Dishonesty or secrecy.'],
      ['Eight', 'Jupiter in Gemini', 'No', 'restriction, entrapment, limitation, powerlessness', 'Restriction and self-imposed limits.', 'Freedom, release and a new perspective.', 'Feeling stuck or powerless.'],
      ['Nine', 'Mars in Gemini', 'No', 'anxiety, worry, fear, sleeplessness', 'Anxiety, worry and sleepless nights.', 'Hope, releasing worry and recovery.', 'Fear and overthinking.'],
      ['Ten', 'Sun in Gemini', 'No', 'ending, ruin, betrayal, rock bottom', 'A painful ending and rock bottom.', 'Recovery, regeneration — the worst is over.', 'A painful but final ending.'],
      ['Page', 'Air signs (Gemini · Libra · Aquarius)', 'Maybe', 'curiosity, vigilance, ideas, communication', 'A curious mind, alert and full of ideas.', 'Gossip, scattered energy and all talk.', 'Lots of talk, watch for mixed signals.'],
      ['Knight', 'Air signs (Gemini · Libra · Aquarius)', 'Maybe', 'ambition, drive, haste, directness', 'Fast, direct action driven by ambition.', 'Recklessness, aggression and no follow-through.', 'A fast, blunt pursuit.'],
      ['Queen', 'Air signs (Gemini · Libra · Aquarius)', 'Maybe', 'clarity, independence, honesty, boundaries', 'Clear-eyed honesty, independence and wit.', 'Coldness, bitterness and harsh words.', 'A sharp, independent partner.'],
      ['King', 'Air signs (Gemini · Libra · Aquarius)', 'Maybe', 'intellect, authority, truth, logic', 'Intellectual authority, truth and clear judgement.', 'Manipulation, coldness and abuse of power.', 'A logical, principled partner.'],
    ],
  },
  {
    suit: 'Pentacles', element: 'Earth',
    rows: [
      ['Ace', 'Earth (root of Earth)', 'Yes', 'opportunity, prosperity, new venture, manifestation', 'A new opportunity, prosperity and manifestation.', 'Missed chance, scarcity mindset and delay.', 'A stable, promising start.'],
      ['Two', 'Jupiter in Capricorn', 'Maybe', 'balance, adaptability, priorities, juggling', 'Balance, adaptability and juggling priorities.', 'Overwhelm, disorganisation and imbalance.', 'Balancing love with everything else.'],
      ['Three', 'Mars in Capricorn', 'Yes', 'teamwork, collaboration, craft, skill', 'Teamwork, collaboration and skilled work.', 'Lack of teamwork, disorganisation and poor work.', 'Building something together.'],
      ['Four', 'Sun in Capricorn', 'Maybe', 'security, control, stability, holding on', 'Security, control and holding on tight.', 'Greed, letting go and financial insecurity.', 'Fear of loss and guardedness.'],
      ['Five', 'Mercury in Taurus', 'No', 'hardship, loss, insecurity, isolation', 'Hardship, insecurity and feeling left out.', 'Recovery, turning a corner and renewed faith.', 'Feeling unsupported.'],
      ['Six', 'Moon in Taurus', 'Yes', 'generosity, sharing, support, charity', 'Generosity and balanced giving and receiving.', 'Strings attached, inequality and debt.', 'Balanced give and take.'],
      ['Seven', 'Saturn in Taurus', 'Maybe', 'patience, investment, growth, assessment', 'Patience, the long view and assessing progress.', 'Impatience, no reward and poor investment.', 'Waiting for growth to pay off.'],
      ['Eight', 'Sun in Virgo', 'Yes', 'diligence, mastery, craftsmanship, focus', 'Diligence, mastery and developing your skill.', 'Perfectionism, no motivation and cutting corners.', 'Working patiently on yourself.'],
      ['Nine', 'Venus in Virgo', 'Yes', 'abundance, luxury, independence, self-sufficiency', 'Abundance, independence and self-sufficiency.', 'Overwork, dependence and showiness.', 'Enjoying life, independent and whole.'],
      ['Ten', 'Mercury in Virgo', 'Yes', 'wealth, legacy, family, stability', 'Lasting wealth, legacy and family stability.', 'Financial loss, broken traditions and instability.', 'A lasting, secure partnership.'],
      ['Page', 'Earth signs (Taurus · Virgo · Capricorn)', 'Yes', 'ambition, study, opportunity, diligence', 'A diligent student ready to learn and build.', 'Laziness, procrastination and missed chances.', 'A grounded, sincere start.'],
      ['Knight', 'Earth signs (Taurus · Virgo · Capricorn)', 'Yes', 'reliability, routine, patience, commitment', 'Reliable, patient and methodical progress.', 'Boredom, stagnation and feeling stuck.', 'A dependable, if slow, courtship.'],
      ['Queen', 'Earth signs (Taurus · Virgo · Capricorn)', 'Yes', 'nurturing, practicality, comfort, security', 'Practical nurturing, comfort and security.', 'Smothering, materialism and self-neglect.', 'A caring, providing partner.'],
      ['King', 'Earth signs (Taurus · Virgo · Capricorn)', 'Yes', 'abundance, security, discipline, provider', 'Abundance, discipline and a steady provider.', 'Greed, stubbornness and materialism.', 'A secure, established partner.'],
    ],
  },
];

export const TAROT_DECK: TarotCard[] = [
  ...MAJOR.map(([name, element, astrology, yesNo, keywords, upright, reversed, love], i) => ({
    name, arcana: 'Major' as const, element, astrology, yesNo,
    keywords: keywords.split(', '), upright, reversed, love,
    img: `/tarot/ar${String(i).padStart(2, '0')}.jpg`,
  })),
  ...SUITS.flatMap(({ suit, element, rows }) =>
    rows.map(([rank, astrology, yesNo, keywords, upright, reversed, love], i) => ({
      name: `${rank} of ${suit}`,
      arcana: 'Minor' as const,
      suit, element, astrology, yesNo,
      keywords: keywords.split(', '), upright, reversed, love,
      img: `/tarot/${SUIT_CODE[suit]}${RANK_CODE[i]}.jpg`,
    }))
  ),
];

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

export const POKEMON_TYPE_COLORS: Record<string, string> = {
  Normal: '#9099a1', Fire: '#ff9d55', Water: '#4d90d5', Electric: '#f4d23c',
  Grass: '#63bc5a', Ice: '#73cec0', Fighting: '#ce4069', Poison: '#ab6ac8',
  Ground: '#d97845', Flying: '#8fa9de', Psychic: '#fa7179', Bug: '#90c12c',
  Rock: '#c5b78c', Ghost: '#5269ad', Dragon: '#0b6dc3',
  Steel: '#5a8ea1', Fairy: '#ec8fe6',
};

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

export interface PetNameCategory {
  label: string;
  group: 'By pet' | 'By vibe';
  m: string[];
  f: string[];
  u: string[];
}

export const PET_NAME_BANK: Record<string, PetNameCategory> = {
  any: {
    label: 'Any pet', group: 'By pet',
    m: ['Charlie', 'Milo', 'Toby', 'Ollie', 'Cooper', 'Buddy', 'Leo', 'Max', 'Oscar', 'Teddy', 'Louie', 'Gus', 'Archie', 'Finn', 'Jasper'],
    f: ['Bella', 'Lucy', 'Daisy', 'Luna', 'Molly', 'Ruby', 'Rosie', 'Willow', 'Nala', 'Poppy', 'Millie', 'Maggie', 'Coco', 'Winnie', 'Hazel'],
    u: ['Bailey', 'Riley', 'Sam', 'Alex', 'Casey', 'Finley', 'Quinn', 'Rowan', 'Sky', 'River', 'Sage', 'Scout', 'Ash', 'Jordan', 'Frankie', 'Remy', 'Bear', 'Pepper', 'Shadow', 'Marley', 'Sunny'],
  },
  dog: {
    label: 'Dog', group: 'By pet',
    m: ['Rex', 'Duke', 'Rocky', 'Zeus', 'Bruno', 'Cooper', 'Buddy', 'Bear', 'Diesel', 'Jack', 'Bentley', 'Ranger', 'Tucker', 'Beau', 'Copper', 'Murphy', 'Winston', 'Boomer'],
    f: ['Bella', 'Lucy', 'Daisy', 'Sadie', 'Molly', 'Maggie', 'Bailey', 'Roxy', 'Nala', 'Zoe', 'Lola', 'Penny', 'Gracie', 'Piper', 'Stella', 'Lily'],
    u: ['Cocoa', 'Biscuit', 'Pepper', 'Scout', 'Shadow', 'Bandit', 'Rusty', 'Ginger', 'Buster', 'Peanut'],
  },
  cat: {
    label: 'Cat', group: 'By pet',
    m: ['Oliver', 'Leo', 'Milo', 'Simba', 'Felix', 'Tom', 'Jasper', 'Loki', 'Oscar', 'Salem', 'Gizmo', 'Smokey', 'Tiger', 'Boots'],
    f: ['Luna', 'Chloe', 'Cleo', 'Nala', 'Willow', 'Mittens', 'Callie', 'Misty', 'Sophie', 'Bella', 'Ivy', 'Olive', 'Pearl', 'Nova'],
    u: ['Ash', 'Ghost', 'Pumpkin', 'Marble', 'Socks', 'Whiskers', 'Pepper', 'Snickers', 'Onyx', 'Cinder'],
  },
  small: {
    label: 'Rabbit / small pet', group: 'By pet',
    m: ['Thumper', 'Nibbles', 'Hopper', 'Chip', 'Peanut', 'Biscuit', 'Waffles', 'Gizmo', 'Pip', 'Chester'],
    f: ['Clover', 'Poppy', 'Daisy', 'Bunny', 'Marshmallow', 'Cinnabun', 'Honey', 'Willow', 'Pearl', 'Muffin'],
    u: ['Cocoa', 'Snowball', 'Nugget', 'Cookie', 'Pebble', 'Fluff', 'Mochi', 'Sprout', 'Button', 'Cotton'],
  },
  bird: {
    label: 'Bird', group: 'By pet',
    m: ['Rio', 'Sunny', 'Kiwi', 'Charlie', 'Buddy', 'Blu', 'Mango', 'Chico', 'Skye', 'Zazu'],
    f: ['Tweety', 'Coco', 'Lulu', 'Peaches', 'Sky', 'Iris', 'Goldie', 'Petunia', 'Dovey', 'Ruby'],
    u: ['Pip', 'Echo', 'Feather', 'Pepper', 'Sunny', 'Cinnamon', 'Robin', 'Wren', 'Sparrow', 'Phoenix'],
  },
  reptile: {
    label: 'Reptile', group: 'By pet',
    m: ['Rex', 'Spike', 'Draco', 'Godzilla', 'Kaa', 'Rango', 'Toothless', 'Basil', 'Slinky', 'Monty'],
    f: ['Medusa', 'Cleo', 'Nyx', 'Sahara', 'Jade', 'Ivy', 'Pixie', 'Willow', 'Ember', 'Lyra'],
    u: ['Noodle', 'Pebbles', 'Sunny', 'Mango', 'Onyx', 'Sage', 'Cactus', 'Slither', 'Scales', 'Gecko'],
  },
  fish: {
    label: 'Fish', group: 'By pet',
    m: ['Finn', 'Nemo', 'Bubbles', 'Jaws', 'Neptune', 'Splash', 'Captain', 'Goldie', 'Moby', 'Gill'],
    f: ['Coral', 'Pearl', 'Marina', 'Nori', 'Guppy', 'Sushi', 'Angel', 'Dory', 'Ariel', 'Wave'],
    u: ['Fin', 'Blue', 'Ripple', 'Sunny', 'Mango', 'Bubbles', 'Aqua', 'Splash', 'Kelp', 'Tide'],
  },
  cutesy: {
    label: 'Cute & sweet', group: 'By vibe', m: [], f: [],
    u: ['Biscuit', 'Peanut', 'Buttons', 'Snickers', 'Cupcake', 'Waffles', 'Marshmallow', 'Pickles', 'Pumpkin', 'Bubbles', 'Noodle', 'Muffin', 'Jellybean', 'Cuddles', 'Sprinkles', 'Boo', 'Nibbles', 'Puddles', 'Coco', 'Honey', 'Peaches', 'Dumpling'],
  },
  tough: {
    label: 'Tough & bold', group: 'By vibe', m: [], f: [],
    u: ['Diesel', 'Bruno', 'Rex', 'Titan', 'Ace', 'Blade', 'Rocky', 'Zeus', 'Bandit', 'Ranger', 'Tank', 'Duke', 'Bruiser', 'Maverick', 'Boss', 'Rebel', 'Storm', 'Jax', 'Hunter', 'Fang', 'Brutus', 'Rogue', 'Chief', 'Colt'],
  },
  foodie: {
    label: 'Foodie', group: 'By vibe', m: [], f: [],
    u: ['Mochi', 'Miso', 'Basil', 'Olive', 'Ginger', 'Nacho', 'Waffle', 'Pretzel', 'Taco', 'Sushi', 'Kiwi', 'Mango', 'Espresso', 'Cocoa', 'Biscotti', 'Ramen', 'Churro', 'Cinnamon', 'Pepper', 'Saffron', 'Truffle', 'Wasabi'],
  },
  mythic: {
    label: 'Mythic & cosmic', group: 'By vibe', m: [], f: [],
    u: ['Loki', 'Athena', 'Odin', 'Freya', 'Apollo', 'Luna', 'Thor', 'Nyx', 'Atlas', 'Hera', 'Orion', 'Selene', 'Zephyr', 'Draco', 'Phoenix', 'Nova', 'Onyx', 'Aurora', 'Cyrus', 'Isis', 'Ra', 'Juno', 'Titan', 'Echo'],
  },
};

export function petNamePool(key: string, gender: 'any' | 'boy' | 'girl'): string[] {
  const c = PET_NAME_BANK[key] ?? PET_NAME_BANK.any;
  const base = gender === 'boy' ? [...c.m, ...c.u] : gender === 'girl' ? [...c.f, ...c.u] : [...c.m, ...c.f, ...c.u];
  return [...new Set(base)]; 
}

export const PET_TRAITS = [
  'playful', 'sleepy', 'grumpy', 'fluffy', 'tiny', 'majestic', 'chaotic', 'gentle',
  'speedy', 'clumsy', 'regal', 'mischievous', 'cuddly', 'brave', 'goofy', 'curious',
];

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

export const GAMERTAG_THEMES: Record<string, { adj: string[]; noun: string[] }> = {
  action:    { adj: ['Rapid', 'Turbo', 'Savage', 'Elite', 'Hyper'], noun: ['Striker', 'Gunner', 'Breaker', 'Blitz', 'Trooper', 'Commando', 'Ranger', 'Assault', 'Recon', 'Vanguard'] },
  adventure: { adj: ['Bold', 'Wild', 'Roaming', 'Daring', 'Lost'],   noun: ['Wanderer', 'Nomad', 'Voyager', 'Pioneer', 'Trekker', 'Seeker', 'Pathfinder', 'Explorer', 'Drifter', 'Scout'] },
  fantasy:   { adj: ['Mystic', 'Arcane', 'Ancient', 'Ethereal', 'Fabled'], noun: ['Wizard', 'Warlock', 'Paladin', 'Druid', 'Sorcerer', 'Dragon', 'Griffin', 'Mage', 'Elf', 'Enchanter'] },
  historical:{ adj: ['Iron', 'Royal', 'Noble', 'Imperial', 'Ancient'], noun: ['Knight', 'Gladiator', 'Legionnaire', 'Samurai', 'Viking', 'Centurion', 'Crusader', 'Emperor', 'Sentinel', 'Warlord'] },
  horror:    { adj: ['Cursed', 'Grim', 'Rotten', 'Undead', 'Sinister'], noun: ['Reaper', 'Wraith', 'Specter', 'Ghoul', 'Demon', 'Phantom', 'Butcher', 'Nightmare', 'Revenant', 'Zombie'] },
  mythology: { adj: ['Divine', 'Titan', 'Olympian', 'Eternal', 'Celestial'], noun: ['Zeus', 'Odin', 'Hydra', 'Kraken', 'Titan', 'Valkyrie', 'Cyclops', 'Chimera', 'Fenrir', 'Cerberus'] },
  nature:    { adj: ['Arctic', 'Feral', 'Wild', 'Verdant', 'Stormy'], noun: ['Wolf', 'Falcon', 'Bear', 'Panther', 'Raven', 'Cobra', 'Timber', 'Blizzard', 'Avalanche', 'Thorn'] },
  scifi:     { adj: ['Cyber', 'Neon', 'Quantum', 'Neural', 'Void'], noun: ['Android', 'Cyborg', 'Nexus', 'Proton', 'Vector', 'Drone', 'Reactor', 'Nebula', 'Pulsar', 'Circuit'] },
  strategy:  { adj: ['Silent', 'Calculating', 'Shadow', 'Prime', 'Master'], noun: ['Tactician', 'Overlord', 'Commander', 'Strategist', 'Sentinel', 'Architect', 'Marshal', 'General', 'Warden', 'Mastermind'] },
};

export const USERNAME_ADJ = [
  'Cosmic', 'Silent', 'Golden', 'Crimson', 'Hidden', 'Electric', 'Frozen', 'Gentle',
  'Brave', 'Wild', 'Radiant', 'Velvet', 'Endless', 'Shining', 'Lonely', 'Sacred',
  'Fierce', 'Amber', 'Nimble', 'Stormy', 'Clever', 'Bold', 'Lucky', 'Mellow',
  'Swift', 'Quiet', 'Vivid', 'Neon', 'Rustic', 'Dreamy', 'Wandering', 'Emerald',
];

export const USERNAME_THEMES: Record<string, string[]> = {
  Movies: [
    'Reel', 'Cameo', 'Director', 'Villain', 'Hero', 'Sequel', 'Cinema', 'Matinee',
    'Blockbuster', 'Screenplay', 'Rogue', 'Maverick', 'Gladiator', 'Wizard', 'Rebel',
    'Bounty', 'Outlaw', 'Phantom', 'Jedi', 'Detective', 'Spectre', 'Renegade',
  ],
  Music: [
    'Melody', 'Rhythm', 'Bassline', 'Chord', 'Encore', 'Vinyl', 'Anthem', 'Harmony',
    'Tempo', 'Riff', 'Chorus', 'Groove', 'Ballad', 'Cadence', 'Octave', 'Reverb',
    'Maestro', 'Sonata', 'Beat', 'Lyric', 'Falsetto', 'Overture',
  ],
  Animals: [
    'Fox', 'Otter', 'Falcon', 'Panther', 'Lynx', 'Raven', 'Wolf', 'Heron', 'Badger',
    'Cobra', 'Stag', 'Osprey', 'Manta', 'Jaguar', 'Ibex', 'Kestrel', 'Marten',
    'Puma', 'Orca', 'Gecko', 'Owl', 'Bison',
  ],
  Space: [
    'Comet', 'Nebula', 'Quasar', 'Orbit', 'Pulsar', 'Nova', 'Galaxy', 'Meteor',
    'Cosmos', 'Rover', 'Lander', 'Photon', 'Eclipse', 'Aurora', 'Asteroid', 'Vega',
    'Rocket', 'Voyager', 'Zenith', 'Halo', 'Cluster', 'Solstice',
  ],
  Food: [
    'Waffle', 'Pepper', 'Mango', 'Noodle', 'Biscuit', 'Cocoa', 'Pretzel', 'Mocha',
    'Pesto', 'Truffle', 'Bagel', 'Churro', 'Wasabi', 'Toffee', 'Gelato', 'Sriracha',
    'Muffin', 'Ramen', 'Pickle', 'Cinnamon', 'Praline', 'Espresso',
  ],
  Nature: [
    'River', 'Canyon', 'Willow', 'Cedar', 'Boulder', 'Meadow', 'Glacier', 'Fern',
    'Summit', 'Ember', 'Thistle', 'Cavern', 'Delta', 'Grove', 'Tundra', 'Maple',
    'Ridge', 'Marsh', 'Blossom', 'Coral', 'Dune', 'Cascade',
  ],
  Sports: [
    'Striker', 'Sprinter', 'Champion', 'Rally', 'Ace', 'Dunk', 'Pitcher', 'Rookie',
    'Slugger', 'Winger', 'Keeper', 'Hurdle', 'Volley', 'Sprint', 'Marathon', 'Captain',
    'Rebound', 'Freekick', 'Grandslam', 'Podium', 'Overtime', 'Playoff',
  ],
};
