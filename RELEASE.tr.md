# Surum

> [English](./RELEASE.md) | Turkce

Surum otomasyonu su anda bilincli olarak ertelenmis durumda. Depo disiplinli surumleme icin hazir, ancak yayin otomasyonu yalnizca maintainer tarafinda acik bir yayin karari verildiginde eklenmeli.

## Guncel surum tabani

- Ingilizce conventional commit gecmisi
- changelog bakimi
- `main` ve pull request icin GitHub Actions CI kapisi
- `package.json` icinde tanimli npm paket metadatasi

## Otomasyon eklenmeden once

- yayin yetkisi ve paket sahipligi netlestirilmeli
- versiyonlama ve geri donus politikasi dokumante edilmeli
- changelog ve release note sorumlulugu tanimlanmali
- GitHub release ile npm publish akisinin bagli olup olmayacagi kararlastirilmali

Detaylar icin:

- [English development guide](./docs/en/development.md)
- [Turkce gelistirme rehberi](./docs/tr/development.md)
