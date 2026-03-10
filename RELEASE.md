# Release

> English | [Turkce](./RELEASE.tr.md)

`mcp-fileops` now includes a GitHub Actions workflow for npm trusted publishing, but the package still requires one manual first publish before trusted publishing can take over.

## Current release baseline

- conventional commit history in English
- changelog maintenance
- GitHub Actions CI gate on `main` and pull requests
- npm package metadata already defined in `package.json`
- `.github/workflows/publish.yml` for OIDC-based npm publish

## First publish requirements

The first manual publish has already been completed for this repository. The package now exists on npm, and trusted publishing is the default path for later releases.

For reference, the initial bootstrap sequence was:

1. authenticate locally with your npm account
2. run `npm run ci:check`
3. run `npm publish --access public`
4. confirm the package exists with `npm view mcp-fileops version name repository homepage --json`

The trusted publisher mapping is configured for:

- owner: `vaur94`
- repository: `mcp-fileops`
- workflow file: `publish.yml`
- environment: leave empty unless the workflow is later changed to use one

Recommended command:

```bash
npx -y npm@11.11.0 trust github mcp-fileops --repo vaur94/mcp-fileops --file publish.yml
```

## Trusted publish flow

After the trusted publisher mapping exists:

- `workflow_dispatch` can run a dry run by leaving `publish` as `false`
- a published GitHub release triggers `npm publish --provenance --access public`
- manual `workflow_dispatch` can publish with a chosen dist-tag when `publish` is set to `true`
- the release workflow verifies that the GitHub release tag matches `package.json` as `v<version>` before publishing

## Workflow guarantees

- `id-token: write` is enabled for npm OIDC trusted publishing
- `fetch-depth: 0` preserves history and tags for release operations
- `npm run ci:check` and `npm run pack:dry-run` run before publish
- publish uses `--provenance --access public`

## Verification

Use these commands when validating release readiness:

```bash
npm audit --json
npm run ci:check
npm run pack:dry-run
gh run list --workflow publish.yml --limit 5 --repo vaur94/mcp-fileops
gh release list --repo vaur94/mcp-fileops --limit 5
```

For implementation details, see:

- [English development guide](./docs/en/development.md)
- [Turkish development guide](./docs/tr/development.md)

Last updated: 2026-03-10
