import { createTextContent, type ToolDefinition } from '@vaur94/mcpbase';
import { z } from 'zod';

import type { FileOpsContext } from '../index.js';
import { searchText } from '../services/filesystem/search-text.js';

const inputSchema = z.object({
  query: z.string().min(1),
  path: z.string().min(1).optional(),
  root: z.string().min(1).optional(),
  pathPattern: z.string().min(1).optional(),
  recursive: z.boolean().optional(),
  caseSensitive: z.boolean().optional(),
  useRegex: z.boolean().optional(),
  maxResults: z.number().int().positive().optional(),
});

const outputSchema = z.object({
  inputPath: z.string(),
  root: z.string(),
  absolutePath: z.string(),
  relativePath: z.string(),
  query: z.string(),
  totalMatches: z.number().int().nonnegative(),
  searchedFiles: z.number().int().nonnegative(),
  skippedFiles: z.number().int().nonnegative(),
  matches: z.array(
    z.object({
      absolutePath: z.string(),
      relativePath: z.string(),
      lineNumber: z.number().int().positive(),
      columnStart: z.number().int().positive(),
      columnEnd: z.number().int().positive(),
      lineText: z.string(),
      matchText: z.string(),
    }),
  ),
});

export const searchTextTool: ToolDefinition<
  typeof inputSchema,
  typeof outputSchema,
  FileOpsContext
> = {
  name: 'search_text',
  title: 'Search Text',
  description: 'Search UTF-8 text content across files under allowed roots.',
  inputSchema,
  outputSchema,
  annotations: {
    title: 'Search Text',
    readOnlyHint: true,
    idempotentHint: true,
  },
  async execute(input, context) {
    const result = await searchText(context.config, input);

    return {
      content: [
        createTextContent(
          `Found ${result.totalMatches} text matches across ${result.searchedFiles} searched files.`,
        ),
      ],
      structuredContent: result,
    };
  },
};
