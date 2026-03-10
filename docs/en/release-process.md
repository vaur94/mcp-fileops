# Release Process

Türkçe sürüm: [docs/tr/release-process.md](../tr/release-process.md)

`mcp-fileops` uses GitHub Actions for release verification and npm trusted publishing.

## Current release model

- the package `mcp-fileops` already exists on npm
- trusted publisher mapping is configured for `publish.yml`
- `Publish Package` verifies the repository before any publish step
- a published GitHub release triggers `npm publish --provenance --access public`

## Release prerequisites

- `package.json` version is updated intentionally
- changelog is updated when needed
- `main` is green on CI and CodeQL
- the release tag matches the package version as `v<version>`

## Verified workflow files

- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/publish.yml`

## Publish workflow behavior

- `workflow_dispatch` with `publish=false` acts as a dry run
- `workflow_dispatch` with `publish=true` can publish with a chosen npm dist-tag
- `release.published` performs the normal trusted publish path

## Manual checks

```bash
npm audit --json
npm run ci:check
npm run pack:dry-run
gh run list --workflow publish.yml --limit 5 --repo vaur94/mcp-fileops
gh release list --repo vaur94/mcp-fileops --limit 5
```

## Notes

- the first manual npm publish has already been completed for this repository
- later publishes should use the trusted publishing workflow, not a long-lived `NPM_TOKEN`

Last updated: 2026-03-10
