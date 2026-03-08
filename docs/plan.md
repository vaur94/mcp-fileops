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

## Phase 2: Config and security scaffolding

- implement config schema and defaults
- implement root/path policy helpers
- implement logging redaction helpers
- define domain error taxonomy

## Phase 3: Runtime bootstrap

- wire `mcpbase` bootstrap
- register empty or minimal initial tool set
- add protocol smoke test shell

## Phase 4: Read-only tools

- `list_directory`
- `get_path_info`
- `read_file`
- `read_files`
- `find_paths`
- `search_text`

## Phase 5: Mutating tools

- `write_file`
- `replace_in_file`
- `apply_batch_edits`
- `create_directory`
- `move_path`

## Phase 6: Hardening and release parity

- complete docs and examples
- finalize CI quality gates
- add release automation if publish intent stays in scope

## Slice rule

Each implementation slice should target one narrow outcome and stay below roughly 400-600 logical changed lines. If a slice grows past that threshold, split it before coding.

## Mandatory review gates

- after bootstrap
- after security/config
- after every tool slice
- before enabling release automation
