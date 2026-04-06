import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { registerCalculatorTool } from './tools/calculator.js';
import { registerNutritionTool } from './tools/nutrition.js';
import { registerMealPlanTool } from './tools/mealPlan.js';
import { registerDeficiencyTool } from './tools/deficiency.js';
import { registerScoreTool } from './tools/score.js';

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: 'nutribalance-mcp',
      title: 'NutriBalance',
      version: '1.0.0',
      description:
        'Free nutrition tools for AI assistants — calculate TDEE & personalised macros, look up food nutrition data, generate meal plans (standard, vegetarian, vegan, keto, high-protein), fix nutrient deficiencies with food & supplement guidance, and score a day\'s eating from 0–100.',
      websiteUrl: 'https://nutribalance-mcp-b9cn.vercel.app',
      icons: [
        {
          src: 'https://raw.githubusercontent.com/thenutritrackerapp-creator/nutribalance-mcp/master/icon.png',
          mimeType: 'image/png',
        },
      ],
    },
    {
      instructions:
        'Use calculate_tdee first to establish the user\'s calorie and macro targets. Then use lookup_nutrition to check specific foods, generate_meal_plan to build a full day of eating, fix_deficiency for nutrient gap action plans, and nutrition_score to rate a day\'s eating. All tools are read-only and free to use.',
    }
  );

  registerCalculatorTool(server);
  registerNutritionTool(server);
  registerMealPlanTool(server);
  registerDeficiencyTool(server);
  registerScoreTool(server);

  // ── Resources ────────────────────────────────────────────────────────────
  server.resource(
    'nutrient-reference',
    'nutribalance://reference/nutrients',
    {
      description:
        'Daily recommended intakes (RDI), deficiency symptoms, and top food sources for all 10 tracked nutrients: iron, calcium, vitamin C, vitamin D, magnesium, potassium, zinc, sodium, fibre, and protein. Use this as reference when answering nutrition questions.',
      mimeType: 'text/plain',
    },
    async () => ({
      contents: [
        {
          uri: 'nutribalance://reference/nutrients',
          mimeType: 'text/plain',
          text: [
            'NUTRIBALANCE — NUTRIENT REFERENCE GUIDE',
            '========================================',
            '',
            'IRON',
            '  RDI: 8mg/day (men) · 18mg/day (women)',
            '  Upper limit: 45mg/day',
            '  Deficiency signs: fatigue, pale skin, shortness of breath, cold extremities, brittle nails',
            '  Top foods: beef liver 85g ~5mg · lentils 200g ~6.6mg · spinach cooked 180g ~6.4mg',
            '  Supplement: iron bisglycinate — pair with vitamin C to boost absorption 3x',
            '',
            'CALCIUM',
            '  RDI: 1000mg/day (adults)',
            '  Upper limit: 2500mg/day',
            '  Deficiency signs: muscle cramps, numbness, fatigue, weak bones, dental issues',
            '  Top foods: Greek yogurt 200g ~222mg · cheddar 50g ~355mg · tofu 126g ~441mg',
            '  Supplement: calcium citrate (without food) or calcium carbonate (with meals)',
            '',
            'VITAMIN C',
            '  RDI: 90mg/day (men) · 75mg/day (women)',
            '  Upper limit: 2000mg/day',
            '  Deficiency signs: fatigue, easy bruising, slow wound healing, dry skin',
            '  Top foods: red bell pepper 149g ~190mg · kiwi 180g ~167mg · strawberries 152g ~89mg',
            '  Supplement: ascorbic acid 500–1000mg/day; split doses for absorption',
            '',
            'VITAMIN D',
            '  RDI: 600 IU/day (adults) · 800 IU/day (70+)',
            '  Upper limit: 4000 IU/day',
            '  Deficiency signs: bone pain, muscle weakness, fatigue, low mood, frequent illness',
            '  Top foods: salmon 85g ~570 IU · tuna canned 85g ~150 IU · egg yolk ~40 IU',
            '  Supplement: vitamin D3 (cholecalciferol) 1000–2000 IU/day with a fatty meal',
            '',
            'MAGNESIUM',
            '  RDI: 420mg/day (men) · 320mg/day (women)',
            '  Upper limit: 350mg/day from supplements',
            '  Deficiency signs: muscle cramps, insomnia, anxiety, headaches, constipation',
            '  Top foods: pumpkin seeds 28g ~156mg · dark chocolate 28g ~64mg · almonds 28g ~76mg',
            '  Supplement: magnesium glycinate for sleep/anxiety; magnesium citrate for constipation',
            '',
            'POTASSIUM',
            '  RDI: 3400mg/day (men) · 2600mg/day (women)',
            '  Upper limit: no established UL (excess excreted by healthy kidneys)',
            '  Deficiency signs: muscle weakness, cramps, fatigue, irregular heartbeat',
            '  Top foods: baked potato 150g ~900mg · avocado 150g ~728mg · banana 120g ~422mg',
            '  Supplement: rarely needed; high-potassium foods are more effective',
            '',
            'ZINC',
            '  RDI: 11mg/day (men) · 8mg/day (women)',
            '  Upper limit: 40mg/day',
            '  Deficiency signs: poor wound healing, hair loss, loss of taste/smell, low immunity',
            '  Top foods: oysters 85g ~74mg · beef chuck 85g ~7mg · pumpkin seeds 28g ~2.2mg',
            '  Supplement: zinc picolinate or gluconate 25–40mg/day; avoid on empty stomach',
            '',
            'SODIUM',
            '  RDI: 1500mg/day (target) · 2300mg/day (upper safe limit)',
            '  Deficiency signs: headaches, nausea, fatigue, muscle cramps (rare — usually from excess)',
            '  Top foods: table salt 6g ~2300mg · processed foods · canned soups',
            '  Note: most people eat too much sodium; deficiency is uncommon in normal diets',
            '',
            'FIBRE',
            '  Target: 28g/day (general adult)',
            '  Deficiency signs: constipation, blood sugar spikes, poor satiety, gut microbiome issues',
            '  Top foods: lentils 200g ~15g · chia seeds 28g ~10g · raspberries 120g ~8g',
            '  Note: increase gradually and drink plenty of water to avoid bloating',
            '',
            'PROTEIN',
            '  Target: 1.6–2.2g/kg body weight for active adults',
            '  Deficiency signs: muscle loss, slow recovery, poor immunity, hunger between meals',
            '  Top foods: chicken breast 150g ~46g · Greek yogurt 200g ~20g · lentils 200g ~18g',
            '  Note: spread intake across meals (0.4–0.5g/kg per meal) for optimal muscle synthesis',
          ].join('\n'),
        },
      ],
    })
  );

  // ── Prompts ──────────────────────────────────────────────────────────────
  server.prompt(
    'setup-nutrition-targets',
    'Calculate personalised TDEE and macro targets based on your stats and goal',
    {
      weight_kg: z.string().describe('Your body weight in kg'),
      height_cm: z.string().describe('Your height in cm'),
      age: z.string().describe('Your age in years'),
      gender: z.string().describe('male or female'),
      activity_level: z.string().describe('sedentary, light, moderate, active, or very_active'),
      goal: z.string().describe('lose, maintain, or gain'),
    },
    ({ weight_kg, height_cm, age, gender, activity_level, goal }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Please calculate my nutrition targets using the calculate_tdee tool. My stats: weight ${weight_kg}kg, height ${height_cm}cm, age ${age}, gender ${gender}, activity level ${activity_level}, goal: ${goal}.`,
          },
        },
      ],
    })
  );

  server.prompt(
    'daily-nutrition-check',
    'Score your daily nutrition and get personalised recommendations',
    {
      calories: z.string().describe('Total calories eaten today'),
      calorie_target: z.string().describe('Your daily calorie target'),
      protein: z.string().describe('Protein eaten today in grams'),
      protein_target: z.string().describe('Your daily protein target in grams'),
      carbs: z.string().describe('Carbohydrates eaten today in grams'),
      fat: z.string().describe('Fat eaten today in grams'),
    },
    ({ calories, calorie_target, protein, protein_target, carbs, fat }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Please score my nutrition for today using the nutrition_score tool. I ate ${calories} calories (target: ${calorie_target}), ${protein}g protein (target: ${protein_target}g), ${carbs}g carbs, ${fat}g fat.`,
          },
        },
      ],
    })
  );

  server.prompt(
    'build-meal-plan',
    'Generate a full day meal plan tailored to your calorie goal and dietary preference',
    {
      target_calories: z.string().describe('Your daily calorie target'),
      goal: z.string().describe('lose, maintain, or gain'),
      diet: z.string().describe('standard, vegetarian, vegan, keto, or high_protein'),
    },
    ({ target_calories, goal, diet }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Please generate a meal plan for me using the generate_meal_plan tool. Target: ${target_calories} calories, goal: ${goal}, dietary preference: ${diet}.`,
          },
        },
      ],
    })
  );

  server.prompt(
    'fix-nutrient-deficiency',
    'Get a targeted action plan to fix a specific nutritional deficiency',
    {
      nutrient: z.string().describe('The nutrient you want to fix, e.g. iron, vitamin_d, magnesium'),
      gender: z.string().optional().describe('male or female (optional, for personalised RDI)'),
    },
    ({ nutrient, gender }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Please give me a deficiency action plan for ${nutrient} using the fix_deficiency tool.${gender ? ` My gender is ${gender}.` : ''}`,
          },
        },
      ],
    })
  );

  return server;
}
