// Compact common-word list for the passphrase generator (Diceware-style).
// ~380 short, easy-to-type, unambiguous English words. Not the official EFF
// list, but large enough that a 5-word passphrase has ~48 bits of entropy
// (380^5 ≈ 7.9e12). All lowercase, 3–7 letters, no homophones of digits.

export const WORDS = (
  'able acid aged also arch army atom aunt away axis baby back bald ball band ' +
  'bank barn base bath bead beam bean bear beat beef bell belt bend best bike ' +
  'bird bite blue boat body bold bolt bone book boot born boss both bowl brag ' +
  'bran brew brick brim buddy bulk bump bunk burn bush busy cage cake calm camp ' +
  'cane cape card care cart case cash cast cave cell chat chef chew chin chip ' +
  'chop city clam clap claw clay clip club coal coat code coin cold colt comb ' +
  'cone cook cool cope copy cord core cork corn cost cove crab crew crib crop ' +
  'crow curl dark dart dash date dawn deal dear deck deed deep deer desk dial ' +
  'dice dine dirt dish dive dock does dome done door dose dove down drag draw ' +
  'drip drop drum dual duck dune dusk dust duty each earn ease east easy echo ' +
  'edge exit face fact fade fair fall fame farm fast fate fawn fear feed feel ' +
  'fern feud file fill film find fine fire fish fist five flag flat flaw flea ' +
  'fled flew flip flop flow foam foil fold folk font food fool foot ford fork ' +
  'form fort foul four free frog fuel full fund fuse gain gala gale game gate ' +
  'gaze gear gift give glad glow goal goat gold golf gone good gown grab gray ' +
  'grew grid grim grin grip grow gulf gull gust hack hail hair half hall halt ' +
  'hand hang hard hare hark harm hash haul have hawk haze head heal heap hear ' +
  'heat heel herd hero hide high hill hint hire hive hold hole holy home hood ' +
  'hook hoop horn hose host hour huge hull hump hung hunt hurt hush husk icon ' +
  'idea inch iron isle item jade jail jazz jest join joke jolt jump junk kale ' +
  'keel keen keep kelp kept kick kind king kiss kite knee knew knot know lace ' +
  'lack lade lake lamb lamp land lane lark lash last late lawn lazy lead leaf ' +
  'leak lean leap left lend lens levy lick lift lily limb lime line link lion ' +
  'list load loaf loan lock loft logo lone long look loom loop lord lose loss ' +
  'loud love luck lump lung lure lush lute maid mail main make male mall malt ' +
  'mane many maple mark mask mast mate math maze meal mean meat meet melt memo ' +
  'menu mere mesh mild mile milk mill mind mine mint mist moan mode mold ' +
  'mole monk mood moon more moss most moth move much mule mint nail name navy ' +
  'near neat neck need nest news next nice nine node none noon norm nose note ' +
  'noun oath obey oboe odds okay omit once open oral oval oven owed pace pack ' +
  'page paid pail pain pair pale palm pane park part pass past path pave pawn ' +
  'peak pear peat peck peel peer perk pest pick pier pike pile pill pine pink ' +
  'pint pipe plan play plea plot plow plug plum plus poem poet pole poll pond ' +
  'pony pool poor pope pork port pose posh post pour pray prep prey prim prop ' +
  'pull pump pure push quart quick quiet quilt quit race rack raft rage raid ' +
  'rail rain rake ramp rang rank rare rash rate rave read real reap rear reed ' +
  'reef reel rein rely rest rice rich ride rift ring ripe rise risk road roam ' +
  'roar robe rock rode role roll roof room root rope rose ruby rude rug ruin ' +
  'rule rung rush rust sack safe sage sail sale salt same sand sane save scan ' +
  'scar seal seam seat seed seek seem seen self sell send sent shed shin ship ' +
  'shoe shop shot show shut side sift sigh sign silk sill silo sing sink site ' +
  'size skid skin skip slab slam slap sled slid slim slip slot slow slug snap ' +
  'snow soak soap soar sock soda sofa soft soil sold sole solo song soon sort ' +
  'soul soup sour span spar spin spit spot spun spur stack stag star stay stem ' +
  'step stew stir stop stub stud swan swap swat sway swim swan tack tail take ' +
  'tale talk tall tame tank tape task taut teak teal team tear teen tell tend ' +
  'tent term test text than that thaw thee them then they thin this thud thumb ' +
  'tick tide tidy tier tile till time tint tiny tire toad toe toil told toll ' +
  'tomb tone took tool toot torn toss tour town trap tray tree trek trim trio ' +
  'trip trot true tube tuck tuna tune turn tusk twig twin type unit upon urge ' +
  'used user vain vale vane vary vase vast veal veer veil vein vent verb very ' +
  'vest veto vial vibe vice view vine visa void volt vote wade wady wage wail ' +
  'wait wake walk wall wand want ward warm warn warp wash wasp wave wavy weak ' +
  'wear weed week weep well went were west whale wharf what when whim whip whir ' +
  'whiz wick wide wife wild will wilt wind wine wing wink wipe wire wise wish ' +
  'wolf wood wool word wore work worm worn wove wrap wren yard yarn yawn year ' +
  'yell yoga yolk yore your zeal zero zest zinc zone zoom'
).split(/\s+/).filter((w) => /^[a-z]{3,7}$/.test(w));
