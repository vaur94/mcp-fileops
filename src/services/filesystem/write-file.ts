import type { FileOpsConfig } from '../../config/schema.js';
import { resolvePathAccess } from '../../security/path-policy.js';
import { ensureMutationAllowed } from '../../security/mutation-policy.js';
import { writeUtf8TextFile } from './common.js';

export interface WriteFileInput {
  path: string;
  content: string;
  root?: string;
  overwrite?: boolean;
}

export interface WriteFileOutput extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  created: boolean;
  changed: boolean;
  sizeBytes: number;
}

export async function writeFileText(
  config: FileOpsConfig,
  input: WriteFileInput,
): Promise<WriteFileOutput> {
  ensureMutationAllowed(config, 'write_file', 'writeFile');

  const access = resolvePathAccess(config, input.path, input.root);
  const result = await writeUtf8TextFile(
    access.absolutePath,
    input.content,
    input.overwrite ?? false,
  );

  return {
    inputPath: input.path,
    root: access.root,
    absolutePath: access.absolutePath,
    relativePath: access.relativePath,
    created: result.created,
    changed: true,
    sizeBytes: result.sizeBytes,
  };
}
