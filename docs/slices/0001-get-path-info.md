# Slice 0001: `get_path_info`

## Goal

Deliver the first real filesystem tool as a narrow vertical slice that proves the project scaffold is sufficient for tool work.

The first slice should implement `get_path_info` rather than a larger file-reading tool because it exercises root enforcement, path normalization, structured results, and protocol registration with lower destructive risk.

## Scope

In scope:

- root/path policy helpers for allowed-root enforcement
- path normalization and traversal rejection
- `get_path_info` tool definition and registration
- unit, integration, and protocol coverage for the tool and security boundary

Out of scope:

- directory listing
- file reads
- mutating operations
- cross-root behavior beyond explicit rejection

## Files likely involved

- `src/security/` for root/path helpers
- `src/services/filesystem/` for safe stat-style filesystem access
- `src/tools/index.ts` for registration
- `src/tools/get-path-info.ts` for the MCP tool definition
- `tests/unit/` for helper and tool-shape tests
- `tests/integration/` for runtime execution tests
- `tests/protocol/` for stdio-level tool visibility/call coverage

## Expected behavior

`get_path_info` should:

- accept one path input
- resolve the path against an allowed root context
- reject traversal attempts and root escapes
- return whether the path exists
- return normalized metadata suitable for follow-up agent decisions
- avoid reading file contents

## Security requirements

- deny by default when no allowed root covers the resolved path
- reject normalized paths that escape an allowed root
- respect `followSymlinks` policy
- respect `allowHiddenPaths` policy where relevant to path inspection
- avoid leaking file contents in logs or errors

## Test plan

Unit tests:

- config-driven security helper behavior
- path normalization and root-boundary checks
- tool output shape for existing and missing paths

Integration tests:

- runtime executes `get_path_info` successfully with an allowed path
- runtime rejects a disallowed path with a normalized error

Protocol tests:

- stdio client sees `get_path_info` in `tools/list`
- stdio client can call `get_path_info` against a test fixture path

## Success criteria

- the tool is registered in the stdio server
- root enforcement exists in executable code, not only docs
- `npm run typecheck`, `npm run test`, and `npm run test:protocol` all pass
- the slice stays within the narrow vertical-slice rule from `docs/plan.md`

## Follow-on slices

If this slice lands cleanly, the next read-only tool should likely be `list_directory` or `read_file`, both reusing the same root/path policy layer.
