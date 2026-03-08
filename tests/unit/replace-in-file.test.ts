import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp, readFile as readNodeFile, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { replaceInFile } from '../../src/services/filesystem/replace-in-file.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-replace-'));
}

describe('replaceInFile', () => {
  it('replaces all matches by default', async () => {
    const root = await createRoot();
    const filePath = path.join(root, 'example.txt');
    await writeFile(filePath, 'one two one', 'utf8');

    const result = await replaceInFile(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { path: 'example.txt', find: 'one', replace: 'three' },
    );

    expect(result.replacementsApplied).toBe(2);
    expect(await readNodeFile(filePath, 'utf8')).toBe('three two three');
  });

  it('returns unchanged when no matches are found', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'example.txt'), 'alpha', 'utf8');

    const result = await replaceInFile(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { path: 'example.txt', find: 'beta', replace: 'gamma' },
    );

    expect(result.changed).toBe(false);
    expect(result.replacementsApplied).toBe(0);
  });

  it('enforces expected match counts', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'example.txt'), 'one two one', 'utf8');

    await expect(
      replaceInFile(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [root] },
        },
        { path: 'example.txt', find: 'one', replace: 'three', expectedMatches: 1 },
      ),
    ).rejects.toThrow(/precondition failed/);
  });
});
