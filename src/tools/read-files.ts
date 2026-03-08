import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { readMultipleFiles } from '../services/filesystem/read-files.js';

const inputSchema = z.object({
  files: z.array(
    z.object({
      path: z.string().min(1),
      root: z.string().min(1).optional(),
    }),
  ),
});

const fileResultSchema = z.object({
  path: z.string(),
  root: z.string().optional(),
  ok: z.boolean(),
  result: z
    .object({
      inputPath: z.string(),
      root: z.string(),
      absolutePath: z.string(),
      relativePath: z.string(),
      content: z.string(),
      sizeBytes: z.number().int().nonnegative(),
      lineCount: z.number().int().nonnegative(),
      encoding: z.literal('utf-8'),
      newline: z.enum(['lf', 'crlf', 'none']),
    })
    .optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
});

const outputSchema = z.object({
  successCount: z.number().int().nonnegative(),
  errorCount: z.number().int().nonnegative(),
  files: z.array(fileResultSchema),
});

export const readFilesTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'read_files',
  title: 'Read Files',
  description: 'Read multiple UTF-8 text files with per-file results.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Read Files',
    readOnlyHint: true,
    idempotentHint: true,
  },
  async execute(input, context) {
    const result = await readMultipleFiles(context.config, input);

    return {
      content: [
        createTextContent(
          `Read ${result.successCount} files successfully with ${result.errorCount} per-file errors.`,
        ),
      ],
      structuredContent: result,
    };
  },
};
