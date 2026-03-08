import type { ToolDefinition, ToolInputSchema, ToolOutputSchema } from '@vaur94/mcpbase';

import type { FileOpsContext } from '../index.js';
import { applyBatchEditsTool } from './apply-batch-edits.js';
import { createDirectoryTool } from './create-directory.js';
import { findPathsTool } from './find-paths.js';
import { getPathInfoTool } from './get-path-info.js';
import { listDirectoryTool } from './list-directory.js';
import { movePathTool } from './move-path.js';
import { readFileTool } from './read-file.js';
import { readFilesTool } from './read-files.js';
import { replaceInFileTool } from './replace-in-file.js';
import { searchTextTool } from './search-text.js';
import { writeFileTool } from './write-file.js';

export const tools: ToolDefinition<
  ToolInputSchema,
  ToolOutputSchema | undefined,
  FileOpsContext
>[] = [
  listDirectoryTool,
  getPathInfoTool,
  readFileTool,
  readFilesTool,
  findPathsTool,
  searchTextTool,
  writeFileTool,
  replaceInFileTool,
  applyBatchEditsTool,
  createDirectoryTool,
  movePathTool,
];

export { applyBatchEditsTool } from './apply-batch-edits.js';
export { createDirectoryTool } from './create-directory.js';
export { findPathsTool } from './find-paths.js';
export { getPathInfoTool } from './get-path-info.js';
export { listDirectoryTool } from './list-directory.js';
export { movePathTool } from './move-path.js';
export { readFileTool } from './read-file.js';
export { readFilesTool } from './read-files.js';
export { replaceInFileTool } from './replace-in-file.js';
export { searchTextTool } from './search-text.js';
export { writeFileTool } from './write-file.js';
