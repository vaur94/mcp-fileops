import {
  ApplicationRuntime,
  createMcpServer,
  loadConfig,
  StderrLogger,
  startStdioServer,
  type BaseToolExecutionContext,
} from '@vaur94/mcpbase';

import { fileOpsDefaultConfig } from './config/defaults.js';
import { fileOpsConfigSchema, type FileOpsConfig } from './config/schema.js';
import { tools } from './tools/index.js';

export type FileOpsContext = BaseToolExecutionContext<FileOpsConfig>;

export async function bootstrap(argv: string[] = process.argv.slice(2)): Promise<void> {
  const config = await loadConfig(fileOpsConfigSchema, {
    argv,
    defaults: fileOpsDefaultConfig,
    envPrefix: 'MCP_FILEOPS_',
    defaultConfigFile: 'mcp-fileops.config.json',
  });

  const logger = new StderrLogger(config.logging);
  const runtime = new ApplicationRuntime<FileOpsConfig, FileOpsContext>({
    config,
    logger,
    tools,
  });
  const server = createMcpServer(runtime);

  await startStdioServer(server);
  logger.info('mcp-fileops stdio server is ready.', { toolName: 'bootstrap' });
}

export { fileOpsConfigSchema } from './config/schema.js';
export type { FileOpsConfig } from './config/schema.js';
export { fileOpsDefaultConfig } from './config/defaults.js';
export { tools } from './tools/index.js';
