# mcpbase Compatibility

## Normative target

`mcp-fileops` is implemented against the npm-published package `@vaur94/mcpbase@1.3.0`.

This is the authoritative compatibility target for local design and implementation decisions.

## How to use upstream material

- use the public `vaur94/mcpbase` GitHub repository as an architectural reference
- use the installed npm package surface as the implementation boundary
- do not assume GitHub `main` documents APIs that are safe to consume unless they are verified against `1.3.0`
- do not copy `mcpbase` source into this repository

## Verified local usage pattern

The current bootstrap already follows the intended downstream-consumer model:

- `src/config/schema.ts` extends `mcpbase` config via `createRuntimeConfigSchema`
- `src/index.ts` loads config with `loadConfig`
- `src/index.ts` creates a runtime with `ApplicationRuntime`
- `src/index.ts` exposes the MCP server through `createMcpServer` and `startStdioServer`
- `bin/cli.js` stays as a thin entrypoint into the built package

## Guidance for future work

- prefer package exports and documented extension points over source-level imitation
- keep `stdio` as the only transport in v1 even if upstream also supports broader transport options
- treat upstream v2 documentation as reference-only until any upgrade is explicit and verified
- document any newly adopted `mcpbase` capability before relying on it in local docs

## Upgrade rule

If `mcp-fileops` upgrades beyond `@vaur94/mcpbase@1.3.0`, update this note and re-check:

- bootstrap API assumptions
- config-loading behavior
- tool registration behavior
- security helper availability
- transport scope assumptions
