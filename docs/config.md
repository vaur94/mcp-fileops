# Configuration Contract

This document describes the current runtime config surface for the implemented v1 server.

## Current config concepts

- server identity
- logging settings
- root allowlist
- read-only mode
- size and search limits
- mutating-tool feature flags

## Current config shape

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
    "createDirectory": true,
    "movePath": true
  }
}
```

## Environment and CLI policy

Implemented precedence:

1. defaults
2. config file
3. environment variables
4. CLI overrides

Implemented environment prefix:

- `MCP_FILEOPS_`

Examples:

- `MCP_FILEOPS_LOG_LEVEL=debug`
- `MCP_FILEOPS_READ_ONLY=true`

## Open items

- whether `roots` should allow named profiles or remain a flat list
- whether `maxFileBytes` should vary between read and write operations
- whether feature flags should eventually exist for read-only tools or remain mutating-only
- whether telemetry should remain runtime-injected only or gain a local config surface later
