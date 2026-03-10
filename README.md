# mcp-fileops

> English | [Turkce](./README.tr.md)

`mcp-fileops` is a focused MCP filesystem server for AI coding agents. It runs over `stdio`, is built on top of `@vaur94/mcpbase`, and ships a safe, deny-by-default file operations surface for real repositories.

## ✨ Highlights

- full v1 stdio tool surface is implemented and tested
- strict root allowlist security model
- shared filesystem and policy layers separated from MCP tool definitions
- unit, integration, protocol, coverage, and CI verification in place
- bilingual repository documentation in English and Turkish

## 🚀 Quick Start

Requirements:

- Node.js `>=22.14.0`
- `npm >=10`

```bash
git clone https://github.com/vaur94/mcp-fileops.git
cd mcp-fileops
./scripts/setup-local.sh /absolute/project/root ./mcp-fileops.config.json
```

The setup script:

- installs dependencies with `npm ci`
- builds the project with `npm run build`
- creates a config file if it does not already exist
- prints the exact stdio command for your MCP client

Expected launch command:

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

## 🧰 Implemented Tools

Read-only tools:

- `list_directory`
- `get_path_info`
- `read_file`
- `read_files`
- `find_paths`
- `search_text`

Mutating tools:

- `write_file`
- `replace_in_file`
- `apply_batch_edits`
- `create_directory`
- `move_path`

## 🛡️ Core Guarantees

- deny by default
- access only within configured absolute roots
- no shell execution
- no file-content logging by default
- `stdio` only in v1

## 📚 Documentation

Repository docs are now split cleanly by language.

English:

- [Repository docs home](./docs/README.md)
- [Getting started](./docs/en/getting-started.md)
- [Architecture](./docs/en/architecture.md)
- [Configuration](./docs/en/configuration.md)
- [Tools](./docs/en/tools.md)
- [Security](./docs/en/security.md)
- [Integrations](./docs/en/integrations.md)
- [Testing](./docs/en/testing.md)
- [Development](./docs/en/development.md)
- [mcpbase compatibility](./docs/en/mcpbase-compatibility.md)
- [PR and branching](./docs/en/pr-and-branching.md)
- [Release process](./docs/en/release-process.md)
- [Troubleshooting](./docs/en/troubleshooting.md)

Turkish:

- [Dokumantasyon ana sayfasi](./docs/README.tr.md)
- [Baslangic rehberi](./docs/tr/getting-started.md)
- [Mimari](./docs/tr/architecture.md)
- [Yapilandirma](./docs/tr/configuration.md)
- [Araclar](./docs/tr/tools.md)
- [Guvenlik](./docs/tr/security.md)
- [Entegrasyonlar](./docs/tr/integrations.md)
- [Testler](./docs/tr/testing.md)
- [Gelistirme](./docs/tr/development.md)
- [mcpbase uyumlulugu](./docs/tr/mcpbase-compatibility.md)
- [PR ve branching](./docs/tr/pr-and-branching.md)
- [Release sureci](./docs/tr/release-process.md)
- [Sorun giderme](./docs/tr/troubleshooting.md)

## 🧪 Verification

Primary validation commands:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:coverage
npm run test:protocol
npm run ci:check
```

CI runs on pushes to `main` and on pull requests via `.github/workflows/ci.yml`.

## 🔗 Related Files

- [Security policy](./SECURITY.md)
- [Contributing guide](./CONTRIBUTING.md)
- [Support](./SUPPORT.md)
- [Release notes policy](./RELEASE.md)
- [Changelog](./CHANGELOG.md)
- [Agent context](./AGENTS.md)

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for the full text.

Last updated: 2026-03-10
