/**
 * Vercel serverless handler — Streamable HTTP MCP transport.
 * Deployed at: https://<your-vercel-domain>/mcp
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from '../src/server.js';

export const config = { api: { bodyParser: false } };

// Simple in-memory request rate limiter (per-IP, resets on cold start)
const RATE_LIMIT = 60; // requests per window
const WINDOW_MS = 60_000;
const ipCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Stateless serverless — SSE/GET streams are not supported
  if (req.method === 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json', Allow: 'POST, DELETE, OPTIONS' });
    res.end(JSON.stringify({ error: 'GET not supported. Use POST for MCP JSON-RPC.' }));
    return;
  }

  // Rate limiting
  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ??
    '127.0.0.1';

  if (isRateLimited(ip)) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Too many requests. Please slow down.' }));
    return;
  }

  // Collect request body
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

  // Some MCP clients (e.g. Smithery) omit "text/event-stream" from Accept.
  // The transport rejects those requests with 406, so we normalise the header here.
  // enableJsonResponse: true makes the transport reply with plain JSON instead of SSE,
  // which is required for serverless functions that can't hold open SSE streams.
  req.headers['accept'] = 'application/json, text/event-stream';

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — no session persistence needed
    enableJsonResponse: true,
  });

  // In stateless serverless mode each HTTP request creates a fresh transport.
  // The transport rejects non-initialize requests with "Server not initialized"
  // because _initialized is false on every new instance. Smithery (and other
  // clients) send initialize and tools/list as separate POST requests, so the
  // second request would always fail without this pre-warm.
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
}
