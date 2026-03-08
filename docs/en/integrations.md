# 🔌 Integrations

## Common launch model

Every MCP client needs the same core inputs:

- the stdio command to launch the server
- a config file path
- a root allowlist configured under `security.roots`

Canonical command:

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

## Recommended local setup

```bash
./scripts/setup-local.sh /absolute/project/root /absolute/path/to/mcp-fileops.config.json
```

## OpenCode

Use the `mcp` block with a local command array:

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

## Codex

CLI shortcut:

```bash
codex mcp add mcp-fileops -- node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

`config.toml` shape:

```toml
[mcp_servers.mcp-fileops]
command = "node"
args = [
  "/absolute/path/to/mcp-fileops/bin/cli.js",
  "--config",
  "/absolute/path/to/mcp-fileops.config.json"
]
```

## Antigravity

Use an `mcpServers` entry with stdio command arguments:

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

## Integration checks

After wiring a client, verify that it can:

- list the server tools
- call `get_path_info`
- enforce the configured root boundaries
