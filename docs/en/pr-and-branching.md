# PR and Branching

Türkçe sürüm: [docs/tr/pr-and-branching.md](../tr/pr-and-branching.md)

This repository accepts changes through pull requests and protects `main` on GitHub.

## Current repository reality

- `main` is the default branch
- branch protection is enabled on `main`
- required checks include CI and CodeQL
- pull requests are expected to keep documentation aligned when behavior changes

## Pull request expectations

- keep changes focused and reviewable
- run `npm run ci:check` before opening or updating a PR
- update English and Turkish documentation together when relevant
- explain security or release impact when the change touches those areas

## Commit style in this repository

The recent repository history uses English semantic commit messages such as:

- `feat: ...`
- `docs: ...`
- `ci: ...`
- `chore(deps...): ...`

## Related files

- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`
- `CONTRIBUTING.md`
- `SECURITY.md`

Last updated: 2026-03-10
