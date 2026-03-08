import * as os from 'node:os';
import * as path from 'node:path';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import type { FileOpsContext } from '../../src/index.js';
import { findPathsTool } from '../../src/tools/find-paths.js';
import { listDirectoryTool } from '../../src/tools/list-directory.js';
import { readFileTool } from '../../src/tools/read-file.js';
import { readFilesTool } from '../../src/tools/read-files.js';
import { searchTextTool } from '../../src/tools/search-text.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-read-only-tools-'));
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

describe('read-only tool definitions', () => {
  it('returns list_directory summary text', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'A', 'utf8');

    const result = await listDirectoryTool.execute({}, createContext(root));

    expect(result.content[0]?.text).toContain('Listed 1 entries');
  });

  it('returns read_file summary text', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'A', 'utf8');

    const result = await readFileTool.execute({ path: 'a.txt' }, createContext(root));

    expect(result.content[0]?.text).toContain('Read');
  });

  it('returns read_files summary text', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'A', 'utf8');

    const result = await readFilesTool.execute({ files: [{ path: 'a.txt' }] }, createContext(root));

    expect(result.content[0]?.text).toContain('Read 1 files successfully');
  });

  it('returns find_paths summary text', async () => {
    const root = await createRoot();
    await mkdir(path.join(root, 'src'));
    await writeFile(path.join(root, 'src', 'a.ts'), 'export const a = 1;', 'utf8');

    const result = await findPathsTool.execute({ pattern: '**/*.ts' }, createContext(root));

    expect(result.content[0]?.text).toContain('Found 1 matching paths');
  });

  it('returns search_text summary text', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'hello world', 'utf8');

    const result = await searchTextTool.execute({ query: 'hello' }, createContext(root));

    expect(result.content[0]?.text).toContain('Found 1 text matches');
  });
});
