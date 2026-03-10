# PROJECT KNOWLEDGE BASE

**Updated:** 2026-03-08
**Branch:** main

## OVERVIEW

`mcp-fileops` is a TypeScript MCP server for safe filesystem workflows. It builds on `@vaur94/mcpbase@1.3.0`, exposes the full v1 stdio tool surface, and keeps security, filesystem logic, and MCP tool definitions separated.

## STRUCTURE

```text
./
├── src/
│   ├── config/
│   ├── errors/
│   ├── security/
│   ├── services/filesystem/
│   └── tools/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── protocol/
├── docs/
│   ├── en/
│   └── tr/
├── .github/workflows/
├── bin/
├── examples/
└── scripts/
```

## WHERE TO LOOK

| Topic           | Location                           | Notes                                              |
| --------------- | ---------------------------------- | -------------------------------------------------- |
| Bootstrap       | `src/index.ts`                     | Loads config, creates runtime, starts stdio server |
| Config schema   | `src/config/schema.ts`             | Extends `mcpbase` runtime config                   |
| Config defaults | `src/config/defaults.ts`           | Canonical defaults                                 |
| Tool registry   | `src/tools/index.ts`               | Registers all v1 tools                             |
| CLI entrypoint  | `bin/cli.js`                       | Thin wrapper around `dist/index.js`                |
| Sample config   | `examples/mcp-fileops.config.json` | Ready-to-copy config shape                         |
| Setup helper    | `scripts/setup-local.sh`           | Local install/build/config bootstrap               |
| Docs            | `docs/en/`, `docs/tr/`             | Bilingual product documentation                    |

## CONVENTIONS

- ESM-only package
- Node.js `>=22.14.0`
- npm `>=10`
- env prefix: `MCP_FILEOPS_`
- default config file: `mcp-fileops.config.json`
- transport scope: `stdio` only in v1
- strict coverage gates: lines/functions/statements `90`, branches `80`

## ANTI-PATTERNS

- do not copy source from `vaur94/mcpbase`
- do not add shell execution to v1
- do not weaken root-boundary enforcement
- do not mix filesystem services with MCP tool definitions
- do not log file contents by default

## PRIMARY COMMANDS

```bash
npm run build
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run test:coverage
npm run test:protocol
npm run ci:check
```

## DOCS MAP

- English docs home: `docs/README.md`
- Turkish docs home: `docs/README.tr.md`
- Root readmes: `README.md`, `README.tr.md`

## NOTES

- `bin/cli.js` requires the built bundle in `dist/index.js`
- `.github/workflows/ci.yml` runs `npm run ci:check`
- documentation is intentionally bilingual; English and Turkish files should stay aligned

Last updated: 2026-03-10
