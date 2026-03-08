import { mkdtemp, symlink, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import type { FileOpsContext } from '../../src/index.js';
import { getPathInfoTool } from '../../src/tools/get-path-info.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-tool-'));
}

function createContext(
  root: string,
  overrides?: Partial<FileOpsContext['config']['security']>,
): FileOpsContext {
  return {
    requestId: 'test-request',
    toolName: 'get_path_info',
    config: {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
        ...overrides,
      },
    },
  };
}

describe('getPathInfoTool', () => {
  it('returns a missing-path summary', async () => {
    const root = await createRoot();
    const result = await getPathInfoTool.execute({ path: 'missing.txt' }, createContext(root));

    expect(result.content[0]?.text).toBe(`Path not found: ${path.join(root, 'missing.txt')}`);
    expect(result.structuredContent?.kind).toBe('missing');
  });

  it('returns a symlink summary when symlinks are not followed', async () => {
    const root = await createRoot();
    const targetPath = path.join(root, 'target.txt');
    const linkPath = path.join(root, 'target-link.txt');

    await writeFile(targetPath, 'target', 'utf8');
    await symlink(targetPath, linkPath);

    const result = await getPathInfoTool.execute({ path: 'target-link.txt' }, createContext(root));

    expect(result.content[0]?.text).toContain('symlink not followed');
    expect(result.structuredContent?.kind).toBe('symlink');
  });

  it('returns a followed-symlink summary when the policy allows it', async () => {
    const root = await createRoot();
    const targetPath = path.join(root, 'target.txt');
    const linkPath = path.join(root, 'target-link.txt');

    await writeFile(targetPath, 'target', 'utf8');
    await symlink(targetPath, linkPath);

    const result = await getPathInfoTool.execute(
      { path: 'target-link.txt' },
      createContext(root, { followSymlinks: true }),
    );

    expect(result.content[0]?.text).toContain('symlink followed');
    expect(result.structuredContent?.kind).toBe('file');
  });
});
