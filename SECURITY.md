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

Please use GitHub private vulnerability reporting when you believe you have found a security issue in `mcp-fileops`.

Recommended process:

1. open the repository Security tab
2. create a private vulnerability report or security advisory draft
3. include impact, affected paths, reproduction steps, and any suggested mitigation
4. avoid opening a public issue for exploitable findings before maintainers respond

If private reporting is temporarily unavailable, contact the maintainer through GitHub and avoid publishing exploit details until a fix or mitigation exists.

Last updated: 2026-03-10
