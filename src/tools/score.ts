import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { round, clamp } from '../utils/validators.js';
import { CTA } from '../utils/marketing.js';

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export function registerScoreTool(server: McpServer): void {
  server.tool(
    'nutrition_score',
    "Calculate a nutrition quality score (0–100) for a day's eating based on macros and optional micronutrient data. Returns a breakdown by category, a letter grade, and actionable recommendations. Use this when someone wants to rate their diet, check if they're eating well, or get feedback on a day's meals.",
    {
      calories_eaten: z.number().min(0).max(10000).describe('Total calories eaten today'),
      calorie_target: z.number().min(800).max(6000).describe('Daily calorie target'),
      protein_g: z.number().min(0).max(500).describe('Protein eaten today (grams)'),
      protein_target_g: z.number().min(0).max(400).describe('Daily protein target (grams)'),
      carbs_g: z.number().min(0).max(1000).describe('Carbohydrates eaten today (grams)'),
      fat_g: z.number().min(0).max(500).describe('Fat eaten today (grams)'),
      fiber_g: z.number().min(0).max(100).optional().describe('Fibre eaten today (grams) — optional'),
      vegetable_servings: z
        .number()
        .int()
        .min(0)
        .max(20)
        .optional()
        .describe('Number of vegetable/fruit servings today — optional (1 serving = ~80g)'),
      water_ml: z
        .number()
        .min(0)
        .max(10000)
        .optional()
        .describe('Water consumed today (ml) — optional'),
    },
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async ({
      calories_eaten,
      calorie_target,
      protein_g,
      protein_target_g,
      carbs_g,
      fat_g,
      fiber_g,
      vegetable_servings,
      water_ml,
    }) => {
      const categories: ScoreCategory[] = [];

      // ── 1. Calorie adherence (25 pts) ─────────────────────────────────────
      const calRatio = calories_eaten / calorie_target;
      let calScore: number;
      let calFeedback: string;

      if (calRatio >= 0.9 && calRatio <= 1.1) {
        calScore = 25;
        calFeedback = 'On target — great calorie control.';
      } else if (calRatio >= 0.8 && calRatio < 0.9) {
        calScore = 18;
        calFeedback = `${round((1 - calRatio) * calorie_target)} kcal below target — slightly under-eating.`;
      } else if (calRatio > 1.1 && calRatio <= 1.2) {
        calScore = 18;
        calFeedback = `${round((calRatio - 1) * calorie_target)} kcal over target — slightly over-eating.`;
      } else if (calRatio > 1.2 && calRatio <= 1.4) {
        calScore = 10;
        calFeedback = `${round((calRatio - 1) * calorie_target)} kcal over target.`;
      } else if (calRatio < 0.7) {
        calScore = 8;
        calFeedback = 'Significantly under target — risk of muscle loss and nutrient gaps.';
      } else {
        calScore = 5;
        calFeedback = 'Significantly over target.';
      }

      categories.push({ name: 'Calorie Adherence', score: calScore, maxScore: 25, feedback: calFeedback });

      // ── 2. Protein (25 pts) ───────────────────────────────────────────────
      const proRatio = protein_g / protein_target_g;
      let proScore: number;
      let proFeedback: string;

      if (proRatio >= 0.95) {
        proScore = 25;
        proFeedback = `Hit protein target — ${protein_g}g consumed.`;
      } else if (proRatio >= 0.8) {
        proScore = 18;
        proFeedback = `${round((1 - proRatio) * protein_target_g)}g below protein target.`;
      } else if (proRatio >= 0.6) {
        proScore = 12;
        proFeedback = `Significantly below protein target — add a high-protein meal or shake.`;
      } else {
        proScore = 5;
        proFeedback = `Very low protein — muscle recovery and satiety will suffer.`;
      }

      categories.push({ name: 'Protein Target', score: proScore, maxScore: 25, feedback: proFeedback });

      // ── 3. Macro balance (20 pts) ─────────────────────────────────────────
      const totalMacroCals = protein_g * 4 + carbs_g * 4 + fat_g * 9;
      let macroScore = 0;
      let macroFeedback = '';

      if (totalMacroCals > 0) {
        const proteinPct = (protein_g * 4) / totalMacroCals;
        const fatPct = (fat_g * 9) / totalMacroCals;
        const carbPct = (carbs_g * 4) / totalMacroCals;

        const proteinOk = proteinPct >= 0.2 && proteinPct <= 0.45;
        const fatOk = fatPct >= 0.2 && fatPct <= 0.4;
        const carbOk = carbPct >= 0.2 && carbPct <= 0.6;

        macroScore = [proteinOk, fatOk, carbOk].filter(Boolean).length * 7;
        macroScore = Math.min(macroScore, 20);

        const issues: string[] = [];
        if (!proteinOk) issues.push(`protein at ${round(proteinPct * 100)}% of cals (target 20–45%)`);
        if (!fatOk) issues.push(`fat at ${round(fatPct * 100)}% of cals (target 20–40%)`);
        if (!carbOk) issues.push(`carbs at ${round(carbPct * 100)}% of cals (target 20–60%)`);

        macroFeedback =
          issues.length === 0
            ? 'Well-balanced macro distribution.'
            : `Imbalanced: ${issues.join('; ')}.`;
      } else {
        macroScore = 0;
        macroFeedback = 'No macro data available.';
      }

      categories.push({ name: 'Macro Balance', score: macroScore, maxScore: 20, feedback: macroFeedback });

      // ── 4. Fibre (15 pts) ─────────────────────────────────────────────────
      if (fiber_g !== undefined) {
        const fiberTarget = 28; // general target
        const fiberRatio = fiber_g / fiberTarget;
        let fiberScore: number;
        let fiberFeedback: string;

        if (fiberRatio >= 1) {
          fiberScore = 15;
          fiberFeedback = `Excellent fibre intake — ${fiber_g}g consumed.`;
        } else if (fiberRatio >= 0.7) {
          fiberScore = 10;
          fiberFeedback = `Good fibre — ${fiber_g}g. Add one more vegetable or legume portion.`;
        } else if (fiberRatio >= 0.4) {
          fiberScore = 6;
          fiberFeedback = `Low fibre — ${fiber_g}g of ${fiberTarget}g target. Add beans, oats, or vegetables.`;
        } else {
          fiberScore = 2;
          fiberFeedback = `Very low fibre — ${fiber_g}g. Risk of gut health issues and blood sugar spikes.`;
        }

        categories.push({ name: 'Fibre Intake', score: fiberScore, maxScore: 15, feedback: fiberFeedback });
      } else {
        categories.push({ name: 'Fibre Intake', score: 8, maxScore: 15, feedback: 'Not provided — tracking fibre improves your score accuracy.' });
      }

      // ── 5. Vegetables/fruits (10 pts) ─────────────────────────────────────
      if (vegetable_servings !== undefined) {
        const vegScore = Math.min(vegetable_servings * 2, 10);
        const vegFeedback =
          vegetable_servings >= 5
            ? `${vegetable_servings} servings — excellent micronutrient variety.`
            : vegetable_servings >= 3
            ? `${vegetable_servings} servings — good, aim for 5 for optimal micronutrients.`
            : `Only ${vegetable_servings} serving(s) — vegetables are critical for vitamins and minerals.`;

        categories.push({ name: 'Vegetables & Fruit', score: vegScore, maxScore: 10, feedback: vegFeedback });
      } else {
        categories.push({ name: 'Vegetables & Fruit', score: 5, maxScore: 10, feedback: 'Not provided — adding veg data improves accuracy.' });
      }

      // ── 6. Hydration (5 pts) ──────────────────────────────────────────────
      if (water_ml !== undefined) {
        const waterScore = water_ml >= 2500 ? 5 : water_ml >= 2000 ? 4 : water_ml >= 1500 ? 2 : 1;
        const waterFeedback =
          water_ml >= 2500
            ? `Well hydrated — ${water_ml}ml consumed.`
            : `Under-hydrated — ${water_ml}ml. Target is 2500ml+.`;

        categories.push({ name: 'Hydration', score: waterScore, maxScore: 5, feedback: waterFeedback });
      } else {
        categories.push({ name: 'Hydration', score: 3, maxScore: 5, feedback: 'Not tracked — consider logging water intake.' });
      }

      // ── Final score ───────────────────────────────────────────────────────
      const totalScore = clamp(
        categories.reduce((s, c) => s + c.score, 0),
        0,
        100
      );
      const maxPossible = categories.reduce((s, c) => s + c.maxScore, 0);
      const scaledScore = round((totalScore / maxPossible) * 100);

      const grade =
        scaledScore >= 90
          ? 'A+'
          : scaledScore >= 80
          ? 'A'
          : scaledScore >= 70
          ? 'B'
          : scaledScore >= 60
          ? 'C'
          : scaledScore >= 50
          ? 'D'
          : 'F';

      const gradeSummary: Record<string, string> = {
        'A+': 'Outstanding — your nutrition is firing on all cylinders.',
        A: 'Excellent — very well-rounded day.',
        B: 'Good — solid foundation with room to optimise.',
        C: 'Average — a few key areas need attention.',
        D: 'Below average — several nutritional gaps present.',
        F: 'Needs significant improvement across multiple areas.',
      };

      const categoryRows = categories
        .map((c) => `| ${c.name} | ${c.score}/${c.maxScore} | ${c.feedback} |`)
        .join('\n');

      // Top 2 priority improvements
      const priorities = [...categories]
        .sort((a, b) => b.maxScore - b.score - (a.maxScore - a.score))
        .slice(0, 2)
        .filter((c) => c.score < c.maxScore);

      const priorityText =
        priorities.length > 0
          ? priorities
              .map((p, i) => `${i + 1}. **${p.name}**: ${p.feedback}`)
              .join('\n')
          : 'No major gaps — keep it up!';

      const text = `## Daily Nutrition Score

# ${scaledScore}/100 — Grade: ${grade}

*${gradeSummary[grade]}*

---

**Score Breakdown**
| Category | Score | Feedback |
|----------|-------|----------|
${categoryRows}

---

**Top Priorities for Tomorrow**
${priorityText}

---

**Your Day at a Glance**
- Calories: ${calories_eaten} / ${calorie_target} kcal (${round(calRatio * 100)}% of target)
- Protein: ${protein_g}g / ${protein_target_g}g (${round(proRatio * 100)}% of target)
- Carbs: ${carbs_g}g | Fat: ${fat_g}g
${fiber_g !== undefined ? `- Fibre: ${fiber_g}g` : ''}
${water_ml !== undefined ? `- Water: ${water_ml}ml` : ''}
${CTA.nutritionScore}`;

      return { content: [{ type: 'text', text }] };
    }
  );
}
