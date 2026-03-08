# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-08T11:15:00Z
**Commit:** working-tree
**Branch:** main

## OVERVIEW

`mcp-fileops` is a TypeScript MCP server package focused on safe filesystem operations, built on `@vaur94/mcpbase`, with the full planned v1 stdio tool surface now implemented and verified.

## STRUCTURE

```text
./
├── src/                 # Runtime wiring, config, security, services, and tool registry
│   ├── config/
│   ├── errors/
│   ├── security/
│   ├── services/
│   └── tools/
├── tests/               # Unit, integration, and stdio protocol coverage
│   ├── unit/
│   ├── integration/
│   └── protocol/
├── .github/workflows/   # CI workflow running ci:check on push and PR
├── docs/                # Decision artifacts and implementation direction
│   └── decisions/
├── bin/                 # Published CLI entrypoint to dist bundle
└── examples/            # Sample runtime config
```

## WHERE TO LOOK

| Task                      | Location                                            | Notes                                                       |
| ------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| Runtime bootstrap flow    | `src/index.ts`                                      | Loads config, builds runtime, starts stdio server           |
| Config schema             | `src/config/schema.ts`                              | Zod extension schema wrapped by `createRuntimeConfigSchema` |
| Default config values     | `src/config/defaults.ts`                            | Source of canonical defaults and feature toggles            |
| Tool registration surface | `src/tools/index.ts`                                | Registers the full v1 tool array                            |
| CLI entrypoint            | `bin/cli.js`                                        | Dynamic import of `dist/index.js`, stderr JSON error output |
| Test strategy             | `tests/unit`, `tests/integration`, `tests/protocol` | Unit services/tools, runtime execution, stdio coverage      |
| Security direction        | `docs/security.md`, `SECURITY.md`                   | Deny-by-default and allowlisted-root model                  |
| Shared filesystem logic   | `src/services/filesystem/`                          | Common IO helpers plus per-tool service modules             |

## CONVENTIONS

- ESM-only package (`"type": "module"`) with Node `>=22.14.0`.
- Runtime config precedence is defaults -> config file -> env -> CLI.
- Environment prefix for overrides is `MCP_FILEOPS_`.
- Transport scope is `stdio` only for v1.
- Tests are split by intent: unit, integration, protocol.
- Coverage gates are strict (`lines/functions/statements: 90`, `branches: 80`).

## ANTI-PATTERNS (THIS PROJECT)

- Do not copy source code from `vaur94/mcpbase`; consume published package APIs.
- Do not add shell execution features to v1 scope.
- Do not mix filesystem service logic and MCP tool definitions in one module.
- Do not add HTTP transport before separate design decision/slice.
- Do not relax deny-by-default root enforcement semantics.
- Do not log file contents by default.

## UNIQUE STYLES

- Scope is intentionally narrow and decision-led; docs under `docs/` are authoritative for constraints.
- Shared-service progression: path policy, filesystem primitives, and tool wrappers stay separated.
- Change sizing rule from plan: keep slices roughly under 400-600 logical changed lines.

## COMMANDS

```bash
npm run dev
npm run build
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run test:protocol
npm run ci:check
```

## NOTES

- Current `src/tools/index.ts` is intentionally empty while scaffolding stabilizes.
- `bin/cli.js` expects built output at `dist/index.js`; protocol test depends on that path.
- `.github/workflows/ci.yml` uses `npm run ci:check` as the GitHub Actions gate.
- Security-sensitive requirements are duplicated in top-level docs and should stay aligned.
- Release automation is explicitly deferred (`RELEASE.md`).
