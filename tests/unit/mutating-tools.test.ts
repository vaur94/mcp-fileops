import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp, readFile as readNodeFile, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import type { FileOpsContext } from '../../src/index.js';
import { applyBatchEditsTool } from '../../src/tools/apply-batch-edits.js';
import { createDirectoryTool } from '../../src/tools/create-directory.js';
import { movePathTool } from '../../src/tools/move-path.js';
import { replaceInFileTool } from '../../src/tools/replace-in-file.js';
import { writeFileTool } from '../../src/tools/write-file.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-mutating-tools-'));
}

function createContext(root: string): FileOpsContext {
  return {
    requestId: 'test-request',
    toolName: 'test-tool',
    config: {
      ...fileOpsDefaultConfig,
      security: { ...fileOpsDefaultConfig.security, roots: [root] },
    },
  };
}

describe('mutating tool definitions', () => {
  it('returns write_file summary text', async () => {
    const root = await createRoot();
    const result = await writeFileTool.execute(
      { path: 'a.txt', content: 'A', overwrite: true },
      createContext(root),
    );

    expect(result.content[0]?.text).toContain('Wrote');
  });

  it('returns create_directory summary text', async () => {
    const root = await createRoot();
    const result = await createDirectoryTool.execute({ path: 'a/b' }, createContext(root));

    expect(result.content[0]?.text).toContain('Created directory');
  });

  it('returns replace_in_file summary text', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'hello world', 'utf8');

    const result = await replaceInFileTool.execute(
      { path: 'a.txt', find: 'world', replace: 'repo' },
      createContext(root),
    );

    expect(result.content[0]?.text).toContain('Applied 1 replacements');
  });

  it('returns move_path summary text', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'hello', 'utf8');

    const result = await movePathTool.execute(
      { sourcePath: 'a.txt', destinationPath: 'b.txt', overwrite: true },
      createContext(root),
    );

    expect(result.content[0]?.text).toContain('Moved');
  });

  it('returns apply_batch_edits summary text', async () => {
    const root = await createRoot();
    const result = await applyBatchEditsTool.execute(
      {
        edits: [{ type: 'write', path: 'a.txt', content: 'hello', overwrite: true }],
      },
      createContext(root),
    );

    expect(result.content[0]?.text).toContain('Applied 1 edits successfully');
    expect(await readNodeFile(path.join(root, 'a.txt'), 'utf8')).toBe('hello');
  });
});
