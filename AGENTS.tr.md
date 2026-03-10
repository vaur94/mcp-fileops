# PROJE BILGI BANKASI

> [English](./AGENTS.md) | Turkce

**Guncellendi:** 2026-03-08
**Branch:** main

## GENEL BAKIS

`mcp-fileops`, guvenli dosya sistemi is akislari icin tasarlanmis bir TypeScript MCP sunucusudur. `@vaur94/mcpbase@1.3.0` uzerine kuruludur, tam v1 stdio arac yuzeyini sunar ve guvenlik, dosya sistemi mantigi ile MCP arac tanimlarini birbirinden ayirir.

## YAPI

```text
./
├── src/
│   ├── config/
│   ├── errors/
│   ├── security/
│   ├── services/filesystem/
│   └── tools/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── protocol/
├── docs/
│   ├── en/
│   └── tr/
├── .github/workflows/
├── bin/
├── examples/
└── scripts/
```

## NEREYE BAKILMALI

| Konu              | Konum                              | Not                                                         |
| ----------------- | ---------------------------------- | ----------------------------------------------------------- |
| Bootstrap         | `src/index.ts`                     | Config yukler, runtime olusturur, stdio sunucusunu baslatir |
| Config schema     | `src/config/schema.ts`             | `mcpbase` runtime config schema genisletmesi                |
| Varsayilan config | `src/config/defaults.ts`           | Kanonik default degerler                                    |
| Arac kaydi        | `src/tools/index.ts`               | Tum v1 araclarini kaydeder                                  |
| CLI girisi        | `bin/cli.js`                       | `dist/index.js` uzerine ince bir wrapper                    |
| Ornek config      | `examples/mcp-fileops.config.json` | Kopyalanabilir config formati                               |
| Kurulum scripti   | `scripts/setup-local.sh`           | Lokal kurulum, build ve config hazirlama                    |
| Dokumantasyon     | `docs/en/`, `docs/tr/`             | Cift dilli urun dokumani                                    |

## KURALLAR

- ESM-only paket
- Node.js `>=22.14.0`
- npm `>=10`
- env prefix: `MCP_FILEOPS_`
- varsayilan config dosyasi: `mcp-fileops.config.json`
- v1 transport kapsami: yalnizca `stdio`
- coverage kapilari: lines/functions/statements `90`, branches `80`

## KACINILMASI GEREKENLER

- `vaur94/mcpbase` kaynak kodunu kopyalamayin
- v1 icine shell execution eklemeyin
- root boundary guvencelerini zayiflatmayin
- filesystem servisleri ile MCP arac tanimlarini ayni modulde toplamayin
- varsayilan olarak dosya icerigi loglamayin

## TEMEL KOMUTLAR

```bash
npm run build
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run test:coverage
npm run test:protocol
npm run ci:check
```

## DOKUMAN HARITASI

- English docs home: `docs/README.md`
- Turkce docs home: `docs/README.tr.md`
- Root readme dosyalari: `README.md`, `README.tr.md`

## NOTLAR

- `bin/cli.js`, `dist/index.js` build ciktisini bekler
- `.github/workflows/ci.yml`, `npm run ci:check` komutunu calistirir
- dokumantasyon bilerek iki dillidir; Ingilizce ve Turkce dosyalar birlikte guncel tutulmalidir

Son guncelleme: 2026-03-10
