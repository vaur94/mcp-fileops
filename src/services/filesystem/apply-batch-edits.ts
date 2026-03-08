import { AppError } from '@vaur94/mcpbase';

import type { FileOpsConfig } from '../../config/schema.js';
import { createBatchLimitError } from '../../errors/file-ops-errors.js';
import { ensureMutationAllowed } from '../../security/mutation-policy.js';
import { replaceInFile, type ReplaceInFileInput } from './replace-in-file.js';
import { writeFileText, type WriteFileInput } from './write-file.js';

export type BatchEdit =
  | ({ type: 'replace' } & ReplaceInFileInput)
  | ({ type: 'write' } & WriteFileInput);

export interface ApplyBatchEditsInput {
  edits: BatchEdit[];
}

export interface BatchEditResult extends Record<string, unknown> {
  index: number;
  type: BatchEdit['type'];
  ok: boolean;
  changed: boolean;
  path: string;
  result?: Record<string, unknown>;
  errorCode?: string;
  errorMessage?: string;
}

export interface ApplyBatchEditsOutput extends Record<string, unknown> {
  totalEdits: number;
  successCount: number;
  errorCount: number;
  changedCount: number;
  results: BatchEditResult[];
}

export async function applyBatchEdits(
  config: FileOpsConfig,
  input: ApplyBatchEditsInput,
): Promise<ApplyBatchEditsOutput> {
  ensureMutationAllowed(config, 'apply_batch_edits', 'applyBatchEdits');

  if (input.edits.length > config.security.maxBatchEdits) {
    throw createBatchLimitError(config.security.maxBatchEdits, input.edits.length);
  }

  const results: BatchEditResult[] = [];

  for (const [index, edit] of input.edits.entries()) {
    try {
      const result =
        edit.type === 'replace'
          ? await replaceInFile(config, edit)
          : await writeFileText(config, edit);

      results.push({
        index,
        type: edit.type,
        ok: true,
        changed: Boolean(result.changed ?? true),
        path: edit.path,
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        results.push({
          index,
          type: edit.type,
          ok: false,
          changed: false,
          path: edit.path,
          errorCode: error.code,
          errorMessage: error.message,
        });
        continue;
      }

      throw error;
    }
  }

  return {
    totalEdits: input.edits.length,
    successCount: results.filter((result) => result.ok).length,
    errorCount: results.filter((result) => !result.ok).length,
    changedCount: results.filter((result) => result.changed).length,
    results,
  };
}
