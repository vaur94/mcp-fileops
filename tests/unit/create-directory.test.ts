import * as os from 'node:os';
import * as path from 'node:path';
import { access, mkdtemp } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { createDirectory } from '../../src/services/filesystem/create-directory.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-create-dir-'));
}

describe('createDirectory', () => {
  it('creates nested directories', async () => {
    const root = await createRoot();
    const result = await createDirectory(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { path: 'a/b/c' },
    );

    await expect(access(path.join(root, 'a', 'b', 'c'))).resolves.toBeUndefined();
    expect(result.created).toBe(true);
  });
});
