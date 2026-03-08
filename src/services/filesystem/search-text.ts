import { AppError } from '@vaur94/mcpbase';

import type { FileOpsConfig } from '../../config/schema.js';
import {
  createGlobMatcher,
  extractMatchLines,
  normalizeRelativePathForMatch,
  readUtf8TextFile,
  walkDirectory,
} from './common.js';

export interface SearchTextInput {
  query: string;
  path?: string;
  root?: string;
  pathPattern?: string;
  recursive?: boolean;
  caseSensitive?: boolean;
  useRegex?: boolean;
  maxResults?: number;
}

export interface SearchTextMatch extends Record<string, unknown> {
  absolutePath: string;
  relativePath: string;
  lineNumber: number;
  columnStart: number;
  columnEnd: number;
  lineText: string;
  matchText: string;
}

export interface SearchTextOutput extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  query: string;
  totalMatches: number;
  searchedFiles: number;
  skippedFiles: number;
  matches: SearchTextMatch[];
}

function createQueryMatcher(input: SearchTextInput): RegExp {
  const flags = input.caseSensitive ? 'g' : 'gi';

  if (input.useRegex) {
    return new RegExp(input.query, flags);
  }

  const escapedQuery = input.query.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');

  return new RegExp(escapedQuery, flags);
}

export async function searchText(
  config: FileOpsConfig,
  input: SearchTextInput,
): Promise<SearchTextOutput> {
  const resolvedPath = input.path ?? '.';
  const pathPattern = input.pathPattern ?? '**';
  const pathMatcher = createGlobMatcher(pathPattern, input.caseSensitive ?? false);
  const queryMatcher = createQueryMatcher(input);
  const walked = await walkDirectory(config, resolvedPath, {
    root: input.root,
    recursive: input.recursive ?? true,
    includeFiles: true,
    includeDirectories: false,
  });
  const maxResults = input.maxResults ?? config.security.maxSearchResults;
  const matches: SearchTextMatch[] = [];
  let searchedFiles = 0;
  let skippedFiles = 0;

  for (const entry of walked.entries) {
    if (!pathMatcher.test(normalizeRelativePathForMatch(entry.relativePath))) {
      continue;
    }

    try {
      const file = await readUtf8TextFile(config, entry.absolutePath);
      const lines = extractMatchLines(file.content);

      searchedFiles += 1;

      for (const [index, lineText] of lines.entries()) {
        queryMatcher.lastIndex = 0;
        let result = queryMatcher.exec(lineText);

        while (result !== null) {
          matches.push({
            absolutePath: file.absolutePath,
            relativePath: file.relativePath,
            lineNumber: index + 1,
            columnStart: result.index + 1,
            columnEnd: result.index + result[0].length,
            lineText,
            matchText: result[0],
          });

          if (matches.length >= maxResults) {
            break;
          }

          if (result[0].length === 0) {
            break;
          }

          result = queryMatcher.exec(lineText);
        }

        if (matches.length >= maxResults) {
          break;
        }
      }

      if (matches.length >= maxResults) {
        break;
      }
    } catch (error) {
      if (error instanceof AppError) {
        skippedFiles += 1;
        continue;
      }

      throw error;
    }
  }

  return {
    inputPath: resolvedPath,
    root: walked.root,
    absolutePath: walked.absolutePath,
    relativePath: walked.relativePath,
    query: input.query,
    totalMatches: matches.length,
    searchedFiles,
    skippedFiles,
    matches,
  };
}
