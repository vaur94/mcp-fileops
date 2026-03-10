# 🛡️ Security Model

Türkçe sürüm: [docs/tr/security.md](../tr/security.md)

## Core rules

- deny by default
- every resolved path must stay inside an allowed root
- shell execution is out of scope
- no silent fallback behavior
- file contents must not be logged by default

## Root policy

- all operations are scoped to configured absolute roots
- traversal attempts are rejected after normalization
- cross-root moves are rejected in v1

## Symlink and hidden-path policy

- `followSymlinks` defaults to `false`
- symlinks that resolve outside an allowed root are rejected
- `allowHiddenPaths` defaults to `false`

## Content policy

- v1 is text-first
- binary files should be rejected with clear errors
- `maxFileBytes` provides conservative size limits
- UTF-8 is the default operating assumption for text workflows

## Mutation policy

- mutating tools must fail when `security.readOnly` is enabled
- feature flags can disable individual mutating tools
- batch edit failures must be explicit and structured

## Logging policy

- logs go to stderr
- logs can include metadata, timing, and counts
- logs should not include raw file contents by default

Last updated: 2026-03-10
