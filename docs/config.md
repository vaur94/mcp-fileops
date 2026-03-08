# Configuration Contract

This is the planned runtime surface for v1. It should be implemented before tool code expands.

## Required concepts

- server identity
- logging settings
- root allowlist
- read-only mode
- size and search limits
- optional telemetry

## Planned config shape

```json
{
  "server": {
    "name": "mcp-fileops",
    "version": "0.1.0"
  },
  "logging": {
    "level": "info",
    "includeTimestamp": true,
    "redactFileContent": true
  },
  "security": {
    "readOnly": false,
    "roots": ["/absolute/project/path"],
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
    "movePath": true
  }
}
```

## Environment and CLI policy

Planned precedence:

1. defaults
2. config file
3. environment variables
4. CLI overrides

Planned environment prefix:

- `MCP_FILEOPS_`

Examples:

- `MCP_FILEOPS_LOG_LEVEL=debug`
- `MCP_FILEOPS_READ_ONLY=true`

## Open items

- whether `roots` should allow named profiles or remain a flat list
- whether `maxFileBytes` should vary between read and write operations
- whether feature flags should exist for read-only tools or only mutating tools
