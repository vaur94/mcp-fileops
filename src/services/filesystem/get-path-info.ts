import { lstat, realpath, stat } from 'node:fs/promises';

import { AppError } from '@vaur94/mcpbase';
import { PERMISSION_DENIED } from '@vaur94/mcpbase/security';

import type { FileOpsConfig } from '../../config/schema.js';
import { isPathWithinRoot, resolvePathAccess } from '../../security/path-policy.js';

export type PathKind = 'missing' | 'file' | 'directory' | 'symlink' | 'other';

export interface GetPathInfoInput {
  path: string;
  root?: string;
}

export interface PathInfo extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  exists: boolean;
  kind: PathKind;
  isHiddenPath: boolean;
  isSymlink: boolean;
  followedSymlink: boolean;
  resolvedPath?: string;
  isBrokenSymlink?: boolean;
  sizeBytes?: number;
  createdAt?: string;
  modifiedAt?: string;
}

function toIsoString(timestampMs: number): string {
  return new Date(timestampMs).toISOString();
}

function getKindFromStats(stats: Awaited<ReturnType<typeof stat>>): Exclude<PathKind, 'missing'> {
  if (stats.isFile()) {
    return 'file';
  }

  if (stats.isDirectory()) {
    return 'directory';
  }

  return 'other';
}

export async function getPathInfo(
  config: FileOpsConfig,
  input: GetPathInfoInput,
): Promise<PathInfo> {
  const access = resolvePathAccess(config, input.path, input.root);

  try {
    const entryStats = await lstat(access.absolutePath);
    const baseInfo = {
      inputPath: input.path,
      root: access.root,
      absolutePath: access.absolutePath,
      relativePath: access.relativePath,
      exists: true,
      isHiddenPath: access.isHiddenPath,
      sizeBytes: entryStats.size,
      createdAt: toIsoString(entryStats.birthtimeMs),
      modifiedAt: toIsoString(entryStats.mtimeMs),
    } satisfies Omit<PathInfo, 'kind' | 'isSymlink' | 'followedSymlink'>;

    if (!entryStats.isSymbolicLink()) {
      return {
        ...baseInfo,
        kind: getKindFromStats(entryStats),
        isSymlink: false,
        followedSymlink: false,
      };
    }

    try {
      const resolvedPath = await realpath(access.absolutePath);

      if (!isPathWithinRoot(access.root, resolvedPath)) {
        throw new AppError(PERMISSION_DENIED, 'Symlink resolves outside the allowed root.', {
          details: {
            absolutePath: access.absolutePath,
            resolvedPath,
            root: access.root,
          },
          expose: true,
        });
      }

      const resolvedAccess = resolvePathAccess(config, resolvedPath);

      if (!config.security.followSymlinks) {
        return {
          ...baseInfo,
          kind: 'symlink',
          isSymlink: true,
          followedSymlink: false,
          resolvedPath: resolvedAccess.absolutePath,
        };
      }

      const resolvedStats = await stat(access.absolutePath);

      return {
        ...baseInfo,
        kind: getKindFromStats(resolvedStats),
        isSymlink: true,
        followedSymlink: true,
        resolvedPath: resolvedAccess.absolutePath,
        sizeBytes: resolvedStats.size,
        createdAt: toIsoString(resolvedStats.birthtimeMs),
        modifiedAt: toIsoString(resolvedStats.mtimeMs),
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if ((error as NodeJS.ErrnoException).code === 'ENOENT' && !config.security.followSymlinks) {
        return {
          ...baseInfo,
          kind: 'symlink',
          isSymlink: true,
          followedSymlink: false,
          isBrokenSymlink: true,
        };
      }

      throw error;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {
        inputPath: input.path,
        root: access.root,
        absolutePath: access.absolutePath,
        relativePath: access.relativePath,
        exists: false,
        kind: 'missing',
        isHiddenPath: access.isHiddenPath,
        isSymlink: false,
        followedSymlink: false,
      };
    }

    throw error;
  }
}
