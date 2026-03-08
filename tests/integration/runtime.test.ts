import { ApplicationRuntime, StderrLogger } from '@vaur94/mcpbase';
import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import type { FileOpsConfig } from '../../src/config/schema.js';
import type { FileOpsContext } from '../../src/index.js';
import { tools } from '../../src/tools/index.js';

function createTestLogger() {
  return new StderrLogger({ level: 'error', includeTimestamp: false });
}

describe('runtime integration', () => {
  it('boots an empty runtime without tool registrations', () => {
    const runtime = new ApplicationRuntime<FileOpsConfig, FileOpsContext>({
      config: fileOpsDefaultConfig,
      logger: createTestLogger(),
      tools,
    });

    expect(runtime.listTools()).toEqual([]);
  });
});
