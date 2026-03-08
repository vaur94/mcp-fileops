import { mkdir } from 'node:fs/promises';

import type { FileOpsConfig } from '../../config/schema.js';
import { resolvePathAccess } from '../../security/path-policy.js';
import { ensureMutationAllowed } from '../../security/mutation-policy.js';

export interface CreateDirectoryInput {
  path: string;
  root?: string;
}

export interface CreateDirectoryOutput extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  created: boolean;
}

export async function createDirectory(
  config: FileOpsConfig,
  input: CreateDirectoryInput,
): Promise<CreateDirectoryOutput> {
  ensureMutationAllowed(config, 'create_directory', 'createDirectory');

  const access = resolvePathAccess(config, input.path, input.root);

  await mkdir(access.absolutePath, { recursive: true });

  return {
    inputPath: input.path,
    root: access.root,
    absolutePath: access.absolutePath,
    relativePath: access.relativePath,
    created: true,
  };
}
