import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { resolvePathAccess } from '../../src/security/path-policy.js';

async function createTempRoot(prefix: string): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

describe('path policy', () => {
  it('resolves a relative path under the only configured root', async () => {
    const root = await createTempRoot('mcp-fileops-policy-');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    const result = resolvePathAccess(config, 'nested/file.txt');

    expect(result.root).toBe(root);
    expect(result.absolutePath).toBe(path.join(root, 'nested/file.txt'));
    expect(result.relativePath).toBe(path.join('nested', 'file.txt'));
    expect(result.isHiddenPath).toBe(false);
  });

  it('rejects a relative path when multiple roots are configured and no root is given', async () => {
    const rootA = await createTempRoot('mcp-fileops-policy-a-');
    const rootB = await createTempRoot('mcp-fileops-policy-b-');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [rootA, rootB],
      },
    };

    expect(() => resolvePathAccess(config, 'file.txt')).toThrow(
      /Relative paths require an explicit root/,
    );
  });

  it('rejects a preferred root that is not allowlisted', async () => {
    const root = await createTempRoot('mcp-fileops-policy-');
    const otherRoot = await createTempRoot('mcp-fileops-policy-other-');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    expect(() => resolvePathAccess(config, 'file.txt', otherRoot)).toThrow(
      /Requested root is not in the configured allowlist/,
    );
  });

  it('rejects access when no allowed roots are configured', () => {
    expect(() => resolvePathAccess(fileOpsDefaultConfig, 'file.txt')).toThrow(
      /No allowed roots are configured/,
    );
  });

  it('rejects an empty path', async () => {
    const root = await createTempRoot('mcp-fileops-policy-');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    expect(() => resolvePathAccess(config, '')).toThrow(/Path must not be empty/);
  });

  it('accepts an absolute path inside an allowed root and prefers the deepest matching root', async () => {
    const root = await createTempRoot('mcp-fileops-policy-');
    const nestedRoot = path.join(root, 'nested-root');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root, nestedRoot],
      },
    };

    const result = resolvePathAccess(config, path.join(nestedRoot, 'file.txt'));

    expect(result.root).toBe(nestedRoot);
    expect(result.absolutePath).toBe(path.join(nestedRoot, 'file.txt'));
  });

  it('rejects traversal outside the configured root', async () => {
    const root = await createTempRoot('mcp-fileops-policy-');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    expect(() => resolvePathAccess(config, '../escape.txt')).toThrow(/escapes the allowed root/);
  });

  it('rejects hidden paths by default', async () => {
    const root = await createTempRoot('mcp-fileops-policy-');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    expect(() => resolvePathAccess(config, '.secret/file.txt')).toThrow(
      /Hidden paths are not allowed/,
    );
  });

  it('accepts hidden paths when explicitly enabled', async () => {
    const root = await createTempRoot('mcp-fileops-policy-');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
        allowHiddenPaths: true,
      },
    };

    const result = resolvePathAccess(config, '.secret/file.txt');

    expect(result.isHiddenPath).toBe(true);
    expect(result.absolutePath).toBe(path.join(root, '.secret/file.txt'));
  });

  it('rejects non-absolute configured roots', () => {
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: ['relative-root'],
      },
    };

    expect(() => resolvePathAccess(config, 'file.txt')).toThrow(
      /Configured roots must be absolute paths/,
    );
  });
});
