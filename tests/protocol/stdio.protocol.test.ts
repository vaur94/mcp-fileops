import * as path from 'node:path';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { afterEach, describe, expect, it } from 'vitest';

const clients: Client[] = [];

function createClient(): Client {
  const client = new Client({ name: 'mcp-fileops-test-client', version: '1.0.0' });
  clients.push(client);
  return client;
}

function createTransport(): StdioClientTransport {
  return new StdioClientTransport({
    command: process.execPath,
    args: [path.resolve(process.cwd(), 'bin/cli.js')],
  });
}

afterEach(async () => {
  await Promise.all(clients.splice(0).map(async (client) => client.close()));
});

describe('stdio protocol', () => {
  it('connects successfully during bootstrap phase', async () => {
    const client = createClient();
    const transport = createTransport();

    await client.connect(transport);
    expect(client).toBeDefined();
  });
});
