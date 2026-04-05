import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify(
      {
        name: 'NutriBalance MCP Server',
        version: '1.0.0',
        status: 'online',
        description:
          'MCP server for nutrition calculations, meal planning, and deficiency analysis.',
        endpoint: '/mcp',
        transport: 'Streamable HTTP (MCP spec)',
        tools: [
          'calculate_tdee',
          'lookup_nutrition',
          'generate_meal_plan',
          'fix_deficiency',
          'nutrition_score',
        ],
        app: 'Search "NutriBalance" on the App Store or Google Play.',
      },
      null,
      2
    )
  );
}
