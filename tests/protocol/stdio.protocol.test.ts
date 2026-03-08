import * as path from 'node:path';
import * as os from 'node:os';

import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { afterEach, describe, expect, it } from 'vitest';

const clients: Client[] = [];

function createClient(): Client {
  const client = new Client({ name: 'mcp-fileops-test-client', version: '1.0.0' });
  clients.push(client);
  return client;
}

async function createProtocolWorkspace(): Promise<{ cwd: string; root: string }> {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-protocol-'));
  const root = path.join(cwd, 'root');
  const srcDirectory = path.join(root, 'src');

  await mkdir(root);
  await mkdir(srcDirectory);
  await writeFile(path.join(root, 'fixture.txt'), 'fixture', 'utf8');
  await writeFile(path.join(srcDirectory, 'example.ts'), 'export const fixture = true;\n', 'utf8');
  await writeFile(
    path.join(cwd, 'mcp-fileops.config.json'),
    JSON.stringify(
      {
        security: {
          roots: [root],
        },
      },
      null,
      2,
    ),
    'utf8',
  );

  return { cwd, root };
}

function createTransport(cwd: string): StdioClientTransport {
  return new StdioClientTransport({
    command: process.execPath,
    args: [path.resolve(process.cwd(), 'bin/cli.js')],
    cwd,
  });
}

afterEach(async () => {
  await Promise.all(clients.splice(0).map(async (client) => client.close()));
});

describe('stdio protocol', () => {
  it('connects successfully during bootstrap phase', async () => {
    const workspace = await createProtocolWorkspace();
    const client = createClient();
    const transport = createTransport(workspace.cwd);

    await client.connect(transport);
    expect(client).toBeDefined();
  });

  it('lists and exercises the full v1 tool surface over stdio', async () => {
    const workspace = await createProtocolWorkspace();
    const client = createClient();
    const transport = createTransport(workspace.cwd);

    await client.connect(transport);

    const listedTools = await client.listTools();
    const toolNames = listedTools.tools.map((tool) => tool.name).sort();

    expect(toolNames).toEqual([
      'apply_batch_edits',
      'create_directory',
      'find_paths',
      'get_path_info',
      'list_directory',
      'move_path',
      'read_file',
      'read_files',
      'replace_in_file',
      'search_text',
      'write_file',
    ]);

    const pathInfoResult = await client.callTool({
      name: 'get_path_info',
      arguments: {
        path: 'fixture.txt',
      },
    });

    expect(pathInfoResult.isError).not.toBe(true);
    expect(pathInfoResult.structuredContent).toMatchObject({
      kind: 'file',
      exists: true,
      root: workspace.root,
    });

    const listDirectoryResult = await client.callTool({
      name: 'list_directory',
      arguments: { path: '.' },
    });

    expect(listDirectoryResult.isError).not.toBe(true);
    expect(listDirectoryResult.structuredContent).toMatchObject({ totalEntries: 2 });

    const readFileResult = await client.callTool({
      name: 'read_file',
      arguments: { path: 'fixture.txt' },
    });

    expect(readFileResult.isError).not.toBe(true);
    expect(readFileResult.structuredContent).toMatchObject({ content: 'fixture' });

    const readFilesResult = await client.callTool({
      name: 'read_files',
      arguments: { files: [{ path: 'fixture.txt' }, { path: 'missing.txt' }] },
    });

    expect(readFilesResult.isError).not.toBe(true);
    expect(readFilesResult.structuredContent).toMatchObject({ successCount: 1, errorCount: 1 });

    const findPathsResult = await client.callTool({
      name: 'find_paths',
      arguments: { pattern: '**/*.ts' },
    });

    expect(findPathsResult.isError).not.toBe(true);
    expect(findPathsResult.structuredContent).toMatchObject({ totalMatches: 1 });

    const searchTextResult = await client.callTool({
      name: 'search_text',
      arguments: { query: 'fixture' },
    });

    expect(searchTextResult.isError).not.toBe(true);
    expect(searchTextResult.structuredContent).toMatchObject({ totalMatches: 2 });

    const createDirectoryResult = await client.callTool({
      name: 'create_directory',
      arguments: { path: 'generated/output' },
    });

    expect(createDirectoryResult.isError).not.toBe(true);

    const writeFileResult = await client.callTool({
      name: 'write_file',
      arguments: { path: 'generated/output/note.txt', content: 'hello world', overwrite: true },
    });

    expect(writeFileResult.isError).not.toBe(true);

    const replaceInFileResult = await client.callTool({
      name: 'replace_in_file',
      arguments: { path: 'generated/output/note.txt', find: 'world', replace: 'repo' },
    });

    expect(replaceInFileResult.isError).not.toBe(true);
    expect(replaceInFileResult.structuredContent).toMatchObject({ replacementsApplied: 1 });

    const batchEditsResult = await client.callTool({
      name: 'apply_batch_edits',
      arguments: {
        edits: [
          { type: 'write', path: 'generated/output/batch.txt', content: 'alpha', overwrite: true },
          { type: 'replace', path: 'generated/output/note.txt', find: 'repo', replace: 'protocol' },
        ],
      },
    });

    expect(batchEditsResult.isError).not.toBe(true);
    expect(batchEditsResult.structuredContent).toMatchObject({ successCount: 2 });

    const movePathResult = await client.callTool({
      name: 'move_path',
      arguments: {
        sourcePath: 'generated/output/batch.txt',
        destinationPath: 'generated/output/moved.txt',
        overwrite: true,
      },
    });

    expect(movePathResult.isError).not.toBe(true);

    const movedReadResult = await client.callTool({
      name: 'read_file',
      arguments: { path: 'generated/output/moved.txt' },
    });

    expect(movedReadResult.isError).not.toBe(true);
    expect(movedReadResult.structuredContent).toMatchObject({ content: 'alpha' });
  });
});
