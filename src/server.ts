import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCalculatorTool } from './tools/calculator.js';
import { registerNutritionTool } from './tools/nutrition.js';
import { registerMealPlanTool } from './tools/mealPlan.js';
import { registerDeficiencyTool } from './tools/deficiency.js';
import { registerScoreTool } from './tools/score.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'nutribalance',
    version: '1.0.0',
  });

  registerCalculatorTool(server);
  registerNutritionTool(server);
  registerMealPlanTool(server);
  registerDeficiencyTool(server);
  registerScoreTool(server);

  return server;
}
