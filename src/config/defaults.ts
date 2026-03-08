import type { FileOpsConfig } from './schema.js';

export const fileOpsDefaultConfig: FileOpsConfig = {
  server: {
    name: 'mcp-fileops',
    version: '0.1.0',
  },
  logging: {
    level: 'info',
    includeTimestamp: true,
  },
  security: {
    readOnly: false,
    roots: [],
    allowHiddenPaths: false,
    followSymlinks: false,
    maxFileBytes: 1_048_576,
    maxBatchEdits: 100,
    maxSearchResults: 200,
  },
  features: {
    writeFile: true,
    replaceInFile: true,
    applyBatchEdits: true,
    createDirectory: true,
    movePath: true,
  },
};
