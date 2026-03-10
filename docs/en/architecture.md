# 🏗️ Architecture

Türkçe sürüm: [docs/tr/architecture.md](../tr/architecture.md)

## Goal

`mcp-fileops` keeps MCP runtime concerns delegated to `@vaur94/mcpbase` while implementing project-specific filesystem safety, tool behavior, and testing inside this repository.

## Runtime flow

1. `bin/cli.js` imports the built bundle from `dist/index.js`
2. `src/index.ts` loads config with `loadConfig`
3. `src/index.ts` creates a `StderrLogger`
4. `src/index.ts` creates an `ApplicationRuntime`
5. `src/tools/index.ts` registers the full v1 tool surface
6. `createMcpServer` and `startStdioServer` expose the server over `stdio`

## Source layout

```text
src/
  config/
  errors/
  security/
  services/filesystem/
  tools/
  index.ts
tests/
  unit/
  integration/
  protocol/
```

## Layer boundaries

- `src/config`: schema and defaults
- `src/errors`: domain-specific filesystem errors
- `src/security`: root policy and mutation guards
- `src/services/filesystem`: reusable filesystem logic per capability
- `src/tools`: MCP tool definitions only
- `src/index.ts`: bootstrap entry and exports

## Architectural constraints

- do not copy runtime code from `mcpbase`
- keep filesystem services independent of MCP tool wrappers
- keep v1 transport limited to `stdio`
- do not add shell execution into the server

Last updated: 2026-03-10
