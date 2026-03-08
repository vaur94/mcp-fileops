import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { getPathInfo } from '../services/filesystem/get-path-info.js';

const inputSchema = z.object({
  path: z.string().min(1),
  root: z.string().min(1).optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  exists: z.boolean(),
  kind: z.enum(['missing', 'file', 'directory', 'symlink', 'other']),
  isHiddenPath: z.boolean(),
  isSymlink: z.boolean(),
  followedSymlink: z.boolean(),
  resolvedPath: z.string().optional(),
  isBrokenSymlink: z.boolean().optional(),
  sizeBytes: z.number().int().nonnegative().optional(),
  createdAt: z.string().optional(),
  modifiedAt: z.string().optional(),
});

function createSummaryText(info: z.infer<typeof outputSchema>): string {
  if (!info.exists) {
    return `Path not found: ${info.absolutePath}`;
  }

  const hiddenText = info.isHiddenPath ? 'hidden' : 'visible';
  const symlinkText = info.isSymlink
    ? info.followedSymlink
      ? 'symlink followed'
      : 'symlink not followed'
    : 'not a symlink';

  return `Path exists at ${info.absolutePath} (${info.kind}, ${hiddenText}, ${symlinkText}).`;
}

export const getPathInfoTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'get_path_info',
  title: 'Get Path Info',
  description: 'Inspect one path safely under the configured allowed roots.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Get Path Info',
    readOnlyHint: true,
    idempotentHint: true,
  },
  async execute(input, context) {
    const info = await getPathInfo(context.config, input);

    return {
      content: [createTextContent(createSummaryText(info))],
      structuredContent: info,
    };
  },
};
