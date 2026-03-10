# PR ve Branching

English version: [docs/en/pr-and-branching.md](../en/pr-and-branching.md)

Bu depo degisiklikleri pull request uzerinden kabul eder ve GitHub tarafinda `main` branch'ini korur.

## Depodaki guncel durum

- varsayilan branch `main`
- `main` icin branch protection aktiftir
- zorunlu kontroller arasinda CI ve CodeQL bulunur
- davranis degisirse Ingilizce ve Turkce dokumanlarin birlikte guncellenmesi beklenir

## Pull request beklentileri

- degisiklikleri odakli ve incelemesi kolay tutun
- PR acmadan veya guncellemeden once `npm run ci:check` calistirin
- gerekliyse Ingilizce ve Turkce dokumanlari birlikte guncelleyin
- degisiklik guvenlik veya release akisina dokunuyorsa etkisini aciklayin

## Bu depodaki commit stili

Guncel gecmis, Ingilizce semantik commit mesajlari kullanir:

- `feat: ...`
- `docs: ...`
- `ci: ...`
- `chore(deps...): ...`

## Ilgili dosyalar

- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`
- `CONTRIBUTING.md`
- `SECURITY.md`

Son guncelleme: 2026-03-10
