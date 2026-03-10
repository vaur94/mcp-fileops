# 🚀 Getting Started

Türkçe sürüm: [docs/tr/getting-started.md](../tr/getting-started.md)

## Requirements

- Node.js `>=22.14.0`
- npm `>=10`
- a local directory you want to expose through `security.roots`

## Fastest setup path

```bash
git clone https://github.com/vaur94/mcp-fileops.git
cd mcp-fileops
./scripts/setup-local.sh /absolute/project/root ./mcp-fileops.config.json
```

## What the setup script does

- verifies Node.js and npm are available
- enforces the supported Node.js baseline
- resolves the target root and config path to absolute paths
- runs `npm ci`
- runs `npm run build`
- writes a starter config file if one does not already exist

## Canonical launch command

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

`bin/cli.js` loads `dist/index.js`, so a build must exist before the server is launched directly.

## Recommended next reads

- [Configuration](./configuration.md)
- [Integrations](./integrations.md)
- [Security](./security.md)

Last updated: 2026-03-10
