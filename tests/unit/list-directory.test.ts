import * as os from 'node:os';
import * as path from 'node:path';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { listDirectory } from '../../src/services/filesystem/list-directory.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-list-dir-'));
}

describe('listDirectory', () => {
  it('lists only immediate children', async () => {
    const root = await createRoot();
    await mkdir(path.join(root, 'nested'));
    await mkdir(path.join(root, 'nested', 'deep'));
    await writeFile(path.join(root, 'top.txt'), 'top', 'utf8');
    await writeFile(path.join(root, 'nested', 'deep', 'child.txt'), 'child', 'utf8');

    const result = await listDirectory(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { path: '.' },
    );

    expect(result.totalEntries).toBe(2);
    expect(result.entries.map((entry) => entry.name)).toEqual(['nested', 'top.txt']);
  });

  it('skips hidden children when hidden paths are disabled', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, '.secret.txt'), 'secret', 'utf8');
    await writeFile(path.join(root, 'visible.txt'), 'visible', 'utf8');

    const result = await listDirectory(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root], allowHiddenPaths: false },
      },
      { path: '.' },
    );

    expect(result.entries.map((entry) => entry.name)).toEqual(['visible.txt']);
  });
});
