# ⚙️ Configuration

## Defaults

The runtime default config is defined in `src/config/defaults.ts`.

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
    "roots": [],
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

## Config schema

The repo extends `mcpbase` runtime config with:

- `security.readOnly`
- `security.roots`
- `security.allowHiddenPaths`
- `security.followSymlinks`
- `security.maxFileBytes`
- `security.maxBatchEdits`
- `security.maxSearchResults`
- per-tool mutating feature flags under `features`

## Resolution order

Runtime precedence is:

1. defaults
2. config file
3. environment variables
4. CLI overrides

## File and environment settings

- default config filename: `mcp-fileops.config.json`
- environment variable prefix: `MCP_FILEOPS_`

Example environment values:

- `MCP_FILEOPS_LOG_LEVEL=debug`
- `MCP_FILEOPS_READ_ONLY=true`

## Example config

See `examples/mcp-fileops.config.json` for a ready-to-copy example.
