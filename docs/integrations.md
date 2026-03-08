# Integration Guide

This guide explains how to run `mcp-fileops` as a local stdio MCP server and how to point MCP-capable clients at it.

## What the client needs

Every MCP client ultimately needs the same information:

- a command to launch the server
- an optional working directory
- a config file that sets the allowed roots

For a local checkout of this repository, the canonical command is:

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

## Recommended local setup

Run the setup script from the repository root:

```bash
./scripts/setup-local.sh /absolute/project/root /absolute/path/to/mcp-fileops.config.json
```

What it does:

- installs dependencies with `npm ci`
- builds the server with `npm run build`
- writes a ready-to-edit config file if one does not already exist

## Config file

Example config:

```json
{
  "server": {
    "name": "mcp-fileops",
    "version": "0.1.0"
  },
  "logging": {
    "level": "info",
    "includeTimestamp": true
  },
  "security": {
    "readOnly": false,
    "roots": ["/absolute/project/root"],
    "allowHiddenPaths": false,
    "followSymlinks": false,
    "maxFileBytes": 1048576,
    "maxBatchEdits": 100,
    "maxSearchResults": 200
  },
  "features": {
    "writeFile": true,
    "replaceInFile": true,
    "applyBatchEdits": true,
    "createDirectory": true,
    "movePath": true
  }
}
```

## Verification

After wiring the client, verify that it can:

- list the server tools
- call `get_path_info`
- see the configured `roots` boundary enforced

The repository protocol tests use this same stdio model in `tests/protocol/stdio.protocol.test.ts`.

## OpenCode

OpenCode documents MCP servers under the `mcp` key in its config, with local servers using `type: "local"` and a command array.

Example snippet:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp-fileops": {
      "type": "local",
      "command": [
        "node",
        "/absolute/path/to/mcp-fileops/bin/cli.js",
        "--config",
        "/absolute/path/to/mcp-fileops.config.json"
      ],
      "enabled": true
    }
  }
}
```

Notes:

- `command` is an array, not a single shell string
- `enabled` can be omitted, but leaving it explicit is clearer
- if you need environment variables, confirm the supported shape in your current OpenCode docs before adding them

## Codex

Codex supports MCP in both the CLI and the IDE extension.

### Codex CLI shortcut

```bash
codex mcp add mcp-fileops -- node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

### Codex `config.toml`

```toml
[mcp_servers.mcp-fileops]
command = "node"
args = [
  "/absolute/path/to/mcp-fileops/bin/cli.js",
  "--config",
  "/absolute/path/to/mcp-fileops.config.json"
]
```

Notes:

- add optional fields such as `cwd`, timeouts, or environment only when you have a client-specific need and have checked the current Codex docs
- after registration, use `/mcp` inside Codex to inspect active MCP servers

## Antigravity

Public Antigravity examples use an `mcpServers` object with stdio process definitions.

Example snippet:

```json
{
  "mcpServers": {
    "mcp-fileops": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-fileops/bin/cli.js",
        "--config",
        "/absolute/path/to/mcp-fileops.config.json"
      ]
    }
  }
}
```

Notes:

- in the Antigravity MCP manager flow, open the raw config editor and add the server under `mcpServers`
- if you maintain multiple MCP servers, keep `mcp-fileops` as a distinct entry name so it is easy to identify in the UI
- public first-party documentation is still limited; the raw-config pattern here matches documented Antigravity integration examples that expose `mcpServers`, `command`, and `args`

## Recommended command values

If you use the repository checkout directly, prefer:

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

This is the command path exercised by the repository protocol tests.

## Source notes

The examples in this guide are based on:

- OpenCode MCP server docs describing `mcp` config with `type: "local"` and `command` arrays
- OpenAI Codex MCP docs describing `codex mcp add` and `[mcp_servers.<name>]` tables in `config.toml`
- Antigravity raw-config examples using `mcpServers` with `command` and `args`
