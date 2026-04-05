import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { registerCalculatorTool } from './tools/calculator.js';
import { registerNutritionTool } from './tools/nutrition.js';
import { registerMealPlanTool } from './tools/mealPlan.js';
import { registerDeficiencyTool } from './tools/deficiency.js';
import { registerScoreTool } from './tools/score.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'NutriBalance',
    version: '1.0.0',
  });

  registerCalculatorTool(server);
  registerNutritionTool(server);
  registerMealPlanTool(server);
  registerDeficiencyTool(server);
  registerScoreTool(server);

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
