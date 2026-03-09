# Surum

> [English](./RELEASE.md) | Turkce

`mcp-fileops` artik npm trusted publishing icin GitHub Actions workflow'u iceriyor, ancak paket henuz npm'de olmadigi icin ilk publish yine manuel yapilmalidir.

## Guncel surum tabani

- Ingilizce conventional commit gecmisi
- changelog bakimi
- `main` ve pull request icin GitHub Actions CI kapisi
- `package.json` icinde tanimli npm paket metadatasi
- OIDC tabanli npm yayinlama icin `.github/workflows/publish.yml`

## Ilk publish gereksinimleri

Paket henuz npm'de olmadigi icin ilk surum trusted publishing ile tek basina tamamlanamaz.

1. npm hesabi ile lokal olarak kimlik dogrulayın
2. `npm run ci:check` calistirin
3. `npm publish --access public` calistirin
4. `npm view mcp-fileops version name repository homepage --json` ile yayini dogrulayin

Ilk publish basarili olduktan sonra npm trusted publisher mapping su sekilde olusturulmalidir:

- owner: `vaur94`
- repository: `mcp-fileops`
- workflow file: `publish.yml`
- environment: workflow sonradan bir environment kullanmadigi surece bos birakilmali

Onerilen komut:

```bash
npx -y npm@11.11.0 trust github mcp-fileops --repo vaur94/mcp-fileops --file publish.yml
```

## Trusted publish akisi

Trusted publisher mapping tanimlandiktan sonra:

- `workflow_dispatch` icinde `publish` false birakilarak dry run yapilabilir
- yayimlanmis bir GitHub release, `npm publish --provenance --access public` komutunu tetikler
- `workflow_dispatch`, `publish` true oldugunda secilen dist-tag ile yayin yapabilir
- release workflow'u, publish oncesi GitHub release tag'inin `package.json` icindeki surumle `v<version>` formatinda eslestigini dogrular

## Workflow guvenceleri

- npm OIDC trusted publishing icin `id-token: write` aktif
- release islemleri icin `fetch-depth: 0` kullaniliyor
- publish oncesi `npm run ci:check` ve `npm run pack:dry-run` calisiyor
- publish komutu `--provenance --access public` kullaniyor

## Dogrulama

Surum hazirligini kontrol etmek icin su komutlari kullanin:

```bash
npm audit --json
npm run ci:check
npm run pack:dry-run
gh run list --workflow publish.yml --limit 5 --repo vaur94/mcp-fileops
gh release list --repo vaur94/mcp-fileops --limit 5
```

Detaylar icin:

- [English development guide](./docs/en/development.md)
- [Turkce gelistirme rehberi](./docs/tr/development.md)
