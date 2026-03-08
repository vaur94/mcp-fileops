# Security

> English | [Turkce](./SECURITY.tr.md)

`mcp-fileops` is a filesystem-facing MCP server, so security is part of the product contract rather than an afterthought.

## Current policy

- deny by default
- operate only inside configured absolute roots
- reject traversal and root-escape attempts
- disable shell execution entirely
- avoid logging raw file contents by default

## Detailed model

The full security model is documented in:

- [English security documentation](./docs/en/security.md)
- [Turkish security documentation](./docs/tr/security.md)

## Reporting

This repository does not yet publish a dedicated private security contact in-document. Until a formal process is added, avoid posting exploitable details publicly before maintainers have time to assess the issue.
