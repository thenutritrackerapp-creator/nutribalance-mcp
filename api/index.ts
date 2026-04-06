import type { IncomingMessage, ServerResponse } from 'http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from '../src/server.js';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // POST: treat as MCP JSON-RPC (some clients connect to the root URL)
  if (req.method === 'POST') {
    let rawBody = '';
    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk) => { rawBody += chunk; });
      req.on('end', resolve);
      req.on('error', reject);
    });
    let parsedBody: unknown;
    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : undefined;
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }

    req.headers['accept'] = 'application/json, text/event-stream';

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    // Pre-warm stateless transport — see api/mcp.ts for explanation
    const requestMethod = (parsedBody as Record<string, unknown> | undefined)?.method;
    if (requestMethod && requestMethod !== 'initialize') {
      (transport as unknown as { _webStandardTransport: { _initialized: boolean } })
        ._webStandardTransport._initialized = true;
    }

    const server = createServer();
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, parsedBody);
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
      console.error('[nutribalance-mcp] Error:', err);
    }
    return;
  }

  // GET: return server info
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify(
      {
        name: 'NutriBalance MCP Server',
        version: '1.0.0',
        status: 'online',
        description:
          'MCP server for nutrition calculations, meal planning, and deficiency analysis.',
        endpoint: '/api/mcp',
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
