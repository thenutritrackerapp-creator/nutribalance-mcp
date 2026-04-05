import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { round, clamp } from '../utils/validators.js';
import { CTA } from '../utils/marketing.js';

const ActivityMultiplier: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const ActivityLabel: Record<string, string> = {
  sedentary: 'Sedentary (desk job, little/no exercise)',
  light: 'Lightly active (1–3 days/week exercise)',
  moderate: 'Moderately active (3–5 days/week exercise)',
  active: 'Very active (6–7 days/week hard exercise)',
  very_active: 'Extra active (physical job or 2× daily training)',
};

export function registerCalculatorTool(server: McpServer): void {
  server.tool(
    'calculate_tdee',
    "Calculate TDEE (Total Daily Energy Expenditure), BMR, and personalised daily macro targets (protein, carbs, fat) based on the user's stats and goal. Use this when someone asks how many calories they should eat, what their maintenance calories are, or how to set up their macros.",
    {
      weight_kg: z.number().min(30).max(300).describe('Body weight in kilograms'),
      height_cm: z.number().min(100).max(250).describe('Height in centimetres'),
      age: z.number().int().min(16).max(100).describe('Age in years'),
      gender: z.enum(['male', 'female']).describe('Biological sex for BMR calculation'),
      activity_level: z
        .enum(['sedentary', 'light', 'moderate', 'active', 'very_active'])
        .describe('Activity level: sedentary | light | moderate | active | very_active'),
      goal: z
        .enum(['lose', 'maintain', 'gain'])
        .describe('Goal: lose weight | maintain weight | gain muscle/weight'),
    },
    async ({ weight_kg, height_cm, age, gender, activity_level, goal }) => {
      // Mifflin-St Jeor BMR
      const bmr =
        gender === 'male'
          ? 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
          : 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;

      const tdee = round(bmr * ActivityMultiplier[activity_level]);

      const goalAdjustment = { lose: -500, maintain: 0, gain: 350 }[goal];
      const targetCalories = clamp(round(tdee + goalAdjustment), 1200, 5000);

      // Macro targets
      const proteinG = round(weight_kg * (goal === 'gain' ? 2.0 : 1.8));
      const fatG = round((targetCalories * 0.25) / 9);
      const carbCals = targetCalories - proteinG * 4 - fatG * 9;
      const carbG = round(carbCals / 4);

      const goalLabel = { lose: 'Fat loss', maintain: 'Maintenance', gain: 'Muscle gain' }[goal];
      const bmi = round(weight_kg / Math.pow(height_cm / 100, 2));

      const text = `## TDEE & Macro Targets

**Your Stats**
- Weight: ${weight_kg} kg | Height: ${height_cm} cm | Age: ${age} | Gender: ${gender}
- Activity: ${ActivityLabel[activity_level]}
- Goal: ${goalLabel}
- BMI: ${bmi}

---

**Results**
| Metric | Value |
|--------|-------|
| BMR (Mifflin-St Jeor) | ${round(bmr)} kcal/day |
| TDEE (maintenance) | ${tdee} kcal/day |
| **Target calories (${goalLabel})** | **${targetCalories} kcal/day** |

---

**Daily Macro Targets**
| Macro | Grams | Calories |
|-------|-------|----------|
| Protein | **${proteinG}g** | ${round(proteinG * 4)} kcal |
| Carbohydrates | **${carbG}g** | ${round(carbG * 4)} kcal |
| Fat | **${fatG}g** | ${round(fatG * 9)} kcal |
| **Total** | — | **${targetCalories} kcal** |

---

**Practical Tips**
${goal === 'lose' ? '- The 500 kcal deficit creates ~0.5 kg/week fat loss — sustainable and muscle-preserving.\n- High protein (1.8g/kg) protects muscle during the deficit.\n- Refeed days at maintenance once per week help with hormones and adherence.' : ''}
${goal === 'maintain' ? '- Maintenance eating supports training performance and body composition.\n- Prioritise protein to retain/build muscle mass.\n- Adjust calories by ±100 kcal/week based on weight trend.' : ''}
${goal === 'gain' ? '- The 350 kcal surplus is a "lean bulk" — minimises fat gain while supporting muscle growth.\n- Track weight weekly — aim for +0.25–0.5 kg/week.\n- If gaining faster, reduce carbs by 25g.' : ''}
${CTA.trackTargets}`;

      return { content: [{ type: 'text', text }] };
    }
  );
}
