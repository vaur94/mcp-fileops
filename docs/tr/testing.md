# 🧪 Testler

## Test katmanlari

- `tests/unit`: servis, politika, config ve arac sekli davranislari
- `tests/integration`: runtime calisma ve mod zorlamalari
- `tests/protocol`: stdio bootstrap ve araclarin uctan uca kullanimi

## Komutlar

```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:protocol
npm run ci:check
```

## Coverage gereksinimleri

- lines: `90`
- functions: `90`
- statements: `90`
- branches: `80`

## CI

`.github/workflows/ci.yml` su adimlari calistirir:

1. `npm ci`
2. `npm run ci:check`

CI akisi, `main` branch push ve pull request olaylarinda tetiklenir.
