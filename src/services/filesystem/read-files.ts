import { AppError } from '@vaur94/mcpbase';

import type { FileOpsConfig } from '../../config/schema.js';
import { createBatchLimitError } from '../../errors/file-ops-errors.js';
import { readFileText } from './read-file.js';

export interface ReadFilesInputItem {
  path: string;
  root?: string;
}

export interface ReadFilesInput {
  files: ReadFilesInputItem[];
}

export interface ReadFilesItemOutput extends Record<string, unknown> {
  path: string;
  root?: string;
  ok: boolean;
  result?: Awaited<ReturnType<typeof readFileText>>;
  errorCode?: string;
  errorMessage?: string;
}

export interface ReadFilesOutput extends Record<string, unknown> {
  files: ReadFilesItemOutput[];
  successCount: number;
  errorCount: number;
}

export async function readMultipleFiles(
  config: FileOpsConfig,
  input: ReadFilesInput,
): Promise<ReadFilesOutput> {
  if (input.files.length > config.security.maxSearchResults) {
    throw createBatchLimitError(config.security.maxSearchResults, input.files.length);
  }

  const files: ReadFilesItemOutput[] = [];

  for (const file of input.files) {
    try {
      files.push({
        path: file.path,
        root: file.root,
        ok: true,
        result: await readFileText(config, file),
      });
    } catch (error) {
      if (error instanceof AppError) {
        files.push({
          path: file.path,
          root: file.root,
          ok: false,
          errorCode: error.code,
          errorMessage: error.message,
        });
        continue;
      }

      throw error;
    }
  }

  return {
    files,
    successCount: files.filter((item) => item.ok).length,
    errorCount: files.filter((item) => !item.ok).length,
  };
}
