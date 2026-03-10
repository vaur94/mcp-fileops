# 🛠️ Development

Türkçe sürüm: [docs/tr/development.md](../tr/development.md)

## Local workflow

```bash
npm ci
npm run build
npm run ci:check
```

## Repository principles

- use `@vaur94/mcpbase` as a package dependency, not as copy-paste source
- keep tool definitions in `src/tools/`
- keep reusable filesystem logic in `src/services/filesystem/`
- keep policy logic in `src/security/`
- keep docs bilingual when behavior changes

## Project constraints

- Node.js `>=22.14.0`
- npm `>=10`
- v1 transport is `stdio`
- no shell execution support in the server

## Key references

- `src/index.ts`
- `src/config/schema.ts`
- `src/config/defaults.ts`
- `src/tools/index.ts`
- `examples/mcp-fileops.config.json`

Last updated: 2026-03-10
