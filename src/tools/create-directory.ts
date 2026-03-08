import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { createDirectory } from '../services/filesystem/create-directory.js';

const inputSchema = z.object({
  path: z.string().min(1),
  root: z.string().min(1).optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  created: z.boolean(),
});

export const createDirectoryTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'create_directory',
  title: 'Create Directory',
  description: 'Create one directory path safely within allowed roots.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Create Directory',
    readOnlyHint: false,
    idempotentHint: true,
  },
  async execute(input, context) {
    const result = await createDirectory(context.config, input);

    return {
      content: [createTextContent(`Created directory ${result.absolutePath}.`)],
      structuredContent: result,
    };
  },
};
