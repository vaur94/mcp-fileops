import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp, readFile as readNodeFile, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { applyBatchEdits } from '../../src/services/filesystem/apply-batch-edits.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-batch-'));
}

describe('applyBatchEdits', () => {
  it('applies mixed write and replace edits with per-edit results', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'replace.txt'), 'hello world', 'utf8');

    const result = await applyBatchEdits(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      {
        edits: [
          { type: 'write', path: 'write.txt', content: 'new file', overwrite: true },
          { type: 'replace', path: 'replace.txt', find: 'world', replace: 'repo' },
          { type: 'replace', path: 'missing.txt', find: 'x', replace: 'y' },
        ],
      },
    );

    expect(result.successCount).toBe(2);
    expect(result.errorCount).toBe(1);
    expect(await readNodeFile(path.join(root, 'write.txt'), 'utf8')).toBe('new file');
    expect(await readNodeFile(path.join(root, 'replace.txt'), 'utf8')).toBe('hello repo');
  });

  it('rejects batches that exceed the configured limit', async () => {
    const root = await createRoot();

    await expect(
      applyBatchEdits(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [root], maxBatchEdits: 1 },
        },
        {
          edits: [
            { type: 'write', path: 'a.txt', content: 'a', overwrite: true },
            { type: 'write', path: 'b.txt', content: 'b', overwrite: true },
          ],
        },
      ),
    ).rejects.toThrow(/Batch size exceeds the configured limit/);
  });
});
