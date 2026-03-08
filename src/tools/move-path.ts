import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { movePath } from '../services/filesystem/move-path.js';

const inputSchema = z.object({
  sourcePath: z.string().min(1),
  destinationPath: z.string().min(1),
  sourceRoot: z.string().min(1).optional(),
  destinationRoot: z.string().min(1).optional(),
  overwrite: z.boolean().optional(),
});

const outputSchema = z.object({
  sourcePath: z.string(),
  destinationPath: z.string(),
  root: z.string(),
  sourceAbsolutePath: z.string(),
  destinationAbsolutePath: z.string(),
  changed: z.boolean(),
});

export const movePathTool: ToolDefinition<typeof inputSchema, typeof outputSchema, FileOpsContext> =
  {
    name: 'move_path',
    title: 'Move Path',
    description: 'Rename or move a file or directory within a single allowed root.',
    inputSchema,
    outputSchema,
    annotations: {
      title: 'Move Path',
      readOnlyHint: false,
      idempotentHint: false,
    },
    async execute(input, context) {
      const result = await movePath(context.config, input);

      return {
        content: [
          createTextContent(
            `Moved ${result.sourceAbsolutePath} to ${result.destinationAbsolutePath}.`,
          ),
        ],
        structuredContent: result,
      };
    },
  };
