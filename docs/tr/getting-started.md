# 🚀 Baslangic

English version: [docs/en/getting-started.md](../en/getting-started.md)

## Gereksinimler

- Node.js `>=22.14.0`
- npm `>=10`
- `security.roots` icinde acmak istediginiz lokal bir dizin

## En hizli kurulum yolu

```bash
git clone https://github.com/vaur94/mcp-fileops.git
cd mcp-fileops
./scripts/setup-local.sh /absolute/project/root ./mcp-fileops.config.json
```

## Setup script ne yapar

- Node.js ve npm varligini kontrol eder
- desteklenen Node.js tabanini zorunlu kilar
- hedef kok ve config yolunu mutlak yola cevirir
- `npm ci` calistirir
- `npm run build` calistirir
- config dosyasi yoksa baslangic dosyasi olusturur

## Kanonik calistirma komutu

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

`bin/cli.js`, `dist/index.js` dosyasini yukledigi icin sunucu dogrudan calistirilmadan once build alinmis olmalidir.

## Siradaki okuma onerileri

- [Yapilandirma](./configuration.md)
- [Entegrasyonlar](./integrations.md)
- [Guvenlik](./security.md)

Son guncelleme: 2026-03-10
