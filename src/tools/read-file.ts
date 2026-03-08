import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { readFileText } from '../services/filesystem/read-file.js';

const inputSchema = z.object({
  path: z.string().min(1),
  root: z.string().min(1).optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  content: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  lineCount: z.number().int().nonnegative(),
  encoding: z.literal('utf-8'),
  newline: z.enum(['lf', 'crlf', 'none']),
});

export const readFileTool: ToolDefinition<typeof inputSchema, typeof outputSchema, FileOpsContext> =
  {
    name: 'read_file',
    title: 'Read File',
    description: 'Read one UTF-8 text file safely within allowed roots.',
    inputSchema,
    outputSchema,
    annotations: {
      title: 'Read File',
      readOnlyHint: true,
      idempotentHint: true,
    },
    async execute(input, context) {
      const result = await readFileText(context.config, input);

      return {
        content: [createTextContent(`Read ${result.absolutePath} (${result.lineCount} lines).`)],
        structuredContent: result,
      };
    },
  };
