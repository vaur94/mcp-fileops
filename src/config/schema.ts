import { createRuntimeConfigSchema, type BaseRuntimeConfig } from '@vaur94/mcpbase';
import { z } from 'zod';

const fileOpsExtensionSchema = z.object({
  security: z.object({
    readOnly: z.boolean(),
    roots: z.array(z.string().min(1)),
    allowHiddenPaths: z.boolean(),
    followSymlinks: z.boolean(),
    maxFileBytes: z.number().int().positive(),
    maxBatchEdits: z.number().int().positive(),
    maxSearchResults: z.number().int().positive(),
  }),
  features: z.object({
    writeFile: z.boolean(),
    replaceInFile: z.boolean(),
    applyBatchEdits: z.boolean(),
    createDirectory: z.boolean(),
    movePath: z.boolean(),
  }),
});

export const fileOpsConfigSchema = createRuntimeConfigSchema(fileOpsExtensionSchema);

export type FileOpsConfig = BaseRuntimeConfig<z.infer<typeof fileOpsExtensionSchema>>;
