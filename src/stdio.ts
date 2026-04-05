/**
 * stdio transport entry point — used for:
 *  - Local testing: npx tsx src/stdio.ts
 *  - Claude Desktop / direct MCP client connections
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

const server = createServer();
const transport = new StdioServerTransport();

await server.connect(transport);
