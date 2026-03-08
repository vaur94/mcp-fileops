import type { FileOpsConfig } from '../../config/schema.js';
import { readUtf8TextFile, type TextFileData } from './common.js';

export interface ReadFileInput {
  path: string;
  root?: string;
}

export type ReadFileOutput = TextFileData;

export async function readFileText(
  config: FileOpsConfig,
  input: ReadFileInput,
): Promise<ReadFileOutput> {
  return readUtf8TextFile(config, input.path, input.root);
}
