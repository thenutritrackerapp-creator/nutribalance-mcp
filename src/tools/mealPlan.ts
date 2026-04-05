import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { round } from '../utils/validators.js';
import { CTA } from '../utils/marketing.js';

interface Meal {
  name: string;
  foods: Array<{ item: string; amount: string; kcal: number; protein: number; carbs: number; fat: number }>;
}

type Goal = 'lose' | 'maintain' | 'gain';
type Diet = 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'high_protein';

const MEAL_TEMPLATES: Record<Diet, Record<Goal, Meal[]>> = {
  standard: {
    lose: [
      {
        name: 'Breakfast',
        foods: [
          { item: 'Oats (dry)', amount: '50g', kcal: 194, protein: 8.5, carbs: 33, fat: 3.5 },
          { item: 'Greek yogurt (non-fat)', amount: '150g', kcal: 89, protein: 15, carbs: 5.4, fat: 0.6 },
          { item: 'Berries (mixed)', amount: '80g', kcal: 45, protein: 0.8, carbs: 10, fat: 0.3 },
        ],
      },
      {
        name: 'Lunch',
        foods: [
          { item: 'Chicken breast (cooked)', amount: '150g', kcal: 248, protein: 46.5, carbs: 0, fat: 5.4 },
          { item: 'Brown rice (cooked)', amount: '150g', kcal: 168, protein: 3.9, carbs: 36, fat: 1.4 },
          { item: 'Broccoli (cooked)', amount: '120g', kcal: 42, protein: 2.9, carbs: 8.6, fat: 0.5 },
        ],
      },
      {
        name: 'Snack',
        foods: [
          { item: 'Cottage cheese (low-fat)', amount: '150g', kcal: 108, protein: 18, carbs: 5.1, fat: 1.5 },
          { item: 'Apple', amount: '150g', kcal: 78, protein: 0.4, carbs: 21, fat: 0.2 },
        ],
      },
      {
        name: 'Dinner',
        foods: [
          { item: 'Salmon (cooked)', amount: '150g', kcal: 312, protein: 30, carbs: 0, fat: 19.5 },
          { item: 'Sweet potato (baked)', amount: '150g', kcal: 129, protein: 2.4, carbs: 30, fat: 0.15 },
          { item: 'Spinach (raw)', amount: '80g', kcal: 18, protein: 2.3, carbs: 2.9, fat: 0.3 },
        ],
      },
    ],
    maintain: [
      {
        name: 'Breakfast',
        foods: [
          { item: 'Eggs (whole)', amount: '3 large (~150g)', kcal: 233, protein: 19.5, carbs: 1.7, fat: 16.5 },
          { item: 'Wholegrain toast', amount: '60g (2 slices)', kcal: 148, protein: 7.8, carbs: 24.6, fat: 2.5 },
          { item: 'Avocado', amount: '75g', kcal: 120, protein: 1.5, carbs: 6.8, fat: 11.3 },
        ],
      },
      {
        name: 'Lunch',
        foods: [
          { item: 'Turkey breast (cooked)', amount: '120g', kcal: 227, protein: 34.8, carbs: 0, fat: 8.9 },
          { item: 'Quinoa (cooked)', amount: '180g', kcal: 216, protein: 7.9, carbs: 37.8, fat: 3.4 },
          { item: 'Bell pepper + cucumber salad', amount: '150g', kcal: 35, protein: 1.3, carbs: 7.5, fat: 0.3 },
        ],
      },
      {
        name: 'Snack',
        foods: [
          { item: 'Almonds', amount: '30g', kcal: 174, protein: 6.3, carbs: 6.6, fat: 15 },
          { item: 'Banana', amount: '120g', kcal: 107, protein: 1.3, carbs: 27.6, fat: 0.4 },
        ],
      },
      {
        name: 'Dinner',
        foods: [
          { item: 'Lean beef mince (cooked)', amount: '150g', kcal: 323, protein: 39, carbs: 0, fat: 18 },
          { item: 'Pasta (cooked)', amount: '200g', kcal: 262, protein: 10, carbs: 50, fat: 2.2 },
          { item: 'Tomato sauce (low sugar)', amount: '100g', kcal: 45, protein: 1.8, carbs: 9, fat: 0.5 },
        ],
      },
    ],
    gain: [
      {
        name: 'Breakfast',
        foods: [
          { item: 'Oats (dry)', amount: '80g', kcal: 311, protein: 13.6, carbs: 52.8, fat: 5.6 },
          { item: 'Whole milk', amount: '300ml', kcal: 183, protein: 9.6, carbs: 14.4, fat: 9.9 },
          { item: 'Banana', amount: '120g', kcal: 107, protein: 1.3, carbs: 27.6, fat: 0.4 },
          { item: 'Peanut butter', amount: '32g', kcal: 188, protein: 8, carbs: 6.4, fat: 16 },
        ],
      },
      {
        name: 'Lunch',
        foods: [
          { item: 'Chicken breast (cooked)', amount: '200g', kcal: 330, protein: 62, carbs: 0, fat: 7.2 },
          { item: 'White rice (cooked)', amount: '250g', kcal: 325, protein: 6.8, carbs: 70, fat: 0.8 },
          { item: 'Olive oil (drizzle)', amount: '10g', kcal: 88, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: 'Snack',
        foods: [
          { item: 'Whey protein shake', amount: '30g powder + 300ml milk', kcal: 288, protein: 31.6, carbs: 18.9, fat: 8.8 },
          { item: 'Almonds', amount: '30g', kcal: 174, protein: 6.3, carbs: 6.6, fat: 15 },
        ],
      },
      {
        name: 'Dinner',
        foods: [
          { item: 'Salmon (cooked)', amount: '200g', kcal: 416, protein: 40, carbs: 0, fat: 26 },
          { item: 'Sweet potato (baked)', amount: '200g', kcal: 172, protein: 3.2, carbs: 40, fat: 0.2 },
          { item: 'Broccoli', amount: '150g', kcal: 53, protein: 3.6, carbs: 10.8, fat: 0.6 },
          { item: 'Cheddar cheese', amount: '30g', kcal: 121, protein: 7.5, carbs: 0.4, fat: 9.9 },
        ],
      },
    ],
  },

  vegetarian: {
    lose: [
      {
        name: 'Breakfast',
        foods: [
          { item: 'Greek yogurt (non-fat)', amount: '200g', kcal: 118, protein: 20, carbs: 7.2, fat: 0.8 },
          { item: 'Oats (dry)', amount: '40g', kcal: 156, protein: 6.8, carbs: 26.4, fat: 2.8 },
          { item: 'Mixed berries', amount: '80g', kcal: 45, protein: 0.8, carbs: 10, fat: 0.3 },
        ],
      },
      {
        name: 'Lunch',
        foods: [
          { item: 'Eggs (whole)', amount: '3 large', kcal: 233, protein: 19.5, carbs: 1.7, fat: 16.5 },
          { item: 'Spinach + kale salad', amount: '100g', kcal: 36, protein: 3.6, carbs: 6.3, fat: 0.7 },
          { item: 'Quinoa (cooked)', amount: '150g', kcal: 180, protein: 6.6, carbs: 31.5, fat: 2.9 },
        ],
      },
      {
        name: 'Snack',
        foods: [
          { item: 'Cottage cheese', amount: '150g', kcal: 108, protein: 18, carbs: 5.1, fat: 1.5 },
          { item: 'Apple', amount: '150g', kcal: 78, protein: 0.4, carbs: 21, fat: 0.2 },
        ],
      },
      {
        name: 'Dinner',
        foods: [
          { item: 'Lentils (cooked)', amount: '200g', kcal: 232, protein: 18, carbs: 40, fat: 0.8 },
          { item: 'Brown rice (cooked)', amount: '100g', kcal: 112, protein: 2.6, carbs: 24, fat: 0.9 },
          { item: 'Broccoli (cooked)', amount: '150g', kcal: 53, protein: 3.6, carbs: 10.8, fat: 0.6 },
        ],
      },
    ],
    maintain: [],
    gain: [],
  },

  vegan: {
    lose: [
      {
        name: 'Breakfast',
        foods: [
          { item: 'Oats (dry)', amount: '60g', kcal: 233, protein: 10.2, carbs: 39.6, fat: 4.2 },
          { item: 'Soy milk', amount: '300ml', kcal: 105, protein: 9, carbs: 9, fat: 3.6 },
          { item: 'Chia seeds', amount: '20g', kcal: 97, protein: 3.3, carbs: 8.3, fat: 6.2 },
        ],
      },
      {
        name: 'Lunch',
        foods: [
          { item: 'Tofu (firm, pan-fried)', amount: '200g', kcal: 152, protein: 16, carbs: 3.8, fat: 9.6 },
          { item: 'Brown rice (cooked)', amount: '150g', kcal: 168, protein: 3.9, carbs: 36, fat: 1.4 },
          { item: 'Kale + carrot', amount: '150g', kcal: 55, protein: 3.6, carbs: 12, fat: 0.7 },
        ],
      },
      {
        name: 'Snack',
        foods: [
          { item: 'Almonds', amount: '30g', kcal: 174, protein: 6.3, carbs: 6.6, fat: 15 },
          { item: 'Banana', amount: '120g', kcal: 107, protein: 1.3, carbs: 27.6, fat: 0.4 },
        ],
      },
      {
        name: 'Dinner',
        foods: [
          { item: 'Chickpeas (cooked)', amount: '200g', kcal: 328, protein: 17.8, carbs: 54, fat: 5.2 },
          { item: 'Sweet potato (baked)', amount: '150g', kcal: 129, protein: 2.4, carbs: 30, fat: 0.15 },
          { item: 'Spinach (raw)', amount: '80g', kcal: 18, protein: 2.3, carbs: 2.9, fat: 0.3 },
        ],
      },
    ],
    maintain: [],
    gain: [],
  },

  keto: {
    lose: [
      {
        name: 'Breakfast',
        foods: [
          { item: 'Eggs (whole)', amount: '3 large', kcal: 233, protein: 19.5, carbs: 1.7, fat: 16.5 },
          { item: 'Cheddar cheese', amount: '40g', kcal: 161, protein: 10, carbs: 0.5, fat: 13.2 },
          { item: 'Avocado', amount: '100g', kcal: 160, protein: 2, carbs: 9, fat: 15 },
        ],
      },
      {
        name: 'Lunch',
        foods: [
          { item: 'Salmon (cooked)', amount: '150g', kcal: 312, protein: 30, carbs: 0, fat: 19.5 },
          { item: 'Spinach + olive oil salad', amount: '100g + 10ml', kcal: 111, protein: 2.9, carbs: 3.6, fat: 10.4 },
        ],
      },
      {
        name: 'Snack',
        foods: [
          { item: 'Almonds', amount: '30g', kcal: 174, protein: 6.3, carbs: 6.6, fat: 15 },
          { item: 'Peanut butter (no sugar)', amount: '32g', kcal: 188, protein: 8, carbs: 6.4, fat: 16 },
        ],
      },
      {
        name: 'Dinner',
        foods: [
          { item: 'Chicken thighs (cooked)', amount: '200g', kcal: 420, protein: 36, carbs: 0, fat: 30 },
          { item: 'Broccoli (cooked)', amount: '200g', kcal: 70, protein: 4.8, carbs: 14.4, fat: 0.8 },
          { item: 'Olive oil', amount: '15g', kcal: 133, protein: 0, carbs: 0, fat: 15 },
        ],
      },
    ],
    maintain: [],
    gain: [],
  },

  high_protein: {
    lose: [
      {
        name: 'Breakfast',
        foods: [
          { item: 'Eggs (whole)', amount: '4 large', kcal: 310, protein: 26, carbs: 2.3, fat: 22 },
          { item: 'Greek yogurt (non-fat)', amount: '200g', kcal: 118, protein: 20, carbs: 7.2, fat: 0.8 },
          { item: 'Oats (dry)', amount: '40g', kcal: 156, protein: 6.8, carbs: 26.4, fat: 2.8 },
        ],
      },
      {
        name: 'Lunch',
        foods: [
          { item: 'Chicken breast (cooked)', amount: '200g', kcal: 330, protein: 62, carbs: 0, fat: 7.2 },
          { item: 'Cottage cheese', amount: '100g', kcal: 72, protein: 12, carbs: 3.4, fat: 1 },
          { item: 'Sweet potato', amount: '100g', kcal: 86, protein: 1.6, carbs: 20, fat: 0.1 },
        ],
      },
      {
        name: 'Snack',
        foods: [
          { item: 'Whey protein shake (water)', amount: '30g powder', kcal: 121, protein: 22.5, carbs: 2.9, fat: 1 },
          { item: 'Apple', amount: '150g', kcal: 78, protein: 0.4, carbs: 21, fat: 0.2 },
        ],
      },
      {
        name: 'Dinner',
        foods: [
          { item: 'Tuna (canned, drained)', amount: '180g', kcal: 209, protein: 46.8, carbs: 0, fat: 1.8 },
          { item: 'Quinoa (cooked)', amount: '150g', kcal: 180, protein: 6.6, carbs: 31.5, fat: 2.9 },
          { item: 'Broccoli + spinach', amount: '200g', kcal: 53, protein: 5.3, carbs: 10.8, fat: 0.7 },
        ],
      },
    ],
    maintain: [],
    gain: [],
  },
};

function getFallbackPlan(goal: Goal, diet: Diet): Meal[] {
  const plan = MEAL_TEMPLATES[diet]?.[goal];
  if (plan && plan.length > 0) return plan;
  // fallback to standard
  return MEAL_TEMPLATES.standard[goal];
}

export function registerMealPlanTool(server: McpServer): void {
  server.tool(
    'generate_meal_plan',
    "Generate a full day meal plan (breakfast, lunch, snack, dinner) tailored to the user's calorie goal, dietary preference, and fitness goal. Use this when someone asks for a meal plan, what to eat for a goal, or how to structure their diet.",
    {
      target_calories: z.number().min(1200).max(5000).describe('Target daily calories'),
      goal: z.enum(['lose', 'maintain', 'gain']).describe('Fitness goal: lose | maintain | gain'),
      dietary_preference: z
        .enum(['standard', 'vegetarian', 'vegan', 'keto', 'high_protein'])
        .optional()
        .default('standard')
        .describe('Dietary style: standard | vegetarian | vegan | keto | high_protein'),
    },
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async ({ target_calories, goal, dietary_preference }) => {
      const diet = dietary_preference ?? 'standard';
      const meals = getFallbackPlan(goal, diet);

      const goalLabel = { lose: 'Fat Loss', maintain: 'Maintenance', gain: 'Muscle Gain' }[goal];
      const dietLabel: Record<string, string> = {
        standard: 'Standard',
        vegetarian: 'Vegetarian',
        vegan: 'Vegan',
        keto: 'Ketogenic',
        high_protein: 'High Protein',
      };

      let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

      const mealSections = meals.map((meal) => {
        const mealKcal = meal.foods.reduce((s, f) => s + f.kcal, 0);
        const mealPro = meal.foods.reduce((s, f) => s + f.protein, 0);
        const mealCarb = meal.foods.reduce((s, f) => s + f.carbs, 0);
        const mealFat = meal.foods.reduce((s, f) => s + f.fat, 0);
        totalKcal += mealKcal;
        totalProtein += mealPro;
        totalCarbs += mealCarb;
        totalFat += mealFat;

        const foodRows = meal.foods
          .map((f) => `| ${f.item} | ${f.amount} | ${f.kcal} kcal | ${f.protein}g | ${f.carbs}g | ${f.fat}g |`)
          .join('\n');

        return `### ${meal.name} (~${round(mealKcal)} kcal)
| Food | Amount | Calories | Protein | Carbs | Fat |
|------|--------|----------|---------|-------|-----|
${foodRows}`;
      }).join('\n\n');

      const text = `## Daily Meal Plan — ${goalLabel} | ${dietLabel[diet]} | ~${target_calories} kcal target

---

${mealSections}

---

## Daily Totals
| | Calories | Protein | Carbs | Fat |
|-|----------|---------|-------|-----|
| **This plan** | **${round(totalKcal)} kcal** | **${round(totalProtein)}g** | **${round(totalCarbs)}g** | **${round(totalFat)}g** |
| Your target | ${target_calories} kcal | — | — | — |
| Difference | ${round(totalKcal - target_calories) > 0 ? '+' : ''}${round(totalKcal - target_calories)} kcal | — | — | — |

---

**Practical Notes**
- Prep proteins in bulk (chicken, beef, eggs) to make adherence easy throughout the week.
- Swap any food 1:1 by macros — e.g. swap chicken for turkey, rice for potato.
- Drink 2–3L of water daily for hunger management and performance.
- This plan is a template — adjust portions up or down by ~50g on the carb source to hit your exact target.
${CTA.mealPlan}`;

      return { content: [{ type: 'text', text }] };
    }
  );
}
