import { describe, expect, it } from 'vitest';

import { fileOpsDefaultConfig } from '../../src/config/defaults.js';
import { fileOpsConfigSchema } from '../../src/config/schema.js';

describe('fileOps config', () => {
  it('parses the default config successfully', () => {
    const parsed = fileOpsConfigSchema.parse(fileOpsDefaultConfig);

    expect(parsed.server.name).toBe('mcp-fileops');
    expect(parsed.security.roots).toEqual([]);
    expect(parsed.features.applyBatchEdits).toBe(true);
  });

  it('requires positive numeric limits', () => {
    expect(() =>
      fileOpsConfigSchema.parse({
        ...fileOpsDefaultConfig,
        security: {
          ...fileOpsDefaultConfig.security,
          maxFileBytes: 0,
        },
      }),
    ).toThrow();
  });
});
