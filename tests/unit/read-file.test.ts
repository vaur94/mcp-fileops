import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp, symlink, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { readFileText } from '../../src/services/filesystem/read-file.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-read-file-'));
}

describe('readFileText', () => {
  it('reads a utf-8 text file', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'example.txt'), 'one\ntwo\n', 'utf8');

    const result = await readFileText(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { path: 'example.txt' },
    );

    expect(result.content).toBe('one\ntwo\n');
    expect(result.lineCount).toBe(3);
    expect(result.newline).toBe('lf');
  });

  it('rejects binary files', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'binary.bin'), Buffer.from([0, 255, 1, 2]));

    await expect(
      readFileText(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [root] },
        },
        { path: 'binary.bin' },
      ),
    ).rejects.toThrow(/Binary files are not supported/);
  });

  it('rejects files that exceed the size limit', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'big.txt'), '1234567890', 'utf8');

    await expect(
      readFileText(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [root], maxFileBytes: 4 },
        },
        { path: 'big.txt' },
      ),
    ).rejects.toThrow(/size limit/);
  });

  it('rejects symlinks when followSymlinks is disabled', async () => {
    const root = await createRoot();
    const targetPath = path.join(root, 'target.txt');
    const linkPath = path.join(root, 'link.txt');
    await writeFile(targetPath, 'content', 'utf8');
    await symlink(targetPath, linkPath);

    await expect(
      readFileText(
        {
          ...fileOpsDefaultConfig,
          security: { ...fileOpsDefaultConfig.security, roots: [root], followSymlinks: false },
        },
        { path: 'link.txt' },
      ),
    ).rejects.toThrow(/followSymlinks=true/);
  });

  it('allows symlinks when followSymlinks is enabled and target stays in root', async () => {
    const root = await createRoot();
    const targetPath = path.join(root, 'target.txt');
    const linkPath = path.join(root, 'link.txt');
    await writeFile(targetPath, 'content', 'utf8');
    await symlink(targetPath, linkPath);

    const result = await readFileText(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root], followSymlinks: true },
      },
      { path: 'link.txt' },
    );

    expect(result.content).toBe('content');
  });
});
