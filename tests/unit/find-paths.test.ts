import * as os from 'node:os';
import * as path from 'node:path';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { findPaths } from '../../src/services/filesystem/find-paths.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-find-paths-'));
}

describe('findPaths', () => {
  it('finds recursive glob matches', async () => {
    const root = await createRoot();
    await mkdir(path.join(root, 'src'));
    await mkdir(path.join(root, 'docs'));
    await writeFile(path.join(root, 'src', 'a.ts'), 'export const a = 1;', 'utf8');
    await writeFile(path.join(root, 'docs', 'a.md'), '# doc', 'utf8');

    const result = await findPaths(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { pattern: '**/*.ts' },
    );

    expect(result.totalMatches).toBe(1);
    expect(result.matches[0]?.relativePath).toBe(path.join('src', 'a.ts'));
  });

  it('supports non-recursive matching', async () => {
    const root = await createRoot();
    await mkdir(path.join(root, 'nested'));
    await writeFile(path.join(root, 'root.txt'), 'root', 'utf8');
    await writeFile(path.join(root, 'nested', 'child.txt'), 'child', 'utf8');

    const result = await findPaths(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { pattern: '*.txt', recursive: false },
    );

    expect(result.matches.map((entry) => entry.name)).toEqual(['root.txt']);
  });
});
