import type { FileOpsConfig } from '../../config/schema.js';
import { listImmediateEntries, type PathEntryMetadata } from './common.js';

export interface ListDirectoryInput {
  path?: string;
  root?: string;
}

export interface ListDirectoryOutput extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  entries: PathEntryMetadata[];
  totalEntries: number;
}

export async function listDirectory(
  config: FileOpsConfig,
  input: ListDirectoryInput,
): Promise<ListDirectoryOutput> {
  const resolvedPath = input.path ?? '.';
  const result = await listImmediateEntries(config, resolvedPath, input.root);

  return {
    inputPath: resolvedPath,
    root: result.root,
    absolutePath: result.absolutePath,
    relativePath: result.relativePath,
    entries: result.entries,
    totalEntries: result.entries.length,
  };
}
