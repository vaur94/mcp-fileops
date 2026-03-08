import { AppError } from '@vaur94/mcpbase';

export const BINARY_FILE_ERROR = 'BINARY_FILE_ERROR';
export const FILE_TOO_LARGE_ERROR = 'FILE_TOO_LARGE_ERROR';
export const PATH_NOT_FOUND_ERROR = 'PATH_NOT_FOUND_ERROR';
export const FEATURE_DISABLED_ERROR = 'FEATURE_DISABLED_ERROR';
export const READ_ONLY_MODE_ERROR = 'READ_ONLY_MODE_ERROR';
export const BATCH_LIMIT_ERROR = 'BATCH_LIMIT_ERROR';
export const INVALID_ENCODING_ERROR = 'INVALID_ENCODING_ERROR';
export const CROSS_ROOT_MOVE_ERROR = 'CROSS_ROOT_MOVE_ERROR';
export const OVERWRITE_REQUIRED_ERROR = 'OVERWRITE_REQUIRED_ERROR';

function createFileOpsError(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): AppError<string> {
  return new AppError(code, message, { details, expose: true });
}

export function createBinaryFileError(absolutePath: string): AppError<string> {
  return createFileOpsError(BINARY_FILE_ERROR, 'Binary files are not supported in v1.', {
    absolutePath,
  });
}

export function createFileTooLargeError(
  absolutePath: string,
  sizeBytes: number,
  maxFileBytes: number,
): AppError<string> {
  return createFileOpsError(FILE_TOO_LARGE_ERROR, 'File exceeds the configured size limit.', {
    absolutePath,
    sizeBytes,
    maxFileBytes,
  });
}

export function createPathNotFoundError(absolutePath: string): AppError<string> {
  return createFileOpsError(PATH_NOT_FOUND_ERROR, 'Path does not exist.', { absolutePath });
}

export function createFeatureDisabledError(featureName: string): AppError<string> {
  return createFileOpsError(FEATURE_DISABLED_ERROR, 'This tool is disabled by feature flags.', {
    featureName,
  });
}

export function createReadOnlyModeError(toolName: string): AppError<string> {
  return createFileOpsError(
    READ_ONLY_MODE_ERROR,
    'Mutating tools are disabled in read-only mode.',
    {
      toolName,
    },
  );
}

export function createBatchLimitError(limit: number, actual: number): AppError<string> {
  return createFileOpsError(BATCH_LIMIT_ERROR, 'Batch size exceeds the configured limit.', {
    limit,
    actual,
  });
}

export function createInvalidEncodingError(absolutePath: string): AppError<string> {
  return createFileOpsError(INVALID_ENCODING_ERROR, 'Only UTF-8 text files are supported in v1.', {
    absolutePath,
  });
}

export function createCrossRootMoveError(
  sourceRoot: string,
  destinationRoot: string,
): AppError<string> {
  return createFileOpsError(CROSS_ROOT_MOVE_ERROR, 'Cross-root moves are not allowed in v1.', {
    sourceRoot,
    destinationRoot,
  });
}

export function createOverwriteRequiredError(absolutePath: string): AppError<string> {
  return createFileOpsError(OVERWRITE_REQUIRED_ERROR, 'Overwrite must be explicitly enabled.', {
    absolutePath,
  });
}
