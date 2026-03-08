import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { readMultipleFiles } from '../../src/services/filesystem/read-files.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-read-files-'));
}

describe('readMultipleFiles', () => {
  it('returns per-file results instead of failing the full batch', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'A', 'utf8');

    const result = await readMultipleFiles(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      {
        files: [{ path: 'a.txt' }, { path: 'missing.txt' }],
      },
    );

    expect(result.successCount).toBe(1);
    expect(result.errorCount).toBe(1);
    expect(result.files[0]?.ok).toBe(true);
    expect(result.files[1]?.ok).toBe(false);
  });
});
