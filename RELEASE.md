# Release

> English | [Turkce](./RELEASE.tr.md)

Release automation is still intentionally deferred. The repository is ready for disciplined releases, but publishing automation should only be added when maintainers explicitly decide to ship packages regularly.

## Current release baseline

- conventional commit history in English
- changelog maintenance
- GitHub Actions CI gate on `main` and pull requests
- npm package metadata already defined in `package.json`

## Before enabling automation

- confirm publish ownership and package release intent
- document versioning and rollback policy
- define changelog and release note ownership
- decide whether GitHub releases and npm publishes should be coupled

For implementation details, see:

- [English development guide](./docs/en/development.md)
- [Turkish development guide](./docs/tr/development.md)
