import * as os from 'node:os';
import * as path from 'node:path';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { searchText } from '../../src/services/filesystem/search-text.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-search-text-'));
}

describe('searchText', () => {
  it('finds literal text matches with line metadata', async () => {
    const root = await createRoot();
    await mkdir(path.join(root, 'src'));
    await writeFile(path.join(root, 'src', 'a.ts'), 'alpha\nbeta alpha\n', 'utf8');

    const result = await searchText(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { query: 'alpha' },
    );

    expect(result.totalMatches).toBe(2);
    expect(result.matches[0]?.lineNumber).toBe(1);
    expect(result.matches[1]?.lineNumber).toBe(2);
  });

  it('supports regex queries and skips binary files', async () => {
    const root = await createRoot();
    await writeFile(path.join(root, 'a.txt'), 'item-1\nitem-2', 'utf8');
    await writeFile(path.join(root, 'binary.bin'), Buffer.from([0, 1, 2, 3]));

    const result = await searchText(
      {
        ...fileOpsDefaultConfig,
        security: { ...fileOpsDefaultConfig.security, roots: [root] },
      },
      { query: 'item-\\d', useRegex: true },
    );

    expect(result.totalMatches).toBe(2);
    expect(result.skippedFiles).toBe(1);
  });
});
