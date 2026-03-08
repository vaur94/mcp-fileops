import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { applyBatchEdits } from '../services/filesystem/apply-batch-edits.js';

const replaceEditSchema = z.object({
  type: z.literal('replace'),
  path: z.string().min(1),
  find: z.string().min(1),
  replace: z.string(),
  root: z.string().min(1).optional(),
  replaceAll: z.boolean().optional(),
  expectedMatches: z.number().int().nonnegative().optional(),
});

const writeEditSchema = z.object({
  type: z.literal('write'),
  path: z.string().min(1),
  content: z.string(),
  root: z.string().min(1).optional(),
  overwrite: z.boolean().optional(),
});

const inputSchema = z.object({
  edits: z.array(z.union([replaceEditSchema, writeEditSchema])),
});

const outputSchema = z.object({
  totalEdits: z.number().int().nonnegative(),
  successCount: z.number().int().nonnegative(),
  errorCount: z.number().int().nonnegative(),
  changedCount: z.number().int().nonnegative(),
  results: z.array(
    z.object({
      index: z.number().int().nonnegative(),
      type: z.enum(['replace', 'write']),
      ok: z.boolean(),
      changed: z.boolean(),
      path: z.string(),
      result: z.record(z.string(), z.unknown()).optional(),
      errorCode: z.string().optional(),
      errorMessage: z.string().optional(),
    }),
  ),
});

export const applyBatchEditsTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'apply_batch_edits',
  title: 'Apply Batch Edits',
  description: 'Apply validated write and replace edits with per-edit results.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Apply Batch Edits',
    readOnlyHint: false,
    idempotentHint: false,
  },
  async execute(input, context) {
    const result = await applyBatchEdits(context.config, input);

    return {
      content: [
        createTextContent(
          `Applied ${result.successCount} edits successfully with ${result.errorCount} per-edit errors.`,
        ),
      ],
      structuredContent: result,
    };
  },
};
