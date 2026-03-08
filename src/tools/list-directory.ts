import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { listDirectory } from '../services/filesystem/list-directory.js';

const inputSchema = z.object({
  path: z.string().min(1).optional(),
  root: z.string().min(1).optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  totalEntries: z.number().int().nonnegative(),
  entries: z.array(
    z.object({
      name: z.string(),
      absolutePath: z.string(),
      relativePath: z.string(),
      kind: z.enum(['file', 'directory', 'symlink', 'other']),
      isHiddenPath: z.boolean(),
      isSymlink: z.boolean(),
      sizeBytes: z.number().int().nonnegative(),
      createdAt: z.string(),
      modifiedAt: z.string(),
    }),
  ),
});

export const listDirectoryTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'list_directory',
  title: 'List Directory',
  description: 'List immediate children of one directory within allowed roots.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'List Directory',
    readOnlyHint: true,
    idempotentHint: true,
  },
  async execute(input, context) {
    const result = await listDirectory(context.config, input);

    return {
      content: [
        createTextContent(`Listed ${result.totalEntries} entries under ${result.absolutePath}.`),
      ],
      structuredContent: result,
    };
  },
};
