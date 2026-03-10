# 🧩 mcpbase Compatibility

Türkçe sürüm: [docs/tr/mcpbase-compatibility.md](../tr/mcpbase-compatibility.md)

## Compatibility target

`mcp-fileops` is implemented against the published npm package `@vaur94/mcpbase@1.3.0`.

## Verified usage pattern

- `src/config/schema.ts` extends runtime config with `createRuntimeConfigSchema`
- `src/index.ts` loads config with `loadConfig`
- `src/index.ts` creates an `ApplicationRuntime`
- `src/index.ts` creates the MCP server with `createMcpServer`
- `src/index.ts` starts the server with `startStdioServer`

## Rules for future work

- rely on package exports, not copied source
- treat GitHub-only upstream material as reference unless it is verified against the published package version
- document any future compatibility upgrade explicitly

Last updated: 2026-03-10
