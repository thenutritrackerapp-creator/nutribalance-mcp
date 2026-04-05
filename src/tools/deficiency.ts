import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { NUTRIENTS, NUTRIENT_ALIASES, type NutrientKey } from '../data/nutrients.js';
import { sanitizeString } from '../utils/validators.js';
import { CTA } from '../utils/marketing.js';

export function registerDeficiencyTool(server: McpServer): void {
  server.registerTool(
    'fix_deficiency',
    {
      description: "Get a detailed action plan to fix a specific nutritional deficiency — including the best foods to eat (with serving sizes), foods to avoid, supplement advice, and deficiency symptoms. Use this when someone asks how to increase a specific nutrient, what to eat for a deficiency, or what causes low levels of a nutrient.",
      inputSchema: {
        nutrient: z
          .string()
          .min(1)
          .max(50)
          .describe('The nutrient to address. Supported: iron, calcium, vitamin_c, vitamin_d, magnesium, potassium, zinc, sodium, fiber, protein'),
        gender: z
          .enum(['male', 'female'])
          .optional()
          .describe('Biological sex — used to personalise RDI targets (default: unspecified)'),
        age: z
          .number()
          .int()
          .min(16)
          .max(100)
          .optional()
          .describe('Age in years — used to note lifecycle-specific considerations'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ nutrient, gender, age }) => {
      const raw = sanitizeString(nutrient).toLowerCase();

      // Resolve aliases (e.g. "vitamin c" → "vitamin_c")
      const key: NutrientKey =
        (NUTRIENT_ALIASES[raw] as NutrientKey) ??
        (raw.replace(/\s+/g, '_') as NutrientKey);

      const data = NUTRIENTS[key];

      if (!data) {
        const supported = Object.keys(NUTRIENTS).join(', ');
        return {
          content: [
            {
              type: 'text',
              text: `Nutrient **"${raw}"** not recognised.\n\nSupported nutrients: ${supported}\n\nTry one of these for a full deficiency action plan.${CTA.deficiencyAlert}`,
            },
          ],
        };
      }

      const rdi =
        gender === 'male'
          ? data.rdi_male
          : gender === 'female'
          ? data.rdi_female
          : Math.round((data.rdi_male + data.rdi_female) / 2);

      const upperLimit = data.upperLimit
        ? `\n- Upper safe limit: **${data.upperLimit}${data.unit}/day** — do not exceed through supplementation`
        : '';

      // Age-specific notes
      let ageNote = '';
      if (age !== undefined) {
        if (key === 'iron' && gender === 'female' && age >= 14 && age <= 50) {
          ageNote = '\n> **Note:** Premenopausal women have significantly higher iron needs (18mg/day) due to menstrual losses. Post-menopause the RDI drops to 8mg/day.';
        }
        if (key === 'calcium' && age >= 50) {
          ageNote = '\n> **Note:** Adults 50+ need more calcium (1200mg/day for women, 1000–1200mg/day for men) to maintain bone density.';
        }
        if (key === 'vitamin_d' && age >= 70) {
          ageNote = '\n> **Note:** Adults 70+ need 800 IU/day. Sun exposure becomes less effective at triggering vitamin D synthesis with age.';
        }
      }

      const symptomsText = data.deficiencySymptoms.map((s) => `- ${s}`).join('\n');
      const topFoodsText = data.topFoods
        .map((f) => `| ${f.food} | ${f.amount} | ${f.nutrientPer} |`)
        .join('\n');
      const avoidText =
        data.avoidFoods.length > 0
          ? data.avoidFoods.map((f) => `- ${f}`).join('\n')
          : '- No specific foods to avoid';

      const text = `## ${data.name} Deficiency — Action Plan

**Daily Requirement**
- RDI: **${rdi}${data.unit}/day**${upperLimit}
${ageNote}

---

**Signs of Deficiency**
${symptomsText}

---

**Top Foods to Eat**
| Food | Serving | ${data.name} Content |
|------|---------|---------------------|
${topFoodsText}

---

**What to Avoid**
${avoidText}

---

**Supplement Guidance**
${data.supplementTip}

---

**Action Plan**
1. Add 2–3 of the top food sources to your daily meals this week
2. Aim to reach your RDI through food first — supplements fill the gap
3. Pair ${data.name} foods with absorption boosters where applicable (see supplement note above)
4. Track consistently for 2–4 weeks to assess improvement
5. If symptoms persist, consult a GP for a blood test to confirm deficiency levels
${CTA.deficiencyAlert}`;

      return { content: [{ type: 'text', text }] };
    }
  );
}
