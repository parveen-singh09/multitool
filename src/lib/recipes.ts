

export type Diet = 'vegetarian' | 'vegan';

export interface Ingredient {

  id: string;

  name: string;

  group: string;
}

export interface Recipe {
  id: string;
  name: string;

  blurb: string;

  need: string[];
  diets: Diet[];

  minutes: number;

  steps: string[];
}

export const STAPLES = new Set([
  'salt',
  'pepper',
  'water',
  'olive-oil',
  'vegetable-oil',
  'butter',
  'sugar',
  'flour',
]);

export const INGREDIENTS: Ingredient[] = [

  { id: 'onion', name: 'Onion', group: 'Vegetables' },
  { id: 'garlic', name: 'Garlic', group: 'Vegetables' },
  { id: 'tomato', name: 'Tomato', group: 'Vegetables' },
  { id: 'potato', name: 'Potato', group: 'Vegetables' },
  { id: 'carrot', name: 'Carrot', group: 'Vegetables' },
  { id: 'bell-pepper', name: 'Bell pepper', group: 'Vegetables' },
  { id: 'spinach', name: 'Spinach', group: 'Vegetables' },
  { id: 'mushroom', name: 'Mushrooms', group: 'Vegetables' },
  { id: 'broccoli', name: 'Broccoli', group: 'Vegetables' },
  { id: 'zucchini', name: 'Zucchini', group: 'Vegetables' },
  { id: 'lettuce', name: 'Lettuce', group: 'Vegetables' },
  { id: 'cucumber', name: 'Cucumber', group: 'Vegetables' },
  { id: 'corn', name: 'Corn', group: 'Vegetables' },
  { id: 'green-onion', name: 'Green onion', group: 'Vegetables' },
  { id: 'ginger', name: 'Ginger', group: 'Vegetables' },
  { id: 'avocado', name: 'Avocado', group: 'Vegetables' },
  { id: 'sweet-potato', name: 'Sweet potato', group: 'Vegetables' },
  { id: 'cauliflower', name: 'Cauliflower', group: 'Vegetables' },
  { id: 'peas', name: 'Peas', group: 'Vegetables' },
  { id: 'cabbage', name: 'Cabbage', group: 'Vegetables' },
  { id: 'jalapeno', name: 'Jalapeño', group: 'Vegetables' },

  { id: 'chicken-breast', name: 'Chicken breast', group: 'Proteins' },
  { id: 'ground-beef', name: 'Ground beef', group: 'Proteins' },
  { id: 'egg', name: 'Eggs', group: 'Proteins' },
  { id: 'bacon', name: 'Bacon', group: 'Proteins' },
  { id: 'salmon', name: 'Salmon', group: 'Proteins' },
  { id: 'shrimp', name: 'Shrimp', group: 'Proteins' },
  { id: 'tofu', name: 'Tofu', group: 'Proteins' },
  { id: 'chickpeas', name: 'Chickpeas', group: 'Proteins' },
  { id: 'black-beans', name: 'Black beans', group: 'Proteins' },
  { id: 'ground-turkey', name: 'Ground turkey', group: 'Proteins' },
  { id: 'sausage', name: 'Sausage', group: 'Proteins' },
  { id: 'tuna', name: 'Canned tuna', group: 'Proteins' },
  { id: 'lentils', name: 'Lentils', group: 'Proteins' },

  { id: 'milk', name: 'Milk', group: 'Dairy' },
  { id: 'cheese', name: 'Cheese', group: 'Dairy' },
  { id: 'parmesan', name: 'Parmesan', group: 'Dairy' },
  { id: 'cream', name: 'Heavy cream', group: 'Dairy' },
  { id: 'yogurt', name: 'Yogurt', group: 'Dairy' },
  { id: 'sour-cream', name: 'Sour cream', group: 'Dairy' },
  { id: 'cream-cheese', name: 'Cream cheese', group: 'Dairy' },
  { id: 'mozzarella', name: 'Mozzarella', group: 'Dairy' },
  { id: 'feta', name: 'Feta', group: 'Dairy' },

  { id: 'rice', name: 'Rice', group: 'Grains' },
  { id: 'pasta', name: 'Pasta', group: 'Grains' },
  { id: 'bread', name: 'Bread', group: 'Grains' },
  { id: 'tortilla', name: 'Tortilla', group: 'Grains' },
  { id: 'oats', name: 'Oats', group: 'Grains' },
  { id: 'noodles', name: 'Noodles', group: 'Grains' },
  { id: 'quinoa', name: 'Quinoa', group: 'Grains' },
  { id: 'breadcrumbs', name: 'Breadcrumbs', group: 'Grains' },

  { id: 'soy-sauce', name: 'Soy sauce', group: 'Pantry' },
  { id: 'tomato-sauce', name: 'Tomato sauce', group: 'Pantry' },
  { id: 'tomato-paste', name: 'Tomato paste', group: 'Pantry' },
  { id: 'stock', name: 'Stock / broth', group: 'Pantry' },
  { id: 'coconut-milk', name: 'Coconut milk', group: 'Pantry' },
  { id: 'peanut-butter', name: 'Peanut butter', group: 'Pantry' },
  { id: 'honey', name: 'Honey', group: 'Pantry' },
  { id: 'vinegar', name: 'Vinegar', group: 'Pantry' },
  { id: 'curry-powder', name: 'Curry powder', group: 'Pantry' },
  { id: 'cumin', name: 'Cumin', group: 'Pantry' },
  { id: 'paprika', name: 'Paprika', group: 'Pantry' },
  { id: 'chili-flakes', name: 'Chili flakes', group: 'Pantry' },
  { id: 'basil', name: 'Basil', group: 'Pantry' },
  { id: 'cilantro', name: 'Cilantro', group: 'Pantry' },
  { id: 'oregano', name: 'Oregano', group: 'Pantry' },
  { id: 'lemon', name: 'Lemon', group: 'Pantry' },
  { id: 'lime', name: 'Lime', group: 'Pantry' },
  { id: 'salsa', name: 'Salsa', group: 'Pantry' },
  { id: 'mayo', name: 'Mayonnaise', group: 'Pantry' },
  { id: 'mustard', name: 'Mustard', group: 'Pantry' },
  { id: 'sesame-oil', name: 'Sesame oil', group: 'Pantry' },

  { id: 'salt', name: 'Salt', group: 'Staples' },
  { id: 'pepper', name: 'Black pepper', group: 'Staples' },
  { id: 'olive-oil', name: 'Olive oil', group: 'Staples' },
  { id: 'vegetable-oil', name: 'Vegetable oil', group: 'Staples' },
  { id: 'butter', name: 'Butter', group: 'Staples' },
  { id: 'sugar', name: 'Sugar', group: 'Staples' },
  { id: 'flour', name: 'Flour', group: 'Staples' },
];

export const INGREDIENT_NAME = new Map(INGREDIENTS.map((i) => [i.id, i.name]));

export const RECIPES: Recipe[] = [
  {
    id: 'garlic-butter-pasta',
    name: 'Garlic butter pasta',
    blurb: 'Weeknight staple — done in the time the pasta boils.',
    need: ['pasta', 'garlic', 'parmesan'],
    diets: ['vegetarian'],
    minutes: 15,
    steps: [
      'Boil pasta in salted water until al dente; save a splash of the water.',
      'Melt butter, sizzle sliced garlic until golden.',
      'Toss pasta in the garlic butter with a little pasta water.',
      'Finish with parmesan and black pepper.',
    ],
  },
  {
    id: 'tomato-basil-pasta',
    name: 'Tomato basil pasta',
    blurb: 'A bright 20-minute red sauce from scratch.',
    need: ['pasta', 'tomato', 'garlic', 'onion', 'basil'],
    diets: ['vegetarian', 'vegan'],
    minutes: 25,
    steps: [
      'Soften diced onion and garlic in olive oil.',
      'Add chopped tomato, simmer until saucy, season.',
      'Boil pasta al dente and toss into the sauce.',
      'Tear in fresh basil to finish.',
    ],
  },
  {
    id: 'spaghetti-bolognese',
    name: 'Spaghetti bolognese',
    blurb: 'Rich meat sauce over pasta.',
    need: ['pasta', 'ground-beef', 'tomato-sauce', 'onion', 'garlic'],
    diets: [],
    minutes: 35,
    steps: [
      'Brown the ground beef, breaking it up.',
      'Add diced onion and garlic, cook until soft.',
      'Pour in tomato sauce, simmer 20 min, season.',
      'Serve over boiled pasta.',
    ],
  },
  {
    id: 'mac-and-cheese',
    name: 'Stovetop mac & cheese',
    blurb: 'Creamy, no baking required.',
    need: ['pasta', 'cheese', 'milk'],
    diets: ['vegetarian'],
    minutes: 20,
    steps: [
      'Boil pasta and drain.',
      'Make a quick roux with butter and flour, whisk in milk.',
      'Melt in grated cheese until smooth.',
      'Fold in the pasta and season.',
    ],
  },
  {
    id: 'fried-rice',
    name: 'Egg fried rice',
    blurb: 'The best use of leftover rice.',
    need: ['rice', 'egg', 'soy-sauce', 'green-onion'],
    diets: ['vegetarian'],
    minutes: 15,
    steps: [
      'Scramble eggs in a hot oiled pan, set aside.',
      'Fry cold rice hard until it starts to crisp.',
      'Add soy sauce and the egg back in.',
      'Toss with sliced green onion.',
    ],
  },
  {
    id: 'chicken-fried-rice',
    name: 'Chicken fried rice',
    blurb: 'A full meal in one wok.',
    need: ['rice', 'chicken-breast', 'egg', 'soy-sauce', 'peas', 'carrot'],
    diets: [],
    minutes: 20,
    steps: [
      'Cook diced chicken until done, remove.',
      'Scramble egg, then fry rice with peas and carrot.',
      'Return chicken, splash in soy sauce.',
      'Finish with green onion if you have it.',
    ],
  },
  {
    id: 'chicken-stir-fry',
    name: 'Chicken & veg stir-fry',
    blurb: 'Fast, flexible, serve over rice.',
    need: ['chicken-breast', 'bell-pepper', 'broccoli', 'soy-sauce', 'garlic', 'ginger'],
    diets: [],
    minutes: 20,
    steps: [
      'Sear sliced chicken in a hot pan, remove.',
      'Stir-fry pepper and broccoli with garlic and ginger.',
      'Return chicken, add soy sauce.',
      'Serve over rice or noodles.',
    ],
  },
  {
    id: 'omelette',
    name: 'Cheese omelette',
    blurb: 'Two minutes to a proper breakfast.',
    need: ['egg', 'cheese'],
    diets: ['vegetarian'],
    minutes: 8,
    steps: [
      'Beat eggs with salt and pepper.',
      'Pour into a buttered non-stick pan on medium.',
      'When almost set, add cheese and fold.',
      'Slide out and eat.',
    ],
  },
  {
    id: 'scrambled-eggs',
    name: 'Soft scrambled eggs',
    blurb: 'Low and slow is the secret.',
    need: ['egg', 'milk'],
    diets: ['vegetarian'],
    minutes: 6,
    steps: [
      'Whisk eggs with a splash of milk.',
      'Cook in butter on low, stirring constantly.',
      'Pull off heat while still glossy.',
      'Season and serve.',
    ],
  },
  {
    id: 'frittata',
    name: 'Veggie frittata',
    blurb: 'Clean out the crisper drawer.',
    need: ['egg', 'spinach', 'onion', 'cheese'],
    diets: ['vegetarian'],
    minutes: 25,
    steps: [
      'Sauté onion and spinach until wilted.',
      'Pour in beaten eggs, scatter cheese on top.',
      'Cook on low until edges set.',
      'Finish under the broiler until puffed.',
    ],
  },
  {
    id: 'tacos',
    name: 'Beef tacos',
    blurb: 'Taco night, fifteen minutes.',
    need: ['ground-beef', 'tortilla', 'cheese', 'onion', 'cumin', 'salsa'],
    diets: [],
    minutes: 20,
    steps: [
      'Brown beef with onion, cumin, salt.',
      'Warm tortillas in a dry pan.',
      'Fill with beef, cheese and salsa.',
      'Top with anything green you have.',
    ],
  },
  {
    id: 'bean-quesadilla',
    name: 'Bean & cheese quesadilla',
    blurb: 'Crispy, cheesy, pantry-friendly.',
    need: ['tortilla', 'cheese', 'black-beans'],
    diets: ['vegetarian'],
    minutes: 12,
    steps: [
      'Mash beans lightly, season with cumin if you have it.',
      'Spread on half a tortilla, top with cheese, fold.',
      'Toast in a dry pan until golden both sides.',
      'Cut into wedges, serve with salsa.',
    ],
  },
  {
    id: 'guacamole',
    name: 'Guacamole',
    blurb: 'Five minutes, no cooking.',
    need: ['avocado', 'lime', 'onion', 'cilantro'],
    diets: ['vegetarian', 'vegan'],
    minutes: 8,
    steps: [
      'Mash ripe avocado with a fork.',
      'Stir in finely diced onion and cilantro.',
      'Squeeze in lime, season with salt.',
      'Taste and adjust.',
    ],
  },
  {
    id: 'grilled-cheese',
    name: 'Grilled cheese',
    blurb: 'The comfort-food benchmark.',
    need: ['bread', 'cheese'],
    diets: ['vegetarian'],
    minutes: 8,
    steps: [
      'Butter the outsides of two bread slices.',
      'Sandwich cheese between them.',
      'Toast in a pan on medium, pressing gently.',
      'Flip when golden; melt through.',
    ],
  },
  {
    id: 'tomato-soup',
    name: 'Tomato soup',
    blurb: 'Pairs with the grilled cheese above.',
    need: ['tomato', 'onion', 'garlic', 'stock'],
    diets: ['vegetarian', 'vegan'],
    minutes: 30,
    steps: [
      'Soften onion and garlic in oil.',
      'Add chopped tomato and stock, simmer 20 min.',
      'Blend smooth.',
      'Season; add a swirl of cream if you like.',
    ],
  },
  {
    id: 'chicken-noodle-soup',
    name: 'Chicken noodle soup',
    blurb: 'A pot of cure-all.',
    need: ['chicken-breast', 'noodles', 'carrot', 'onion', 'stock'],
    diets: [],
    minutes: 35,
    steps: [
      'Simmer chicken in stock with onion and carrot until cooked.',
      'Shred the chicken, return to pot.',
      'Add noodles, cook until tender.',
      'Season and serve hot.',
    ],
  },
  {
    id: 'lentil-soup',
    name: 'Lentil soup',
    blurb: 'Cheap, filling, freezes well.',
    need: ['lentils', 'onion', 'carrot', 'garlic', 'cumin', 'stock'],
    diets: ['vegetarian', 'vegan'],
    minutes: 40,
    steps: [
      'Sauté onion, carrot and garlic.',
      'Add lentils, cumin and stock.',
      'Simmer until lentils are soft, ~30 min.',
      'Season; blend half for body if you like.',
    ],
  },
  {
    id: 'chickpea-curry',
    name: 'Chickpea curry',
    blurb: 'Coconut-y and quick.',
    need: ['chickpeas', 'coconut-milk', 'onion', 'garlic', 'ginger', 'curry-powder', 'tomato'],
    diets: ['vegetarian', 'vegan'],
    minutes: 30,
    steps: [
      'Fry onion, garlic, ginger with curry powder.',
      'Add chopped tomato, cook down.',
      'Stir in chickpeas and coconut milk, simmer 15 min.',
      'Serve over rice.',
    ],
  },
  {
    id: 'thai-curry',
    name: 'Coconut veg curry',
    blurb: 'Whatever veg you have, in a creamy sauce.',
    need: ['coconut-milk', 'bell-pepper', 'broccoli', 'curry-powder', 'garlic', 'ginger'],
    diets: ['vegetarian', 'vegan'],
    minutes: 25,
    steps: [
      'Fry garlic, ginger and curry powder in oil.',
      'Add chopped veg, toss to coat.',
      'Pour in coconut milk, simmer until tender.',
      'Serve over rice or noodles.',
    ],
  },
  {
    id: 'stir-fry-noodles',
    name: 'Garlic soy noodles',
    blurb: 'Pantry noodles, elevated.',
    need: ['noodles', 'soy-sauce', 'garlic', 'green-onion', 'sesame-oil'],
    diets: ['vegetarian', 'vegan'],
    minutes: 15,
    steps: [
      'Cook noodles, drain.',
      'Sizzle garlic in sesame oil.',
      'Toss noodles with soy sauce and garlic oil.',
      'Top with green onion.',
    ],
  },
  {
    id: 'pad-thai-ish',
    name: 'Peanut noodles',
    blurb: 'Creamy peanut sauce, no wok skills needed.',
    need: ['noodles', 'peanut-butter', 'soy-sauce', 'lime', 'garlic'],
    diets: ['vegetarian', 'vegan'],
    minutes: 18,
    steps: [
      'Whisk peanut butter, soy sauce, lime and a little water.',
      'Cook noodles, drain.',
      'Toss noodles in the sauce.',
      'Add crushed peanuts or green onion if you have them.',
    ],
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    blurb: 'Eggs poached in spiced tomato.',
    need: ['egg', 'tomato', 'onion', 'bell-pepper', 'garlic', 'paprika'],
    diets: ['vegetarian'],
    minutes: 25,
    steps: [
      'Soften onion, pepper and garlic with paprika.',
      'Add tomato, simmer into a thick sauce.',
      'Make wells and crack in eggs.',
      'Cover and cook until whites set.',
    ],
  },
  {
    id: 'caprese',
    name: 'Caprese salad',
    blurb: 'Three ingredients, zero cooking.',
    need: ['tomato', 'mozzarella', 'basil'],
    diets: ['vegetarian'],
    minutes: 5,
    steps: [
      'Slice tomato and mozzarella.',
      'Layer with basil leaves.',
      'Drizzle olive oil, season.',
      'Add a splash of vinegar if you have it.',
    ],
  },
  {
    id: 'greek-salad',
    name: 'Greek salad',
    blurb: 'Crunchy, briny, no lettuce needed.',
    need: ['cucumber', 'tomato', 'feta', 'onion'],
    diets: ['vegetarian'],
    minutes: 10,
    steps: [
      'Chop cucumber, tomato and onion.',
      'Crumble in feta.',
      'Dress with olive oil, vinegar, oregano.',
      'Toss and serve.',
    ],
  },
  {
    id: 'baked-salmon',
    name: 'Lemon baked salmon',
    blurb: 'Hands-off oven dinner.',
    need: ['salmon', 'lemon', 'garlic'],
    diets: [],
    minutes: 20,
    steps: [
      'Set salmon on foil, rub with olive oil, garlic, salt.',
      'Top with lemon slices.',
      'Bake at 200°C / 400°F for 12–15 min.',
      'Rest a minute, serve.',
    ],
  },
  {
    id: 'garlic-shrimp',
    name: 'Garlic butter shrimp',
    blurb: 'Restaurant plate in ten minutes.',
    need: ['shrimp', 'garlic', 'lemon'],
    diets: [],
    minutes: 12,
    steps: [
      'Melt butter, cook lots of garlic gently.',
      'Add shrimp, cook until pink, ~3 min.',
      'Squeeze in lemon, season.',
      'Serve over rice or with bread.',
    ],
  },
  {
    id: 'tuna-melt',
    name: 'Tuna melt',
    blurb: 'Pantry lunch hero.',
    need: ['tuna', 'bread', 'cheese', 'mayo'],
    diets: [],
    minutes: 12,
    steps: [
      'Mix tuna with mayo, season.',
      'Pile on bread, top with cheese.',
      'Toast open-faced until cheese melts.',
      'Close it up and eat.',
    ],
  },
  {
    id: 'tuna-pasta',
    name: 'Tuna pasta',
    blurb: 'Ten-minute pantry dinner.',
    need: ['tuna', 'pasta', 'tomato-sauce', 'garlic'],
    diets: [],
    minutes: 18,
    steps: [
      'Boil pasta.',
      'Warm tomato sauce with garlic.',
      'Flake in tuna.',
      'Toss with drained pasta.',
    ],
  },
  {
    id: 'baked-potato',
    name: 'Loaded baked potato',
    blurb: 'A meal built on one potato.',
    need: ['potato', 'cheese', 'sour-cream', 'bacon'],
    diets: [],
    minutes: 55,
    steps: [
      'Bake pricked potato at 200°C / 400°F ~50 min.',
      'Fry bacon until crisp, chop.',
      'Split potato, load with cheese, sour cream, bacon.',
      'Add green onion if you have it.',
    ],
  },
  {
    id: 'mashed-potatoes',
    name: 'Mashed potatoes',
    blurb: 'The side that carries the plate.',
    need: ['potato', 'milk'],
    diets: ['vegetarian'],
    minutes: 30,
    steps: [
      'Boil peeled potato chunks until fork-tender.',
      'Drain well.',
      'Mash with butter and warm milk.',
      'Season generously.',
    ],
  },
  {
    id: 'roast-veg',
    name: 'Sheet-pan roast veg',
    blurb: 'Set it and forget it.',
    need: ['potato', 'carrot', 'bell-pepper', 'onion'],
    diets: ['vegetarian', 'vegan'],
    minutes: 40,
    steps: [
      'Chop veg into even chunks.',
      'Toss with olive oil, salt, pepper.',
      'Roast at 200°C / 400°F ~30 min, turning once.',
      'Finish with herbs if you have them.',
    ],
  },
  {
    id: 'stuffed-peppers',
    name: 'Stuffed peppers',
    blurb: 'Rice-and-meat filled and baked.',
    need: ['bell-pepper', 'rice', 'ground-beef', 'tomato-sauce', 'onion', 'cheese'],
    diets: [],
    minutes: 50,
    steps: [
      'Brown beef with onion; mix with cooked rice and sauce.',
      'Halve peppers, remove seeds, fill.',
      'Top with cheese.',
      'Bake at 190°C / 375°F ~30 min.',
    ],
  },
  {
    id: 'fried-egg-rice-bowl',
    name: 'Soy egg rice bowl',
    blurb: 'The two-minute lazy dinner.',
    need: ['rice', 'egg', 'soy-sauce'],
    diets: ['vegetarian'],
    minutes: 8,
    steps: [
      'Warm rice in a bowl.',
      'Fry an egg with crispy edges.',
      'Slide egg over rice.',
      'Drizzle soy sauce and sesame oil.',
    ],
  },
  {
    id: 'pancakes',
    name: 'Fluffy pancakes',
    blurb: 'Weekend breakfast from scratch.',
    need: ['flour', 'egg', 'milk'],
    diets: ['vegetarian'],
    minutes: 20,
    steps: [
      'Whisk flour, sugar, a pinch of salt.',
      'Beat in egg and milk to a smooth batter.',
      'Cook ladlefuls in a buttered pan; flip when bubbly.',
      'Stack and serve with honey.',
    ],
  },
  {
    id: 'oatmeal',
    name: 'Creamy oatmeal',
    blurb: 'Five-minute cozy breakfast.',
    need: ['oats', 'milk'],
    diets: ['vegetarian'],
    minutes: 8,
    steps: [
      'Simmer oats in milk, stirring.',
      'Cook until thick and creamy.',
      'Sweeten with honey or sugar.',
      'Top with anything you like.',
    ],
  },
  {
    id: 'french-toast',
    name: 'French toast',
    blurb: 'Rescue slightly stale bread.',
    need: ['bread', 'egg', 'milk'],
    diets: ['vegetarian'],
    minutes: 12,
    steps: [
      'Whisk egg, milk and a little sugar.',
      'Soak bread slices briefly.',
      'Fry in butter until golden both sides.',
      'Drizzle with honey.',
    ],
  },
  {
    id: 'quesadilla-chicken',
    name: 'Chicken quesadilla',
    blurb: 'Crispy, melty, fast.',
    need: ['tortilla', 'chicken-breast', 'cheese', 'bell-pepper', 'onion'],
    diets: [],
    minutes: 20,
    steps: [
      'Cook diced chicken with pepper and onion.',
      'Layer on a tortilla with cheese, fold.',
      'Toast in a dry pan until golden.',
      'Slice and serve with salsa.',
    ],
  },
  {
    id: 'burger',
    name: 'Homemade burgers',
    blurb: 'Better than the drive-through.',
    need: ['ground-beef', 'bread', 'cheese', 'onion', 'lettuce', 'tomato'],
    diets: [],
    minutes: 20,
    steps: [
      'Form seasoned beef into patties.',
      'Sear hard in a hot pan, 3–4 min a side.',
      'Melt cheese on top the last minute.',
      'Build on toasted buns with the fixings.',
    ],
  },
  {
    id: 'chili',
    name: 'Beef chili',
    blurb: 'A big pot that gets better next day.',
    need: ['ground-beef', 'black-beans', 'tomato-sauce', 'onion', 'garlic', 'cumin', 'paprika'],
    diets: [],
    minutes: 45,
    steps: [
      'Brown beef with onion and garlic.',
      'Add spices, tomato sauce and beans.',
      'Simmer 30 min, stirring now and then.',
      'Season; top with cheese or sour cream.',
    ],
  },
  {
    id: 'tofu-stir-fry',
    name: 'Crispy tofu stir-fry',
    blurb: 'Meaty texture, plant-based.',
    need: ['tofu', 'soy-sauce', 'broccoli', 'garlic', 'ginger', 'rice'],
    diets: ['vegetarian', 'vegan'],
    minutes: 25,
    steps: [
      'Pan-fry cubed tofu until golden all over.',
      'Add broccoli, garlic, ginger.',
      'Splash in soy sauce.',
      'Serve over rice.',
    ],
  },
  {
    id: 'risotto-mushroom',
    name: 'Mushroom risotto',
    blurb: 'Creamy without any cream.',
    need: ['rice', 'mushroom', 'onion', 'garlic', 'parmesan', 'stock'],
    diets: ['vegetarian'],
    minutes: 35,
    steps: [
      'Sauté mushrooms, set aside.',
      'Soften onion and garlic, toast rice.',
      'Add warm stock a ladle at a time, stirring, until creamy.',
      'Fold in mushrooms and parmesan.',
    ],
  },
  {
    id: 'carbonara',
    name: 'Spaghetti carbonara',
    blurb: 'Silky egg-and-cheese sauce, no cream.',
    need: ['pasta', 'egg', 'bacon', 'parmesan'],
    diets: [],
    minutes: 20,
    steps: [
      'Crisp chopped bacon.',
      'Whisk eggs with grated parmesan and pepper.',
      'Toss hot drained pasta with bacon off the heat.',
      'Stir in egg mix with pasta water until glossy.',
    ],
  },
  {
    id: 'veggie-wrap',
    name: 'Hummus-less veggie wrap',
    blurb: 'Fresh, no-cook lunch.',
    need: ['tortilla', 'lettuce', 'tomato', 'cucumber', 'feta'],
    diets: ['vegetarian'],
    minutes: 8,
    steps: [
      'Lay fillings down the center of a tortilla.',
      'Crumble feta over.',
      'Drizzle olive oil, season.',
      'Roll up tight and slice.',
    ],
  },
  {
    id: 'potato-hash',
    name: 'Breakfast potato hash',
    blurb: 'Crispy potatoes and eggs in one pan.',
    need: ['potato', 'onion', 'bell-pepper', 'egg'],
    diets: ['vegetarian'],
    minutes: 25,
    steps: [
      'Fry diced potato until crisp.',
      'Add onion and pepper, cook down.',
      'Make wells and crack in eggs.',
      'Cover until eggs set.',
    ],
  },
  {
    id: 'creamy-tomato-pasta',
    name: 'Creamy tomato pasta',
    blurb: 'Rosé sauce that tastes like more effort.',
    need: ['pasta', 'tomato-sauce', 'cream', 'garlic', 'parmesan'],
    diets: ['vegetarian'],
    minutes: 20,
    steps: [
      'Warm tomato sauce with garlic.',
      'Stir in cream until pink and smooth.',
      'Toss with boiled pasta.',
      'Finish with parmesan.',
    ],
  },
  {
    id: 'sausage-peppers',
    name: 'Sausage & peppers',
    blurb: 'One skillet, big flavor.',
    need: ['sausage', 'bell-pepper', 'onion', 'garlic'],
    diets: [],
    minutes: 25,
    steps: [
      'Brown sausage, set aside.',
      'Soften peppers, onion and garlic.',
      'Slice sausage, return to pan.',
      'Serve as-is or in bread.',
    ],
  },
  {
    id: 'turkey-rice-skillet',
    name: 'Turkey rice skillet',
    blurb: 'One-pan, everything included.',
    need: ['ground-turkey', 'rice', 'tomato-sauce', 'onion', 'bell-pepper'],
    diets: [],
    minutes: 30,
    steps: [
      'Brown turkey with onion and pepper.',
      'Stir in rice and tomato sauce.',
      'Add water, cover, simmer until rice is done.',
      'Season and fluff.',
    ],
  },
  {
    id: 'cauliflower-roast',
    name: 'Spiced roast cauliflower',
    blurb: 'Even skeptics finish the tray.',
    need: ['cauliflower', 'cumin', 'paprika', 'garlic'],
    diets: ['vegetarian', 'vegan'],
    minutes: 35,
    steps: [
      'Toss florets with oil, cumin, paprika, garlic, salt.',
      'Spread on a tray in one layer.',
      'Roast at 220°C / 425°F ~25 min until charred.',
      'Squeeze lemon over if you have it.',
    ],
  },
  {
    id: 'sweet-potato-black-bean-bowl',
    name: 'Sweet potato & black bean bowl',
    blurb: 'Hearty, plant-based, meal-preppable.',
    need: ['sweet-potato', 'black-beans', 'rice', 'cumin', 'lime', 'avocado'],
    diets: ['vegetarian', 'vegan'],
    minutes: 35,
    steps: [
      'Roast cubed sweet potato with cumin.',
      'Warm black beans, season.',
      'Build bowls over rice.',
      'Top with avocado and a squeeze of lime.',
    ],
  },
  {
    id: 'egg-drop-soup',
    name: 'Egg drop soup',
    blurb: 'Silky soup from almost nothing.',
    need: ['egg', 'stock', 'green-onion', 'soy-sauce'],
    diets: [],
    minutes: 12,
    steps: [
      'Bring stock to a gentle boil, add soy sauce.',
      'Stir the broth into a swirl.',
      'Slowly pour in beaten egg to make ribbons.',
      'Top with green onion.',
    ],
  },
];

export interface Match {
  recipe: Recipe;

  have: string[];

  missing: string[];
}

export function matchRecipes(
  owned: Set<string>,
  useStaples: boolean,
  diet: Diet | null,
  maxMissing: number,
): Match[] {
  const results: Match[] = [];
  for (const recipe of RECIPES) {
    if (diet && !recipe.diets.includes(diet)) continue;

    const have: string[] = [];
    const missing: string[] = [];
    for (const id of recipe.need) {
      if (owned.has(id) || (useStaples && STAPLES.has(id))) have.push(id);
      else missing.push(id);
    }

    if (have.length === 0) continue;
    if (missing.length > maxMissing) continue;
    results.push({ recipe, have, missing });
  }

  results.sort(
    (a, b) =>
      a.missing.length - b.missing.length ||
      b.have.length - a.have.length ||
      a.recipe.minutes - b.recipe.minutes,
  );
  return results;
}
