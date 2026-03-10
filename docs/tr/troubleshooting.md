# Sorun Giderme

English version: [docs/en/troubleshooting.md](../en/troubleshooting.md)

Bu sayfa, mevcut depo yapisindan dogrudan kanitlanabilen repository-ozel problemleri kapsar.

## Setup script sorunlari

### npm komutlarinda `package.json` bulunamiyor

Paket yonetimi komutlarini repository root dizininde calistirin:

```bash
cd /path/to/mcp-fileops
test -f package.json
```

### CLI icin build ciktisi eksik

`bin/cli.js`, `dist/index.js` dosyasini bekler. Dogrudan CLI kullanmadan once yeniden build alin:

```bash
npm run build
```

## Erisim ve guvenlik hatalari

### Root-boundary reddi

Dosya islemleri izin veya root-boundary hatasiyla basarisiz olursa, config icinde `security.roots` altinda dogru mutlak root taniminin bulundugunu kontrol edin.

### Read-only mode davranisi

`security.readOnly` aktifken degistirici araclar tasarim geregi basarisiz olur.

## Publish ve release kontrolleri

### Trusted publishing aktif degil

Sunlari dogrulayin:

- npm paketi zaten var olmali
- trusted publisher mapping `publish.yml` dosyasini isaret etmeli
- workflow icinde `id-token: write` bulunmali

### Release tag uyusmazligi

GitHub release tag'i `package.json` ile `v<version>` biciminde eslesmiyorsa `Publish Package` publish adimini durdurur.

Son guncelleme: 2026-03-10
