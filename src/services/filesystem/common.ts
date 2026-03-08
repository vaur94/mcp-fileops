import type { Stats } from 'node:fs';
import * as path from 'node:path';
import {
  lstat,
  mkdir,
  readdir,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';

import { AppError } from '@vaur94/mcpbase';

import type { FileOpsConfig } from '../../config/schema.js';
import {
  createBinaryFileError,
  createFileTooLargeError,
  createInvalidEncodingError,
  createOverwriteRequiredError,
  createPathNotFoundError,
} from '../../errors/file-ops-errors.js';
import { isPathWithinRoot, resolvePathAccess } from '../../security/path-policy.js';

export type NewlineStyle = 'lf' | 'crlf' | 'none';
export type EntryKind = 'file' | 'directory' | 'symlink' | 'other';

export interface PathEntryMetadata extends Record<string, unknown> {
  name: string;
  absolutePath: string;
  relativePath: string;
  kind: EntryKind;
  isHiddenPath: boolean;
  isSymlink: boolean;
  sizeBytes: number;
  createdAt: string;
  modifiedAt: string;
}

export interface TextFileData extends Record<string, unknown> {
  inputPath: string;
  root: string;
  absolutePath: string;
  relativePath: string;
  content: string;
  sizeBytes: number;
  lineCount: number;
  encoding: 'utf-8';
  newline: NewlineStyle;
}

export interface WalkEntry extends PathEntryMetadata {
  depth: number;
}

export interface WalkOptions {
  root?: string;
  recursive?: boolean;
  maxResults?: number;
  includeFiles?: boolean;
  includeDirectories?: boolean;
}

function toIsoString(timestampMs: number): string {
  return new Date(timestampMs).toISOString();
}

function detectBinary(buffer: Buffer): boolean {
  if (buffer.includes(0)) {
    return true;
  }

  let suspiciousBytes = 0;

  for (const byte of buffer) {
    if (byte === 9 || byte === 10 || byte === 13) {
      continue;
    }

    if (byte < 32) {
      suspiciousBytes += 1;
    }
  }

  return buffer.length > 0 && suspiciousBytes / buffer.length > 0.1;
}

function detectNewline(content: string): NewlineStyle {
  if (content.includes('\r\n')) {
    return 'crlf';
  }

  if (content.includes('\n')) {
    return 'lf';
  }

  return 'none';
}

function countLines(content: string): number {
  if (content.length === 0) {
    return 0;
  }

  return content.split(/\r\n|\n/).length;
}

function getEntryKind(entryStats: Stats, linkStats: Stats): EntryKind {
  if (linkStats.isSymbolicLink()) {
    return 'symlink';
  }

  if (entryStats.isFile()) {
    return 'file';
  }

  if (entryStats.isDirectory()) {
    return 'directory';
  }

  return 'other';
}

async function toEntryMetadata(
  root: string,
  absolutePath: string,
  entryName?: string,
): Promise<PathEntryMetadata> {
  const access = resolvePathAccess(
    {
      security: {
        readOnly: false,
        roots: [root],
        allowHiddenPaths: true,
        followSymlinks: true,
        maxFileBytes: Number.MAX_SAFE_INTEGER,
        maxBatchEdits: Number.MAX_SAFE_INTEGER,
        maxSearchResults: Number.MAX_SAFE_INTEGER,
      },
      features: {
        writeFile: true,
        replaceInFile: true,
        applyBatchEdits: true,
        createDirectory: true,
        movePath: true,
      },
      logging: { level: 'info', includeTimestamp: false },
      server: { name: 'mcp-fileops', version: '0.0.0' },
    },
    absolutePath,
  );
  const linkStats = await lstat(absolutePath);
  let entryStats = linkStats;

  if (linkStats.isSymbolicLink()) {
    try {
      entryStats = await stat(absolutePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return {
    name: entryName ?? path.basename(absolutePath),
    absolutePath,
    relativePath: access.relativePath,
    kind: getEntryKind(entryStats, linkStats),
    isHiddenPath: access.isHiddenPath,
    isSymlink: linkStats.isSymbolicLink(),
    sizeBytes: entryStats.size,
    createdAt: toIsoString(entryStats.birthtimeMs),
    modifiedAt: toIsoString(entryStats.mtimeMs),
  };
}

export async function readUtf8TextFile(
  config: FileOpsConfig,
  inputPath: string,
  root?: string,
): Promise<TextFileData> {
  const access = resolvePathAccess(config, inputPath, root);
  const linkStats = await lstat(access.absolutePath).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') {
      throw createPathNotFoundError(access.absolutePath);
    }

    throw error;
  });

  let targetPath = access.absolutePath;

  if (linkStats.isSymbolicLink() && !config.security.followSymlinks) {
    throw new AppError('PERMISSION_DENIED', 'Symlink access requires followSymlinks=true.', {
      details: { absolutePath: access.absolutePath },
      expose: true,
    });
  }

  if (linkStats.isSymbolicLink()) {
    const resolvedPath = await realpath(access.absolutePath).catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') {
          throw createPathNotFoundError(access.absolutePath);
        }

        throw error;
      },
    );

    if (!isPathWithinRoot(access.root, resolvedPath)) {
      throw new AppError('PERMISSION_DENIED', 'Symlink resolves outside the allowed root.', {
        details: {
          absolutePath: access.absolutePath,
          resolvedPath,
          root: access.root,
        },
        expose: true,
      });
    }

    targetPath = resolvePathAccess(config, resolvedPath).absolutePath;
  }

  const entryStats = await stat(targetPath).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') {
      throw createPathNotFoundError(targetPath);
    }

    throw error;
  });

  if (!entryStats.isFile()) {
    throw new AppError('VALIDATION_ERROR', 'Target path must be a text file.', {
      details: { absolutePath: targetPath },
      expose: true,
    });
  }

  if (entryStats.size > config.security.maxFileBytes) {
    throw createFileTooLargeError(targetPath, entryStats.size, config.security.maxFileBytes);
  }

  const buffer = await readFile(targetPath);

  if (detectBinary(buffer)) {
    throw createBinaryFileError(targetPath);
  }

  const content = buffer.toString('utf8');

  if (Buffer.from(content, 'utf8').compare(buffer) !== 0) {
    throw createInvalidEncodingError(targetPath);
  }

  return {
    inputPath,
    root: access.root,
    absolutePath: access.absolutePath,
    relativePath: access.relativePath,
    content,
    sizeBytes: entryStats.size,
    lineCount: countLines(content),
    encoding: 'utf-8',
    newline: detectNewline(content),
  };
}

export async function ensurePathExists(absolutePath: string): Promise<void> {
  try {
    await lstat(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw createPathNotFoundError(absolutePath);
    }

    throw error;
  }
}

export async function writeUtf8TextFile(
  absolutePath: string,
  content: string,
  overwrite: boolean,
): Promise<{ created: boolean; sizeBytes: number }> {
  let existed = true;

  try {
    await lstat(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      existed = false;
    } else {
      throw error;
    }
  }

  if (existed && !overwrite) {
    throw createOverwriteRequiredError(absolutePath);
  }

  await mkdir(path.dirname(absolutePath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(absolutePath),
    `.${path.basename(absolutePath)}.tmp-${process.pid}-${Date.now()}`,
  );

  await writeFile(temporaryPath, content, 'utf8');

  try {
    await rename(temporaryPath, absolutePath);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }

  return {
    created: !existed,
    sizeBytes: Buffer.byteLength(content, 'utf8'),
  };
}

export async function listImmediateEntries(
  config: FileOpsConfig,
  inputPath: string,
  root?: string,
): Promise<{
  root: string;
  absolutePath: string;
  relativePath: string;
  entries: PathEntryMetadata[];
}> {
  const access = resolvePathAccess(config, inputPath, root);
  const directoryStats = await stat(access.absolutePath).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') {
      throw createPathNotFoundError(access.absolutePath);
    }

    throw error;
  });

  if (!directoryStats.isDirectory()) {
    throw new AppError('VALIDATION_ERROR', 'Target path must be a directory.', {
      details: { absolutePath: access.absolutePath },
      expose: true,
    });
  }

  const dirents = await readdir(access.absolutePath, { withFileTypes: true });
  const entries: PathEntryMetadata[] = [];

  for (const dirent of dirents) {
    const childAbsolutePath = path.join(access.absolutePath, dirent.name);

    try {
      const childAccess = resolvePathAccess(config, childAbsolutePath);

      entries.push(await toEntryMetadata(access.root, childAccess.absolutePath, dirent.name));
    } catch (error) {
      if (error instanceof AppError && error.code === 'PERMISSION_DENIED') {
        continue;
      }

      throw error;
    }
  }

  entries.sort((left, right) => left.name.localeCompare(right.name));

  return {
    root: access.root,
    absolutePath: access.absolutePath,
    relativePath: access.relativePath,
    entries,
  };
}

async function walkDirectoryRecursive(
  config: FileOpsConfig,
  root: string,
  currentPath: string,
  depth: number,
  options: Required<Omit<WalkOptions, 'root'>>,
  results: WalkEntry[],
): Promise<void> {
  const dirents = await readdir(currentPath, { withFileTypes: true });

  for (const dirent of dirents) {
    const absolutePath = path.join(currentPath, dirent.name);
    let metadata: PathEntryMetadata;

    try {
      const access = resolvePathAccess(config, absolutePath);
      metadata = await toEntryMetadata(root, access.absolutePath, dirent.name);
    } catch (error) {
      if (error instanceof AppError && error.code === 'PERMISSION_DENIED') {
        continue;
      }

      throw error;
    }

    const includeEntry =
      (metadata.kind === 'directory' && options.includeDirectories) ||
      (metadata.kind !== 'directory' && options.includeFiles);

    if (includeEntry) {
      results.push({
        ...metadata,
        depth,
      });
    }

    if (results.length >= options.maxResults) {
      return;
    }

    if (options.recursive && dirent.isDirectory()) {
      await walkDirectoryRecursive(config, root, absolutePath, depth + 1, options, results);

      if (results.length >= options.maxResults) {
        return;
      }
    }
  }
}

export async function walkDirectory(
  config: FileOpsConfig,
  inputPath: string,
  options: WalkOptions = {},
): Promise<{ root: string; absolutePath: string; relativePath: string; entries: WalkEntry[] }> {
  const access = resolvePathAccess(config, inputPath, options.root);
  const directoryStats = await stat(access.absolutePath).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') {
      throw createPathNotFoundError(access.absolutePath);
    }

    throw error;
  });

  if (!directoryStats.isDirectory()) {
    throw new AppError('VALIDATION_ERROR', 'Target path must be a directory.', {
      details: { absolutePath: access.absolutePath },
      expose: true,
    });
  }

  const resolvedOptions: Required<Omit<WalkOptions, 'root'>> = {
    recursive: options.recursive ?? true,
    maxResults: options.maxResults ?? config.security.maxSearchResults,
    includeFiles: options.includeFiles ?? true,
    includeDirectories: options.includeDirectories ?? true,
  };
  const entries: WalkEntry[] = [];

  await walkDirectoryRecursive(
    config,
    access.root,
    access.absolutePath,
    1,
    resolvedOptions,
    entries,
  );

  return {
    root: access.root,
    absolutePath: access.absolutePath,
    relativePath: access.relativePath,
    entries,
  };
}

function escapeRegExp(text: string): string {
  return text.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

export function createGlobMatcher(pattern: string, caseSensitive: boolean): RegExp {
  const normalizedPattern = pattern.replaceAll('\\', '/');
  let source = '^';

  for (let index = 0; index < normalizedPattern.length; index += 1) {
    const character = normalizedPattern[index] ?? '';
    const nextCharacter = normalizedPattern[index + 1];

    if (character === '*' && nextCharacter === '*') {
      source += '.*';
      index += 1;
      continue;
    }

    if (character === '*') {
      source += '[^/]*';
      continue;
    }

    if (character === '?') {
      source += '[^/]';
      continue;
    }

    source += escapeRegExp(character);
  }

  source += '$';

  return new RegExp(source, caseSensitive ? undefined : 'i');
}

export function normalizeRelativePathForMatch(relativePath: string): string {
  return relativePath.replaceAll(path.sep, '/');
}

export function extractMatchLines(content: string): string[] {
  return content.split(/\r\n|\n/);
}
