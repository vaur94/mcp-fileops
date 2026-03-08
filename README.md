# mcp-fileops

`mcp-fileops` is a standalone MCP server project for high-value file and directory workflows used by AI coding agents in real repositories.

Status: v1 tool surface implemented. The repository now includes the full planned stdio tool set, shared security/filesystem services, unit/integration/protocol coverage, and a GitHub Actions CI workflow.

## Foundation

- Reference GitHub repository: `https://github.com/vaur94/mcpbase`
- Reference npm package: `@vaur94/mcpbase`
- Runtime foundation: `@vaur94/mcpbase`
- Usage model: install and extend the package, never copy its source
- Design reference: the public `vaur94/mcpbase` GitHub repository
- Installable baseline for implementation: npm-published `@vaur94/mcpbase@1.3.0`
- Reason: GitHub can lead npm; implementation should not assume unreleased APIs

## Initial scope

The v1 server should stay intentionally small and focus on the workflows coding agents use most often:

- safe directory listing and path inspection
- fast text file reads
- project-wide path discovery and text search
- deterministic file writes
- safe search-and-replace style edits
- batched edit workflows
- standard directory creation and path moves

Explicitly out of scope for the first implementation pass:

- shell execution
- copied `mcpbase` runtime code
- AST-heavy language-specific refactors
- broad destructive operations as a default capability
- HTTP transport unless a later slice justifies it

## Locked decisions

- Package foundation: `@vaur94/mcpbase@1.3.0`
- Runtime target: Node.js `>=22.14.0`
- Package manager: `npm`
- Transport scope for v1: `stdio` only
- Platform target for v1: Linux and macOS first
- Security model: deny by default, root allowlist required for all file access
- Logging rule: never log file contents by default
- Publishing: prepare for npm/GitHub release parity, but do not wire release automation until bootstrap is complete

## Document map

- [Architecture](./docs/architecture.md)
- [Tool Inventory](./docs/tools.md)
- [Configuration](./docs/config.md)
- [Security Model](./docs/security.md)
- [Integration Guide](./docs/integrations.md)
- [mcpbase Compatibility](./docs/mcpbase-compatibility.md)
- [Execution Plan](./docs/plan.md)
- [First Vertical Slice](./docs/slices/0001-get-path-info.md)
- [Decision 0001](./docs/decisions/0001-foundation-and-scope.md)

## Quick Start

The fastest reliable path today is a local checkout setup.

Requirements:

- Node.js `>=22.14.0`
- `npm`

1. Clone the repository.
2. Run the setup script.
3. Point your MCP client at the generated stdio command.

```bash
git clone https://github.com/vaur94/mcp-fileops.git
cd mcp-fileops
./scripts/setup-local.sh /absolute/project/root ./mcp-fileops.config.json
```

This prepares a local build and prints the exact command to register in your MCP client:

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

Pass an absolute target repository root as the first script argument if you want to scope access to a different directory.

## Easy Client Integration

For `OpenCode`, `Codex`, and `Antigravity`, the important part is the same stdio launch command plus a config file that sets `security.roots` correctly. The client-specific walkthroughs live in [`docs/integrations.md`](./docs/integrations.md).

## Implemented tools

- `list_directory`
- `get_path_info`
- `read_file`
- `read_files`
- `find_paths`
- `search_text`
- `write_file`
- `replace_in_file`
- `apply_batch_edits`
- `create_directory`
- `move_path`

## Verification surface

- `npm run ci:check`
- `.github/workflows/ci.yml`
- unit tests for security, filesystem services, and tool definitions
- integration tests for runtime execution and read-only mode rejection
- stdio protocol tests that list and exercise the full v1 tool surface

## Next step

The next practical scope after v1 is selective expansion rather than more core bootstrap work:

1. refine edge-case semantics for existing tools only when production usage reveals gaps
2. document or add deferred destructive tools like `delete_path` and `copy_path` only with recovery semantics
3. evaluate release automation once publish intent is active
