# Decision 0001: Foundation and Initial Scope

## Status

Accepted

## Context

`mcp-fileops` starts from an empty repository. The project needs a production-oriented MCP server baseline without copying the `vaur94/mcpbase` reference codebase. The public GitHub repository is the design reference, while the npm package `@vaur94/mcpbase` is the installable foundation. GitHub may be ahead of npm, which creates a provenance risk if planning assumes unreleased APIs.

## Decision

`mcp-fileops` will:

- remain a standalone repository
- use the `vaur94/mcpbase` GitHub repository as the primary architectural reference
- use `@vaur94/mcpbase@1.3.0` from npm as the implementation baseline
- target Node.js `>=22.14.0` and `npm`
- support `stdio` transport only in v1
- stay backend-only
- ship a minimal high-value file tool set before considering broader capabilities
- defer destructive tools and HTTP transport
- define and implement the filesystem security model before tool expansion

## Consequences

Positive:

- lower bootstrap effort
- lower maintenance burden
- smaller early security surface
- cleaner separation between MCP runtime concerns and domain logic

Negative:

- initial scope is intentionally narrower
- some ideas from the local `mcpbase` main branch may not be available immediately
- HTTP and destructive workflows require future decisions and slices

## Follow-up decisions

Next decisions likely needed:

- release automation timing
- whether `delete_path` belongs in v1.x
- whether structured JSON/YAML edits justify extra dependencies
- whether cross-platform Windows support is required in the first release
