import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { searchFood, getAllFoodNames } from '../data/foods.js';
import { round } from '../utils/validators.js';
import { sanitizeString } from '../utils/validators.js';
import { CTA } from '../utils/marketing.js';

export function registerNutritionTool(server: McpServer): void {
  server.tool(
    'lookup_nutrition',
    "Look up the full nutritional profile (calories, protein, carbs, fat, fibre, and key micronutrients) for any food by name and serving size. Use this when someone asks about the nutrition or macros in a specific food.",
    {
      food_name: z
        .string()
        .min(1)
        .max(100)
        .describe('Name of the food to look up (e.g. "chicken breast", "oats", "banana")'),
      amount_grams: z
        .number()
        .min(1)
        .max(2000)
        .optional()
        .default(100)
        .describe('Serving size in grams (default: 100g)'),
    },
    async ({ food_name, amount_grams }) => {
      const query = sanitizeString(food_name);
      const grams = amount_grams ?? 100;
      const ratio = grams / 100;

      const food = searchFood(query);

      if (!food) {
        const suggestions = getAllFoodNames()
          .filter((n) => n.toLowerCase().includes(query.toLowerCase().split(' ')[0]))
          .slice(0, 5);

        const suggestionText =
          suggestions.length > 0
            ? `\n\nDid you mean one of these?\n${suggestions.map((s) => `- ${s}`).join('\n')}`
            : '\n\nTry a more common food name (e.g. "chicken breast", "oats", "salmon").';

        return {
          content: [
            {
              type: 'text',
              text: `Food not found: **"${query}"**${suggestionText}${CTA.logFood}`,
            },
          ],
        };
      }

      const cal = round(food.calories * ratio);
      const pro = round(food.protein * ratio);
      const carb = round(food.carbs * ratio);
      const fat = round(food.fat * ratio);
      const fib = round(food.fiber * ratio);
      const sod = round(food.sodium * ratio);
      const cal_ = round(food.calcium * ratio);
      const iron = round(food.iron * ratio, 2);
      const vitC = round(food.vitaminC * ratio);
      const vitD = round(food.vitaminD * ratio);
      const mag = round(food.magnesium * ratio);
      const pot = round(food.potassium * ratio);
      const zinc = round(food.zinc * ratio, 2);

      // Protein quality signal
      const proteinDensity = round((food.protein / food.calories) * 100, 1);
      const proteinLabel =
        proteinDensity >= 35
          ? '⭐ Excellent protein source'
          : proteinDensity >= 20
          ? 'Good protein source'
          : proteinDensity >= 10
          ? 'Moderate protein source'
          : 'Low protein content';

      const text = `## Nutrition: ${food.name} (${grams}g)

**Macronutrients**
| Macro | Amount |
|-------|--------|
| Calories | **${cal} kcal** |
| Protein | **${pro}g** |
| Carbohydrates | ${carb}g |
| Fat | ${fat}g |
| Fibre | ${fib}g |

*${proteinLabel} — ${proteinDensity}g protein per 100 kcal*

---

**Key Micronutrients**
| Nutrient | Amount |
|----------|--------|
| Sodium | ${sod} mg |
| Calcium | ${cal_} mg |
| Iron | ${iron} mg |
| Vitamin C | ${vitC} mg |
| Vitamin D | ${vitD} IU |
| Magnesium | ${mag} mg |
| Potassium | ${pot} mg |
| Zinc | ${zinc} mg |

---

**Quick context** — in ${grams}g of ${food.name}:
- Protein provides ${round(pro * 4)} kcal (${round((pro * 4 / cal) * 100)}% of calories)
- Carbs provide ${round(carb * 4)} kcal (${round((carb * 4 / cal) * 100)}% of calories)
- Fat provides ${round(fat * 9)} kcal (${round((fat * 9 / cal) * 100)}% of calories)
${CTA.logFood}`;

      return { content: [{ type: 'text', text }] };
    }
  );
}
