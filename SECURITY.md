# Security

`mcp-fileops` is a filesystem-facing MCP server. Security-sensitive behavior is documented in [docs/security.md](./docs/security.md).

Current security priorities:

- deny by default
- allowlisted roots only
- no shell execution
- no file-content logging by default
