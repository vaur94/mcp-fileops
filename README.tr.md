# mcp-fileops

> [English](./README.md) | Turkce

`mcp-fileops`, AI kodlama ajanlari icin tasarlanmis, guvenli dosya sistemi islemleri saglayan bir MCP sunucusudur. `@vaur94/mcpbase` uzerine kuruludur, `stdio` ile calisir ve varsayilan olarak kapali guvenlik modeli kullanir.

## ✨ Ozet

- tam v1 stdio arac yuzeyi implemente edildi
- kok dizin izin listesi ile siki guvenlik modeli var
- dosya sistemi servisleri ile MCP arac tanimlari ayrik tutuluyor
- unit, integration, protocol ve CI dogrulamalari mevcut
- tum ana dokumantasyon Ingilizce ve Turkce olarak sunuluyor

## 🚀 Hizli Baslangic

Gereksinimler:

- Node.js `>=22.14.0`
- `npm >=10`

```bash
git clone https://github.com/vaur94/mcp-fileops.git
cd mcp-fileops
./scripts/setup-local.sh /absolute/project/root ./mcp-fileops.config.json
```

Bu script:

- `npm ci` ile bagimliliklari kurar
- `npm run build` ile projeyi derler
- config dosyasi yoksa olusturur
- MCP istemcisine gireceginiz stdio komutunu yazar

Beklenen calistirma komutu:

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

## 🧰 Uygulanan Araclar

Salt-okunur araclar:

- `list_directory`
- `get_path_info`
- `read_file`
- `read_files`
- `find_paths`
- `search_text`

Degistirici araclar:

- `write_file`
- `replace_in_file`
- `apply_batch_edits`
- `create_directory`
- `move_path`

## 🛡️ Temel Garantiler

- varsayilan olarak tum erisim kapali
- erisim yalnizca tanimli mutlak kok dizinlerde
- shell execution yok
- varsayilan olarak dosya icerigi loglanmaz
- v1 kapsami yalnizca `stdio`

## 📚 Dokumantasyon

Depo dokumantasyonu diller bazinda net sekilde ayrildi.

English:

- [Repository docs home](./docs/README.md)
- [Getting started](./docs/en/getting-started.md)
- [Architecture](./docs/en/architecture.md)
- [Configuration](./docs/en/configuration.md)
- [Tools](./docs/en/tools.md)
- [Security](./docs/en/security.md)
- [Integrations](./docs/en/integrations.md)
- [Testing](./docs/en/testing.md)
- [Development](./docs/en/development.md)
- [mcpbase compatibility](./docs/en/mcpbase-compatibility.md)

Turkce:

- [Dokumantasyon ana sayfasi](./docs/README.tr.md)
- [Baslangic rehberi](./docs/tr/getting-started.md)
- [Mimari](./docs/tr/architecture.md)
- [Yapilandirma](./docs/tr/configuration.md)
- [Araclar](./docs/tr/tools.md)
- [Guvenlik](./docs/tr/security.md)
- [Entegrasyonlar](./docs/tr/integrations.md)
- [Testler](./docs/tr/testing.md)
- [Gelistirme](./docs/tr/development.md)
- [mcpbase uyumlulugu](./docs/tr/mcpbase-compatibility.md)

## 🧪 Dogrulama

Temel komutlar:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:coverage
npm run test:protocol
npm run ci:check
```

CI, `.github/workflows/ci.yml` uzerinden `main` branch push ve pull request olaylarinda calisir.

## 🔗 Ilgili Dosyalar

- [Guvenlik politikasi](./SECURITY.tr.md)
- [Katki rehberi](./CONTRIBUTING.tr.md)
- [Surum politikasi](./RELEASE.tr.md)
- [Degisiklik gunlugu](./CHANGELOG.tr.md)
- [Ajan baglam dokumani](./AGENTS.tr.md)
