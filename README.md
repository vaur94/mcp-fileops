# mcp-fileops

`mcp-fileops` is a standalone MCP server project for high-value file and directory workflows used by AI coding agents in real repositories.

Status: pre-implementation. This repository currently contains decision artifacts only. Tool implementation has not started yet.

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
- [Execution Plan](./docs/plan.md)
- [Decision 0001](./docs/decisions/0001-foundation-and-scope.md)

## Next step

The next implementation slice should create the repository bootstrap only:

1. package metadata and scripts
2. TypeScript, ESLint, Prettier, and test scaffolding
3. config schema shell
4. no tool logic yet
