# Architecture Direction

## Goal

Build a thin MCP server focused on file operations for coding agents while delegating generic MCP runtime concerns to `@vaur94/mcpbase`.

## Direction

- standalone repository
- backend-only project
- package-based foundation, not a copied template
- tool-first domain design with a strict filesystem safety layer
- narrow v1 scope, then expand only after protocol and safety validation

## Architectural shape

Expected source layout once implementation starts:

```text
src/
  config/
  security/
  services/filesystem/
  tools/
  index.ts
tests/
  fixtures/
  integration/
  protocol/
  unit/
examples/
docs/
```

## Layer boundaries

- `src/config`: runtime config schema, defaults, env/CLI mapping
- `src/security`: root/path policy, normalization, guards, redaction helpers
- `src/services/filesystem`: low-level filesystem primitives and safe wrappers
- `src/tools`: MCP tool definitions only
- `src/index.ts`: bootstrap and runtime wiring

## Explicit non-goals

- do not re-implement MCP runtime internals already covered by `mcpbase`
- do not add shell-command execution
- do not start with multi-transport complexity
- do not mix generic filesystem helpers and MCP tool definitions in the same module

## Transport decision

v1 should support `stdio` only.

Rationale:

- smallest viable transport surface
- lowest security and configuration overhead
- aligns with common agent-host usage
- reduces early test matrix size

Streamable HTTP can be evaluated later as a separate design decision and implementation slice.
