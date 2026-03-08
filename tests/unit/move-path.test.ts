import * as os from 'node:os';
import * as path from 'node:path';
import { access, mkdtemp, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { movePath } from '../../src/services/filesystem/move-path.js';

async function createRoot(prefix = 'mcp-fileops-move-'): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

describe('movePath', () => {
  it('moves a file within the same root', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'source.txt'), 'source', 'utf8');

    const result = await movePath(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { sourcePath: 'source.txt', destinationPath: 'nested/destination.txt', overwrite: true },
    );

    await expect(access(path.join(root, 'nested', 'destination.txt'))).resolves.toBeUndefined();
    expect(result.changed).toBe(true);
  });

  it('rejects cross-root moves', async () => {
    const rootA = await createRoot('mcp-fileops-move-a-');
    const rootB = await createRoot('mcp-fileops-move-b-');
    await writeFile(path.join(rootA, 'source.txt'), 'source', 'utf8');

    await expect(
      movePath(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [rootA, rootB] },
        },
        {
          sourcePath: 'source.txt',
          sourceRoot: rootA,
          destinationPath: 'destination.txt',
          destinationRoot: rootB,
          overwrite: true,
        },
      ),
    ).rejects.toThrow(/Cross-root moves are not allowed/);
  });
});
