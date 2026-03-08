import { AppError } from '@vaur94/mcpbase';

import type { FileOpsConfig } from '../../config/schema.js';
import { resolvePathAccess } from '../../security/path-policy.js';
import { ensureMutationAllowed } from '../../security/mutation-policy.js';
import { readUtf8TextFile, writeUtf8TextFile } from './common.js';

export interface ReplaceInFileInput {
  path: string;
  find: string;
  replace: string;
  root?: string;
  replaceAll?: boolean;
  expectedMatches?: number;
}

export interface ReplaceInFileOutput extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  matchesFound: number;
  replacementsApplied: number;
  changed: boolean;
  sizeBytes: number;
}

function normalizeForNewlineStyle(text: string, newline: 'lf' | 'crlf' | 'none'): string {
  if (newline === 'crlf') {
    return text.replaceAll('\r\n', '\n').replaceAll('\n', '\r\n');
  }

  return text.replaceAll('\r\n', '\n');
}

function countMatches(content: string, search: string): number {
  if (search.length === 0) {
    return 0;
  }

  return content.split(search).length - 1;
}

export async function replaceInFile(
  config: FileOpsConfig,
  input: ReplaceInFileInput,
): Promise<ReplaceInFileOutput> {
  ensureMutationAllowed(config, 'replace_in_file', 'replaceInFile');

  const access = resolvePathAccess(config, input.path, input.root);
  const file = await readUtf8TextFile(config, input.path, input.root);
  const matchesFound = countMatches(file.content, input.find);

  if (input.expectedMatches !== undefined && input.expectedMatches !== matchesFound) {
    throw new AppError('VALIDATION_ERROR', 'Replacement precondition failed.', {
      details: {
        expectedMatches: input.expectedMatches,
        matchesFound,
      },
      expose: true,
    });
  }

  if (matchesFound === 0) {
    return {
      inputPath: input.path,
      root: access.root,
      absolutePath: access.absolutePath,
      relativePath: access.relativePath,
      matchesFound,
      replacementsApplied: 0,
      changed: false,
      sizeBytes: file.sizeBytes,
    };
  }

  const normalizedReplacement = normalizeForNewlineStyle(input.replace, file.newline);
  const replaceAll = input.replaceAll ?? true;
  const updatedContent = replaceAll
    ? file.content.split(input.find).join(normalizedReplacement)
    : file.content.replace(input.find, normalizedReplacement);
  const replacementsApplied = replaceAll ? matchesFound : 1;
  const writeResult = await writeUtf8TextFile(access.absolutePath, updatedContent, true);

  return {
    inputPath: input.path,
    root: access.root,
    absolutePath: access.absolutePath,
    relativePath: access.relativePath,
    matchesFound,
    replacementsApplied,
    changed: true,
    sizeBytes: writeResult.sizeBytes,
  };
}
