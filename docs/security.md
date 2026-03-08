# Security Model

`mcp-fileops` is a filesystem-facing MCP server. Its security model must be defined before tool implementation.

## Core policy

- deny by default
- every accessed path must resolve under an allowed root
- no shell execution
- no silent fallback behavior
- no file-content logging by default

## Root policy

- all tools operate only within configured absolute roots
- relative input paths are resolved against the active root context
- normalized paths that escape the root are rejected
- cross-root moves are rejected in v1 unless explicitly designed later

## Path and symlink policy

- normalize every input path before access
- reject traversal attempts such as `..` escapes after normalization
- default `followSymlinks` is `false`
- symlinks that resolve outside an allowed root are rejected

## Hidden files policy

- default `allowHiddenPaths` is `false`
- hidden files and directories require explicit opt-in

## File content policy

- v1 is text-first
- binary files should be detected and rejected with a clear error
- default read/write file size limit should be conservative
- newline handling should preserve the existing file style when editing an existing text file
- encoding support for v1 should default to UTF-8 only

## Mutation policy

- `write_file` must declare whether overwrite is allowed
- mutating tools should use atomic write patterns where practical
- partial failures in batch edits must be surfaced explicitly
- destructive tools are deferred until their recovery semantics are documented

## Logging and telemetry policy

- logs go to stderr only
- logs may include path metadata, counts, and timing
- logs must not include raw file contents by default
- telemetry, if enabled, should remain aggregate and content-free

## Validation requirements

The test plan must include:

- root boundary enforcement
- traversal rejection
- symlink escape rejection
- hidden-path behavior
- binary-file rejection
- file-size limit enforcement
- mutating-tool behavior in read-only mode
