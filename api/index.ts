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

  // GET: return HTML landing page (used as homepage by Smithery and browsers)
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NutriBalance MCP Server</title>
  <meta name="description" content="Free nutrition tools for AI assistants — calculate TDEE, look up food nutrition, generate meal plans, fix deficiencies, and score a day's eating." />
  <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/thenutritrackerapp-creator/nutribalance-mcp/master/icon.png" />
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 60px auto; padding: 0 24px; color: #111; }
    h1 { font-size: 2rem; margin-bottom: 4px; }
    .badge { display: inline-block; background: #3DBE29; color: #fff; padding: 2px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 24px; }
    p { line-height: 1.6; color: #444; }
    ul { padding-left: 20px; color: #444; line-height: 2; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    a { color: #3DBE29; }
  </style>
</head>
<body>
  <h1>NutriBalance MCP</h1>
  <span class="badge">MCP Server</span>
  <p>Free nutrition tools for AI assistants. Connect this server to Claude, Cursor, or any MCP-compatible client to unlock:</p>
  <ul>
    <li><code>calculate_tdee</code> — TDEE, BMR &amp; personalised macro targets</li>
    <li><code>lookup_nutrition</code> — full nutritional profile for any food</li>
    <li><code>generate_meal_plan</code> — full day meal plans (5 dietary styles)</li>
    <li><code>fix_deficiency</code> — action plan for any nutrient deficiency</li>
    <li><code>nutrition_score</code> — score a day's eating from 0–100</li>
  </ul>
  <p>MCP endpoint: <code>POST /api/mcp</code></p>
  <p>Powered by <a href="https://play.google.com/store/apps/details?id=com.nutribalanceapp.tracker">NutriBalance</a> — nutrition tracking on Android.</p>
</body>
</html>`);
}
