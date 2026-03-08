import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { writeFileText } from '../services/filesystem/write-file.js';

const inputSchema = z.object({
  path: z.string().min(1),
  content: z.string(),
  root: z.string().min(1).optional(),
  overwrite: z.boolean().optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  created: z.boolean(),
  changed: z.boolean(),
  sizeBytes: z.number().int().nonnegative(),
});

export const writeFileTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'write_file',
  title: 'Write File',
  description: 'Write or create one UTF-8 text file with explicit overwrite rules.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Write File',
    readOnlyHint: false,
    idempotentHint: false,
  },
  async execute(input, context) {
    const result = await writeFileText(context.config, input);

    return {
      content: [createTextContent(`Wrote ${result.absolutePath} (${result.sizeBytes} bytes).`)],
      structuredContent: result,
    };
  },
};
