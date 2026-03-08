import { mkdtemp, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { ApplicationRuntime, StderrLogger, isErrorResult } from '@vaur94/mcpbase';
import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import type { FileOpsConfig } from '../../src/config/schema.js';
import type { FileOpsContext } from '../../src/index.js';
import { tools } from '../../src/tools/index.js';

function createTestLogger() {
  return new StderrLogger({ level: 'error', includeTimestamp: false });
}

describe('runtime integration', () => {
  it('boots the runtime with the full v1 tool set', () => {
    const runtime = new ApplicationRuntime<FileOpsConfig, FileOpsContext>({
      config: fileOpsDefaultConfig,
      logger: createTestLogger(),
      tools,
    });

    expect(runtime.listTools().map((tool) => tool.name)).toEqual([
      'list_directory',
      'get_path_info',
      'read_file',
      'read_files',
      'find_paths',
      'search_text',
      'write_file',
      'replace_in_file',
      'apply_batch_edits',
      'create_directory',
      'move_path',
    ]);
  });

  it('executes write_file successfully for an allowed path', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-runtime-write-'));
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    } satisfies FileOpsConfig;

    const runtime = new ApplicationRuntime<FileOpsConfig, FileOpsContext>({
      config,
      logger: createTestLogger(),
      tools,
    });
    const result = await runtime.executeTool('write_file', {
      path: 'runtime.txt',
      content: 'runtime file',
      overwrite: true,
    });

    expect(isErrorResult(result)).toBe(false);
  });

  it('rejects mutating tools in read-only mode', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-runtime-readonly-'));
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
        readOnly: true,
      },
    } satisfies FileOpsConfig;

    const runtime = new ApplicationRuntime<FileOpsConfig, FileOpsContext>({
      config,
      logger: createTestLogger(),
      tools,
    });
    const result = await runtime.executeTool('write_file', {
      path: 'blocked.txt',
      content: 'blocked',
      overwrite: true,
    });

    expect(isErrorResult(result)).toBe(true);
  });

  it('executes get_path_info successfully for an allowed path', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-runtime-'));
    const filePath = path.join(root, 'example.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    } satisfies FileOpsConfig;

    await writeFile(filePath, 'runtime file', 'utf8');

    const runtime = new ApplicationRuntime<FileOpsConfig, FileOpsContext>({
      config,
      logger: createTestLogger(),
      tools,
    });
    const result = await runtime.executeTool('get_path_info', { path: 'example.txt' });

    expect(isErrorResult(result)).toBe(false);

    if (isErrorResult(result)) {
      throw new Error('Expected get_path_info to succeed.');
    }

    expect(result.structuredContent?.kind).toBe('file');
    expect(result.structuredContent?.exists).toBe(true);
  });

  it('rejects a path outside the allowed root', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-runtime-'));
    const outsideRoot = await mkdtemp(path.join(os.tmpdir(), 'mcp-fileops-runtime-outside-'));
    const outsideFile = path.join(outsideRoot, 'outside.txt');
    const config = {
      ...fileOpsDefaultConfig,
      security: {
        ...fileOpsDefaultConfig.security,
        roots: [root],
      },
    } satisfies FileOpsConfig;

    await writeFile(outsideFile, 'outside file', 'utf8');

    const runtime = new ApplicationRuntime<FileOpsConfig, FileOpsContext>({
      config,
      logger: createTestLogger(),
      tools,
    });
    const result = await runtime.executeTool('get_path_info', { path: outsideFile });

    expect(isErrorResult(result)).toBe(true);

    if (!isErrorResult(result)) {
      throw new Error('Expected get_path_info to fail for a disallowed path.');
    }

    expect(result.error.code).toBe('PERMISSION_DENIED');
  });
});
