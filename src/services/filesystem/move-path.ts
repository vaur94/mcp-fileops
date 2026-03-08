import * as path from 'node:path';
import { lstat, mkdir, rename, rm } from 'node:fs/promises';

import type { FileOpsConfig } from '../../config/schema.js';
import {
  createCrossRootMoveError,
  createOverwriteRequiredError,
  createPathNotFoundError,
} from '../../errors/file-ops-errors.js';
import { resolvePathAccess } from '../../security/path-policy.js';
import { ensureMutationAllowed } from '../../security/mutation-policy.js';

export interface MovePathInput {
  sourcePath: string;
  destinationPath: string;
  sourceRoot?: string;
  destinationRoot?: string;
  overwrite?: boolean;
}

export interface MovePathOutput extends Record<string, unknown> {
  sourcePath: string;
  destinationPath: string;
  root: string;
  sourceAbsolutePath: string;
  destinationAbsolutePath: string;
  changed: boolean;
}

export async function movePath(
  config: FileOpsConfig,
  input: MovePathInput,
): Promise<MovePathOutput> {
  ensureMutationAllowed(config, 'move_path', 'movePath');

  const sourceAccess = resolvePathAccess(config, input.sourcePath, input.sourceRoot);
  const destinationAccess = resolvePathAccess(config, input.destinationPath, input.destinationRoot);

  if (sourceAccess.root !== destinationAccess.root) {
    throw createCrossRootMoveError(sourceAccess.root, destinationAccess.root);
  }

  await lstat(sourceAccess.absolutePath).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') {
      throw createPathNotFoundError(sourceAccess.absolutePath);
    }

    throw error;
  });

  try {
    await lstat(destinationAccess.absolutePath);

    if (!(input.overwrite ?? false)) {
      throw createOverwriteRequiredError(destinationAccess.absolutePath);
    }

    await rm(destinationAccess.absolutePath, { recursive: true, force: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  await mkdir(path.dirname(destinationAccess.absolutePath), { recursive: true });
  await rename(sourceAccess.absolutePath, destinationAccess.absolutePath);

  return {
    sourcePath: input.sourcePath,
    destinationPath: input.destinationPath,
    root: sourceAccess.root,
    sourceAbsolutePath: sourceAccess.absolutePath,
    destinationAbsolutePath: destinationAccess.absolutePath,
    changed: true,
  };
}
