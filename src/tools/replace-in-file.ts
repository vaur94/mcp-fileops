import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { replaceInFile } from '../services/filesystem/replace-in-file.js';

const inputSchema = z.object({
  path: z.string().min(1),
  find: z.string().min(1),
  replace: z.string(),
  root: z.string().min(1).optional(),
  replaceAll: z.boolean().optional(),
  expectedMatches: z.number().int().nonnegative().optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  matchesFound: z.number().int().nonnegative(),
  replacementsApplied: z.number().int().nonnegative(),
  changed: z.boolean(),
  sizeBytes: z.number().int().nonnegative(),
});

export const replaceInFileTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'replace_in_file',
  title: 'Replace In File',
  description: 'Apply deterministic text replacement within one UTF-8 file.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Replace In File',
    readOnlyHint: false,
    idempotentHint: false,
  },
  async execute(input, context) {
    const result = await replaceInFile(context.config, input);

    return {
      content: [
        createTextContent(
          `Applied ${result.replacementsApplied} replacements in ${result.absolutePath}.`,
        ),
      ],
      structuredContent: result,
    };
  },
};
