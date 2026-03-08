import * as os from 'node:os';
import * as path from 'node:path';
import { mkdtemp, mkdir, symlink, writeFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { getPathInfo } from '../../src/services/filesystem/get-path-info.js';

async function createRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-info-'));
}

describe('getPathInfo', () => {
  it('returns file metadata for an existing file', async () => {
    const root = await createRoot();
    const filePath = path.join(root, 'example.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    await writeFile(filePath, 'hello world', 'utf8');

    const result = await getPathInfo(config, { path: 'example.txt' });

    expect(result.exists).toBe(true);
    expect(result.kind).toBe('file');
    expect(result.isSymlink).toBe(false);
    expect(result.sizeBytes).toBe(11);
  });

  it('returns missing metadata for a path that does not exist', async () => {
    const root = await createRoot();
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    const result = await getPathInfo(config, { path: 'missing.txt' });

    expect(result.exists).toBe(false);
    expect(result.kind).toBe('missing');
    expect(result.absolutePath).toBe(path.join(root, 'missing.txt'));
  });

  it('returns directory metadata for an existing directory', async () => {
    const root = await createRoot();
    const directoryPath = path.join(root, 'nested');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    await mkdir(directoryPath);

    const result = await getPathInfo(config, { path: 'nested' });

    expect(result.exists).toBe(true);
    expect(result.kind).toBe('directory');
  });

  it('returns symlink metadata without following by default', async () => {
    const root = await createRoot();
    const targetPath = path.join(root, 'target.txt');
    const linkPath = path.join(root, 'target-link.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    await writeFile(targetPath, 'target', 'utf8');
    await symlink(targetPath, linkPath);

    const result = await getPathInfo(config, { path: 'target-link.txt' });

    expect(result.exists).toBe(true);
    expect(result.kind).toBe('symlink');
    expect(result.isSymlink).toBe(true);
    expect(result.followedSymlink).toBe(false);
    expect(result.resolvedPath).toBe(targetPath);
  });

  it('follows symlinks when the policy allows it', async () => {
    const root = await createRoot();
    const targetPath = path.join(root, 'target.txt');
    const linkPath = path.join(root, 'target-link.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
        followSymlinks: true,
      },
    };

    await writeFile(targetPath, 'target', 'utf8');
    await symlink(targetPath, linkPath);

    const result = await getPathInfo(config, { path: 'target-link.txt' });

    expect(result.exists).toBe(true);
    expect(result.kind).toBe('file');
    expect(result.isSymlink).toBe(true);
    expect(result.followedSymlink).toBe(true);
    expect(result.resolvedPath).toBe(targetPath);
  });

  it('rejects symlinks that resolve outside the allowed root', async () => {
    const root = await createRoot();
    const externalRoot = await createRoot();
    const targetPath = path.join(externalRoot, 'outside.txt');
    const linkPath = path.join(root, 'outside-link.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    await writeFile(targetPath, 'outside', 'utf8');
    await symlink(targetPath, linkPath);

    await expect(getPathInfo(config, { path: 'outside-link.txt' })).rejects.toThrow(
      /Symlink resolves outside the allowed root/,
    );
  });

  it('rejects a visible symlink that resolves to a hidden target when hidden paths are disabled', async () => {
    const root = await createRoot();
    const hiddenDirectory = path.join(root, '.hidden');
    const hiddenTargetPath = path.join(hiddenDirectory, 'target.txt');
    const linkPath = path.join(root, 'visible-link.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    await mkdir(hiddenDirectory);
    await writeFile(hiddenTargetPath, 'hidden target', 'utf8');
    await symlink(hiddenTargetPath, linkPath);

    await expect(getPathInfo(config, { path: 'visible-link.txt' })).rejects.toThrow(
      /Hidden paths are not allowed/,
    );
  });

  it('allows a visible symlink to a hidden target when hidden paths are enabled', async () => {
    const root = await createRoot();
    const hiddenDirectory = path.join(root, '.hidden');
    const hiddenTargetPath = path.join(hiddenDirectory, 'target.txt');
    const linkPath = path.join(root, 'visible-link.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
        allowHiddenPaths: true,
      },
    };

    await mkdir(hiddenDirectory);
    await writeFile(hiddenTargetPath, 'hidden target', 'utf8');
    await symlink(hiddenTargetPath, linkPath);

    const result = await getPathInfo(config, { path: 'visible-link.txt' });

    expect(result.exists).toBe(true);
    expect(result.kind).toBe('symlink');
    expect(result.resolvedPath).toBe(hiddenTargetPath);
  });

  it('returns broken symlink metadata when symlinks are not followed', async () => {
    const root = await createRoot();
    const linkPath = path.join(root, 'broken-link.txt');
    const missingTarget = path.join(root, 'missing-target.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    };

    await symlink(missingTarget, linkPath);

    const result = await getPathInfo(config, { path: 'broken-link.txt' });

    expect(result.exists).toBe(true);
    expect(result.kind).toBe('symlink');
    expect(result.isBrokenSymlink).toBe(true);
  });
});
