# Troubleshooting

Türkçe sürüm: [docs/tr/troubleshooting.md](../tr/troubleshooting.md)

This page covers repository-specific problems that are directly evidenced by the current setup.

## Setup script issues

### `package.json` not found during npm commands

Run package-management commands from the repository root:

```bash
cd /path/to/mcp-fileops
test -f package.json
```

### Build output missing for the CLI

`bin/cli.js` expects `dist/index.js`. Rebuild before direct CLI use:

```bash
npm run build
```

## Access and security errors

### Root-boundary rejections

If file operations fail with permission or root-boundary errors, verify that your config includes the correct absolute root under `security.roots`.

### Read-only mode behavior

Mutating tools fail by design when `security.readOnly` is enabled.

## Publish and release checks

### Trusted publishing not active

Verify:

- the npm package already exists
- trusted publisher mapping points to `publish.yml`
- the workflow has `id-token: write`

### Release tag mismatch

`Publish Package` fails release publishes when the GitHub release tag does not match `package.json` as `v<version>`.

Last updated: 2026-03-10
