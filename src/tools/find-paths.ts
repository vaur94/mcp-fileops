import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { findPaths } from '../services/filesystem/find-paths.js';

const inputSchema = z.object({
  path: z.string().min(1).optional(),
  root: z.string().min(1).optional(),
  pattern: z.string().min(1).optional(),
  recursive: z.boolean().optional(),
  includeFiles: z.boolean().optional(),
  includeDirectories: z.boolean().optional(),
  caseSensitive: z.boolean().optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  pattern: z.string(),
  totalMatches: z.number().int().nonnegative(),
  matches: z.array(
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
      depth: z.number().int().positive(),
    }),
  ),
});

export const findPathsTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'find_paths',
  title: 'Find Paths',
  description: 'Find files and directories under allowed roots with glob-style matching.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Find Paths',
    readOnlyHint: true,
    idempotentHint: true,
  },
  async execute(input, context) {
    const result = await findPaths(context.config, input);

    return {
      content: [createTextContent(`Found ${result.totalMatches} matching paths.`)],
      structuredContent: result,
    };
  },
};
