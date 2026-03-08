# 🧪 Testing

## Test layers

- `tests/unit`: service, policy, config, and tool-shape behavior
- `tests/integration`: runtime execution and mode enforcement
- `tests/protocol`: stdio protocol bootstrap and end-to-end tool exercise

## Commands

```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:protocol
npm run ci:check
```

## Coverage requirements

- lines: `90`
- functions: `90`
- statements: `90`
- branches: `80`

## CI

`.github/workflows/ci.yml` runs:

1. `npm ci`
2. `npm run ci:check`

The CI workflow is triggered on pushes to `main` and on pull requests.
