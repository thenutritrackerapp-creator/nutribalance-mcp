# NutriBalance MCP Server

A free, open MCP server for nutrition calculations, meal planning, and deficiency analysis — powered by [NutriBalance](https://nutribalance.app).

Connect this server to any MCP-compatible AI assistant (Claude Desktop, Cursor, Windsurf, Copilot, etc.) to give it real nutrition intelligence.

---

## Tools

### `calculate_tdee`
Calculate TDEE, BMR, and personalised daily macro targets.

**Inputs:** weight (kg), height (cm), age, gender, activity level, goal (lose/maintain/gain)  
**Returns:** BMR, TDEE, target calories, protein/carbs/fat targets in grams

*Use when someone asks how many calories to eat, what their maintenance calories are, or how to set up macros.*

---

### `lookup_nutrition`
Look up the full nutritional profile for any food by name and serving size.

**Inputs:** food name, amount in grams (default 100g)  
**Returns:** calories, protein, carbs, fat, fibre, sodium, calcium, iron, vitamin C/D, magnesium, potassium, zinc

*Use when someone asks about macros or nutrients in a specific food.*

---

### `generate_meal_plan`
Generate a full day meal plan tailored to a calorie goal and dietary preference.

**Inputs:** target calories, goal (lose/maintain/gain), dietary preference (standard/vegetarian/vegan/keto/high_protein)  
**Returns:** 4-meal plan with foods, portion sizes, per-meal macros, and daily totals

*Use when someone asks for a meal plan or what to eat for a specific goal.*

---

### `fix_deficiency`
Get a targeted action plan to fix a specific nutritional deficiency.

**Inputs:** nutrient name, optional gender, optional age  
**Returns:** RDI, deficiency symptoms, top 6 foods with serving sizes, foods to avoid, supplement guidance, 5-step action plan

*Supported nutrients: iron, calcium, vitamin_c, vitamin_d, magnesium, potassium, zinc, sodium, fiber, protein*

---

### `nutrition_score`
Score a day's eating from 0–100 with a letter grade and improvement priorities.

**Inputs:** calories eaten/target, protein eaten/target, carbs, fat, optional fibre, optional vegetable servings, optional water intake  
**Returns:** overall score, per-category breakdown, letter grade, top 2 priority improvements

---

## Usage

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "nutribalance": {
      "command": "npx",
      "args": ["-y", "nutribalance-mcp"]
    }
  }
}
```

### HTTP (Vercel deployment)

```
POST https://nutribalance-mcp.vercel.app/mcp
```

Standard MCP Streamable HTTP transport — compatible with any MCP client.

---

## Local development

```bash
git clone https://github.com/CK-Boodhram/nutribalance-mcp
cd nutribalance-mcp
npm install
npm run dev
```

---

## About NutriBalance

NutriBalance is a nutrition tracking app (iOS & Android) that logs meals, tracks macros & micronutrients, and alerts you to deficiencies.

Search **"NutriBalance"** on the App Store or Google Play.
