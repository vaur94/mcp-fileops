# Execution Plan

## Phase 0: Decision artifacts

- lock package provenance
- lock transport scope
- lock v1 tool scope
- lock security model
- lock config surface

## Phase 1: Repository bootstrap

- create `package.json`
- add TypeScript, ESLint, Prettier, Vitest, tsup scaffolding
- add top-level docs and GitHub community files
- add CI and dependency update baseline

Status: completed.

## Phase 2: Config and security scaffolding

- implement config schema and defaults
- implement root/path policy helpers
- implement logging redaction helpers
- define domain error taxonomy

Status: completed.
Completed:

- config schema and defaults are implemented
- root/path policy helpers
- explicit domain error taxonomy for filesystem operations
- mutating-tool guards and feature checks

## Phase 3: Runtime bootstrap

- wire `mcpbase` bootstrap
- register empty or minimal initial tool set
- add protocol smoke test shell

Status: completed.

## Phase 4: Read-only tools

- `list_directory`
- `get_path_info`
- `read_file`
- `read_files`
- `find_paths`
- `search_text`

Status: completed.

## Phase 5: Mutating tools

- `write_file`
- `replace_in_file`
- `apply_batch_edits`
- `create_directory`
- `move_path`

Status: completed.

## Phase 6: Hardening and release parity

- complete docs and examples
- finalize CI quality gates
- add release automation if publish intent stays in scope

Status: in progress.
Completed:

- docs, examples, and CI workflow reflect the implemented v1 tool surface
- `npm run ci:check` is wired into GitHub Actions via `.github/workflows/ci.yml`

Deferred:

- release automation remains intentionally out of scope until publish intent is explicit

## Slice rule

Each implementation slice should target one narrow outcome and stay below roughly 400-600 logical changed lines. If a slice grows past that threshold, split it before coding.

## Mandatory review gates

- after bootstrap
- after security/config
- after every tool slice
- before enabling release automation

## Current baseline

The repository has already moved beyond a planning-only state. The current baseline includes:

- `package.json`, build scripts, linting, formatting, and test commands
- `src/index.ts` bootstrap wiring with `ApplicationRuntime`, `createMcpServer`, and `startStdioServer`
- `src/config/schema.ts` and `src/config/defaults.ts`
- `bin/cli.js` for the published stdio entrypoint
- unit, integration, and protocol smoke tests proving bootstrap works

This means the roadmap has moved from bootstrap into stabilization, documentation accuracy, and any future post-v1 expansion slices.
