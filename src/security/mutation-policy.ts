import type { FileOpsConfig } from '../config/schema.js';
import { createFeatureDisabledError, createReadOnlyModeError } from '../errors/file-ops-errors.js';

type MutableFeatureName = keyof FileOpsConfig['features'];

export function ensureMutationAllowed(
  config: FileOpsConfig,
  toolName: string,
  featureName: MutableFeatureName,
): void {
  if (config.security.readOnly) {
    throw createReadOnlyModeError(toolName);
  }

  if (!config.features[featureName]) {
    throw createFeatureDisabledError(featureName);
  }
}
