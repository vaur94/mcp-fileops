import * as path from 'node:path';

import { AppError } from '@vaur94/mcpbase';
import { PERMISSION_DENIED } from '@vaur94/mcpbase/security';

import type { FileOpsConfig } from '../config/schema.js';

export interface ResolvedPathAccess {
  root: string;
  absolutePath: string;
  relativePath: string;
  isHiddenPath: boolean;
}

function isSubPath(root: string, targetPath: string): boolean {
  const relativePath = path.relative(root, targetPath);

  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function hasHiddenSegment(relativePath: string): boolean {
  if (relativePath === '') {
    return false;
  }

  return relativePath
    .split(path.sep)
    .filter((segment) => segment.length > 0 && segment !== '.')
    .some((segment) => segment.startsWith('.'));
}

function createPermissionDenied(
  message: string,
  details?: Record<string, unknown>,
): AppError<typeof PERMISSION_DENIED> {
  return new AppError(PERMISSION_DENIED, message, { details, expose: true });
}

function createConfigError(message: string, details?: Record<string, unknown>): AppError {
  return new AppError('CONFIG_ERROR', message, { details, expose: true });
}

function normalizeConfiguredRoot(root: string): string {
  const normalizedRoot = path.normalize(root);

  if (!path.isAbsolute(normalizedRoot)) {
    throw createConfigError('Configured roots must be absolute paths.', { root });
  }

  return normalizedRoot;
}

function normalizeConfiguredRoots(config: FileOpsConfig): string[] {
  return config.security.roots.map(normalizeConfiguredRoot);
}

function selectRootForAbsolutePath(roots: string[], absolutePath: string): string {
  const matchingRoots = roots.filter((root) => isSubPath(root, absolutePath));

  if (matchingRoots.length === 0) {
    throw createPermissionDenied('Path is outside the configured allowed roots.', {
      absolutePath,
    });
  }

  matchingRoots.sort((left, right) => right.length - left.length);

  return matchingRoots[0] ?? roots[0] ?? absolutePath;
}

function selectRootForRelativePath(roots: string[], preferredRoot?: string): string {
  if (preferredRoot !== undefined) {
    const normalizedPreferredRoot = normalizeConfiguredRoot(preferredRoot);

    if (!roots.includes(normalizedPreferredRoot)) {
      throw createPermissionDenied('Requested root is not in the configured allowlist.', {
        root: preferredRoot,
      });
    }

    return normalizedPreferredRoot;
  }

  if (roots.length === 1) {
    return roots[0] ?? path.sep;
  }

  if (roots.length === 0) {
    throw createPermissionDenied('No allowed roots are configured.', {});
  }

  throw createPermissionDenied(
    'Relative paths require an explicit root when multiple roots are configured.',
    {
      configuredRoots: roots,
    },
  );
}

export function resolvePathAccess(
  config: FileOpsConfig,
  targetPath: string,
  preferredRoot?: string,
): ResolvedPathAccess {
  const roots = normalizeConfiguredRoots(config);

  if (targetPath.length === 0) {
    throw new AppError('VALIDATION_ERROR', 'Path must not be empty.', { expose: true });
  }

  const selectedRoot = path.isAbsolute(targetPath)
    ? selectRootForAbsolutePath(roots, path.normalize(targetPath))
    : selectRootForRelativePath(roots, preferredRoot);
  const absolutePath = path.isAbsolute(targetPath)
    ? path.normalize(targetPath)
    : path.resolve(selectedRoot, targetPath);

  if (!isSubPath(selectedRoot, absolutePath)) {
    throw createPermissionDenied('Resolved path escapes the allowed root.', {
      root: selectedRoot,
      absolutePath,
    });
  }

  const relativePath = path.relative(selectedRoot, absolutePath);
  const isHiddenPath = hasHiddenSegment(relativePath);

  if (isHiddenPath && !config.security.allowHiddenPaths) {
    throw createPermissionDenied('Hidden paths are not allowed by the current policy.', {
      absolutePath,
      root: selectedRoot,
    });
  }

  return {
    root: selectedRoot,
    absolutePath,
    relativePath,
    isHiddenPath,
  };
}

export function isPathWithinRoot(root: string, targetPath: string): boolean {
  return isSubPath(normalizeConfiguredRoot(root), path.normalize(targetPath));
}
