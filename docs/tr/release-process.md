# Release Sureci

English version: [docs/en/release-process.md](../en/release-process.md)

`mcp-fileops`, release dogrulamasi ve npm trusted publishing icin GitHub Actions kullanir.

## Guncel release modeli

- `mcp-fileops` paketi artik npm'de mevcuttur
- trusted publisher mapping `publish.yml` icin tanimlidir
- `Publish Package` workflow'u publish oncesi repository'yi dogrular
- yayimlanmis bir GitHub release, `npm publish --provenance --access public` komutunu tetikler

## Release onkosullari

- `package.json` surumu bilincli sekilde guncellenmis olmali
- gerekiyorsa changelog guncel olmali
- `main` branch CI ve CodeQL tarafinda yesil olmali
- release tag'i paket surumuyle `v<version>` biciminde eslesmeli

## Dogrulanmis workflow dosyalari

- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/publish.yml`

## Publish workflow davranisi

- `workflow_dispatch` icinde `publish=false` dry run gibi davranir
- `workflow_dispatch` icinde `publish=true` secilen npm dist-tag ile publish yapabilir
- `release.published` olayi normal trusted publish yolunu calistirir

## Manuel kontroller

```bash
npm audit --json
npm run ci:check
npm run pack:dry-run
gh run list --workflow publish.yml --limit 5 --repo vaur94/mcp-fileops
gh release list --repo vaur94/mcp-fileops --limit 5
```

## Notlar

- bu depo icin ilk manuel npm publish islemi artik tamamlanmistir
- sonraki publish'lerde uzun omurlu `NPM_TOKEN` yerine trusted publishing workflow'u kullanilmalidir

Son guncelleme: 2026-03-10
