import type { FileOpsConfig } from '../../config/schema.js';
import {
  createGlobMatcher,
  normalizeRelativePathForMatch,
  walkDirectory,
  type WalkEntry,
} from './common.js';

export interface FindPathsInput {
  path?: string;
  root?: string;
  pattern?: string;
  recursive?: boolean;
  includeFiles?: boolean;
  includeDirectories?: boolean;
  caseSensitive?: boolean;
}

export interface FindPathsOutput extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  pattern: string;
  matches: WalkEntry[];
  totalMatches: number;
}

export async function findPaths(
  config: FileOpsConfig,
  input: FindPathsInput,
): Promise<FindPathsOutput> {
  const resolvedPath = input.path ?? '.';
  const pattern = input.pattern ?? '**';
  const matcher = createGlobMatcher(pattern, input.caseSensitive ?? false);
  const walked = await walkDirectory(config, resolvedPath, {
    root: input.root,
    recursive: input.recursive ?? true,
    includeFiles: input.includeFiles ?? true,
    includeDirectories: input.includeDirectories ?? true,
  });
  const matches = walked.entries.filter((entry) =>
    matcher.test(normalizeRelativePathForMatch(entry.relativePath)),
  );

  return {
    inputPath: resolvedPath,
    root: walked.root,
    absolutePath: walked.absolutePath,
    relativePath: walked.relativePath,
    pattern,
    matches,
    totalMatches: matches.length,
  };
}
