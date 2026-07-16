

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
