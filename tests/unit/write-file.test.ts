import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp, readFile as readNodeFile, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { writeFileText } from '../../src/services/filesystem/write-file.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-write-file-'));
}

describe('writeFileText', () => {
  it('creates a new file when overwrite is enabled', async () => {
    const root = await createRoot();

    const result = await writeFileText(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { path: 'new.txt', content: 'hello', overwrite: true },
    );

    expect(result.created).toBe(true);
    expect(await readNodeFile(path.join(root, 'new.txt'), 'utf8')).toBe('hello');
  });

  it('rejects overwrite when the file already exists', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'existing.txt'), 'old', 'utf8');

    await expect(
      writeFileText(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [root] },
        },
        { path: 'existing.txt', content: 'new', overwrite: false },
      ),
    ).rejects.toThrow(/Overwrite must be explicitly enabled/);
  });

  it('rejects writes in read-only mode', async () => {
    const root = await createRoot();

    await expect(
      writeFileText(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [root], readOnly: true },
        },
        { path: 'new.txt', content: 'hello', overwrite: true },
      ),
    ).rejects.toThrow(/read-only mode/);
  });
});
