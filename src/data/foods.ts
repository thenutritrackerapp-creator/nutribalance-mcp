// All values per 100g unless noted
export interface FoodEntry {
  name: string;
  aliases: string[];
  calories: number;
  protein: number;   // g
  carbs: number;     // g
  fat: number;       // g
  fiber: number;     // g
  sodium: number;    // mg
  calcium: number;   // mg
  iron: number;      // mg
  vitaminC: number;  // mg
  vitaminD: number;  // IU
  magnesium: number; // mg
  potassium: number; // mg
  zinc: number;      // mg
}

export const FOODS: FoodEntry[] = [
  // ── Proteins ──────────────────────────────────────────────────────────────
  {
    name: 'Chicken Breast (cooked)',
    aliases: ['chicken breast', 'chicken', 'grilled chicken'],
    calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0,
    sodium: 74, calcium: 15, iron: 1.0, vitaminC: 0, vitaminD: 4,
    magnesium: 29, potassium: 256, zinc: 1.0,
  },
  {
    name: 'Salmon (cooked)',
    aliases: ['salmon', 'atlantic salmon', 'baked salmon'],
    calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0,
    sodium: 59, calcium: 13, iron: 0.8, vitaminC: 0, vitaminD: 570,
    magnesium: 27, potassium: 363, zinc: 0.6,
  },
  {
    name: 'Tuna (canned in water)',
    aliases: ['tuna', 'canned tuna', 'tinned tuna'],
    calories: 116, protein: 26, carbs: 0, fat: 1.0, fiber: 0,
    sodium: 320, calcium: 10, iron: 1.3, vitaminC: 0, vitaminD: 39,
    magnesium: 31, potassium: 237, zinc: 0.9,
  },
  {
    name: 'Eggs (whole)',
    aliases: ['egg', 'eggs', 'whole egg'],
    calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0,
    sodium: 124, calcium: 56, iron: 1.8, vitaminC: 0, vitaminD: 87,
    magnesium: 12, potassium: 138, zinc: 1.3,
  },
  {
    name: 'Greek Yogurt (non-fat)',
    aliases: ['greek yogurt', 'greek yoghurt', 'plain greek yogurt'],
    calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0,
    sodium: 36, calcium: 111, iron: 0.1, vitaminC: 0, vitaminD: 0,
    magnesium: 11, potassium: 141, zinc: 0.5,
  },
  {
    name: 'Beef (lean ground, cooked)',
    aliases: ['ground beef', 'beef mince', 'lean beef', 'minced beef'],
    calories: 215, protein: 26, carbs: 0, fat: 12, fiber: 0,
    sodium: 76, calcium: 18, iron: 2.6, vitaminC: 0, vitaminD: 8,
    magnesium: 21, potassium: 311, zinc: 6.3,
  },
  {
    name: 'Tofu (firm)',
    aliases: ['tofu', 'firm tofu', 'soy tofu'],
    calories: 76, protein: 8.0, carbs: 1.9, fat: 4.8, fiber: 0.3,
    sodium: 7, calcium: 350, iron: 2.7, vitaminC: 0, vitaminD: 0,
    magnesium: 30, potassium: 121, zinc: 1.0,
  },
  {
    name: 'Cottage Cheese (low-fat)',
    aliases: ['cottage cheese', 'low fat cottage cheese'],
    calories: 72, protein: 12, carbs: 3.4, fat: 1.0, fiber: 0,
    sodium: 314, calcium: 83, iron: 0.1, vitaminC: 0, vitaminD: 0,
    magnesium: 11, potassium: 104, zinc: 0.5,
  },
  {
    name: 'Turkey Breast (cooked)',
    aliases: ['turkey', 'turkey breast', 'roast turkey'],
    calories: 189, protein: 29, carbs: 0, fat: 7.4, fiber: 0,
    sodium: 69, calcium: 21, iron: 1.4, vitaminC: 0, vitaminD: 8,
    magnesium: 27, potassium: 298, zinc: 3.1,
  },
  {
    name: 'Lentils (cooked)',
    aliases: ['lentils', 'red lentils', 'green lentils', 'brown lentils'],
    calories: 116, protein: 9.0, carbs: 20, fat: 0.4, fiber: 7.9,
    sodium: 2, calcium: 19, iron: 3.3, vitaminC: 1.5, vitaminD: 0,
    magnesium: 36, potassium: 369, zinc: 1.3,
  },
  {
    name: 'Chickpeas (cooked)',
    aliases: ['chickpeas', 'garbanzo beans', 'chick peas'],
    calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6,
    sodium: 7, calcium: 49, iron: 2.9, vitaminC: 1.3, vitaminD: 0,
    magnesium: 48, potassium: 291, zinc: 1.5,
  },

  // ── Carbohydrates ──────────────────────────────────────────────────────────
  {
    name: 'White Rice (cooked)',
    aliases: ['white rice', 'rice', 'steamed rice', 'boiled rice'],
    calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4,
    sodium: 1, calcium: 10, iron: 0.2, vitaminC: 0, vitaminD: 0,
    magnesium: 12, potassium: 35, zinc: 0.5,
  },
  {
    name: 'Brown Rice (cooked)',
    aliases: ['brown rice', 'wholegrain rice'],
    calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8,
    sodium: 5, calcium: 10, iron: 0.5, vitaminC: 0, vitaminD: 0,
    magnesium: 44, potassium: 43, zinc: 0.6,
  },
  {
    name: 'Oats (dry)',
    aliases: ['oats', 'oatmeal', 'rolled oats', 'porridge oats'],
    calories: 389, protein: 17, carbs: 66, fat: 7.0, fiber: 10.6,
    sodium: 2, calcium: 54, iron: 4.7, vitaminC: 0, vitaminD: 0,
    magnesium: 177, potassium: 429, zinc: 4.0,
  },
  {
    name: 'Wholegrain Bread',
    aliases: ['wholegrain bread', 'whole wheat bread', 'brown bread', 'wholemeal bread'],
    calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 7.0,
    sodium: 400, calcium: 107, iron: 2.9, vitaminC: 0, vitaminD: 0,
    magnesium: 76, potassium: 248, zinc: 2.0,
  },
  {
    name: 'Sweet Potato (cooked)',
    aliases: ['sweet potato', 'sweet potatoes', 'baked sweet potato'],
    calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3.0,
    sodium: 55, calcium: 38, iron: 0.7, vitaminC: 19.6, vitaminD: 0,
    magnesium: 27, potassium: 475, zinc: 0.4,
  },
  {
    name: 'Banana',
    aliases: ['banana', 'bananas'],
    calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6,
    sodium: 1, calcium: 5, iron: 0.3, vitaminC: 8.7, vitaminD: 0,
    magnesium: 27, potassium: 358, zinc: 0.2,
  },
  {
    name: 'Pasta (cooked)',
    aliases: ['pasta', 'spaghetti', 'penne', 'cooked pasta'],
    calories: 131, protein: 5.0, carbs: 25, fat: 1.1, fiber: 1.8,
    sodium: 1, calcium: 7, iron: 0.5, vitaminC: 0, vitaminD: 0,
    magnesium: 18, potassium: 44, zinc: 0.5,
  },
  {
    name: 'Quinoa (cooked)',
    aliases: ['quinoa', 'cooked quinoa'],
    calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8,
    sodium: 7, calcium: 17, iron: 1.5, vitaminC: 0, vitaminD: 0,
    magnesium: 64, potassium: 172, zinc: 1.1,
  },

  // ── Fats ───────────────────────────────────────────────────────────────────
  {
    name: 'Avocado',
    aliases: ['avocado', 'avo'],
    calories: 160, protein: 2.0, carbs: 9.0, fat: 15, fiber: 6.7,
    sodium: 7, calcium: 12, iron: 0.6, vitaminC: 10, vitaminD: 0,
    magnesium: 29, potassium: 485, zinc: 0.6,
  },
  {
    name: 'Almonds',
    aliases: ['almonds', 'almond', 'raw almonds'],
    calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5,
    sodium: 1, calcium: 264, iron: 3.7, vitaminC: 0, vitaminD: 0,
    magnesium: 270, potassium: 733, zinc: 3.1,
  },
  {
    name: 'Olive Oil',
    aliases: ['olive oil', 'extra virgin olive oil', 'evoo'],
    calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0,
    sodium: 2, calcium: 1, iron: 0.6, vitaminC: 0, vitaminD: 0,
    magnesium: 0, potassium: 1, zinc: 0,
  },
  {
    name: 'Cheddar Cheese',
    aliases: ['cheddar', 'cheese', 'cheddar cheese'],
    calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0,
    sodium: 621, calcium: 710, iron: 0.7, vitaminC: 0, vitaminD: 24,
    magnesium: 28, potassium: 98, zinc: 3.1,
  },
  {
    name: 'Peanut Butter',
    aliases: ['peanut butter', 'pb', 'natural peanut butter'],
    calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6.0,
    sodium: 429, calcium: 49, iron: 1.9, vitaminC: 0, vitaminD: 0,
    magnesium: 168, potassium: 558, zinc: 2.9,
  },
  {
    name: 'Walnuts',
    aliases: ['walnuts', 'walnut'],
    calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7,
    sodium: 2, calcium: 98, iron: 2.9, vitaminC: 1.3, vitaminD: 0,
    magnesium: 158, potassium: 441, zinc: 3.1,
  },

  // ── Vegetables ────────────────────────────────────────────────────────────
  {
    name: 'Broccoli (cooked)',
    aliases: ['broccoli', 'steamed broccoli', 'boiled broccoli'],
    calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3,
    sodium: 41, calcium: 40, iron: 0.7, vitaminC: 64, vitaminD: 0,
    magnesium: 21, potassium: 293, zinc: 0.4,
  },
  {
    name: 'Spinach (raw)',
    aliases: ['spinach', 'raw spinach', 'baby spinach'],
    calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2,
    sodium: 79, calcium: 99, iron: 2.7, vitaminC: 28, vitaminD: 0,
    magnesium: 79, potassium: 558, zinc: 0.5,
  },
  {
    name: 'Kale (raw)',
    aliases: ['kale', 'raw kale', 'curly kale'],
    calories: 49, protein: 4.3, carbs: 9.0, fat: 0.9, fiber: 3.6,
    sodium: 38, calcium: 150, iron: 1.5, vitaminC: 120, vitaminD: 0,
    magnesium: 34, potassium: 491, zinc: 0.4,
  },
  {
    name: 'Carrot (raw)',
    aliases: ['carrot', 'carrots', 'raw carrot'],
    calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8,
    sodium: 69, calcium: 33, iron: 0.3, vitaminC: 5.9, vitaminD: 0,
    magnesium: 12, potassium: 320, zinc: 0.2,
  },
  {
    name: 'Bell Pepper (red)',
    aliases: ['red pepper', 'bell pepper', 'capsicum', 'red bell pepper'],
    calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1,
    sodium: 4, calcium: 7, iron: 0.4, vitaminC: 128, vitaminD: 0,
    magnesium: 12, potassium: 211, zinc: 0.3,
  },

  // ── Dairy & Alternatives ──────────────────────────────────────────────────
  {
    name: 'Whole Milk',
    aliases: ['milk', 'whole milk', 'full fat milk', 'cows milk'],
    calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0,
    sodium: 43, calcium: 113, iron: 0.1, vitaminC: 0, vitaminD: 40,
    magnesium: 10, potassium: 132, zinc: 0.4,
  },
  {
    name: 'Whey Protein Powder',
    aliases: ['whey protein', 'protein powder', 'whey'],
    calories: 352, protein: 75, carbs: 9.6, fat: 3.2, fiber: 0,
    sodium: 200, calcium: 600, iron: 1.0, vitaminC: 0, vitaminD: 0,
    magnesium: 60, potassium: 380, zinc: 3.0,
  },
];

export function searchFood(query: string): FoodEntry | null {
  const q = query.toLowerCase().trim();
  // Exact name match first
  const exact = FOODS.find((f) => f.name.toLowerCase() === q);
  if (exact) return exact;
  // Alias match
  const aliasMatch = FOODS.find((f) =>
    f.aliases.some((a) => a.toLowerCase() === q)
  );
  if (aliasMatch) return aliasMatch;
  // Partial name match
  const partial = FOODS.find(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.aliases.some((a) => a.toLowerCase().includes(q))
  );
  return partial ?? null;
}

export function getAllFoodNames(): string[] {
  return FOODS.map((f) => f.name);
}
