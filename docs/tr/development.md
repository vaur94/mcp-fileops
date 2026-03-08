# 🛠️ Gelistirme

## Lokal calisma akisi

```bash
npm ci
npm run build
npm run ci:check
```

## Depo prensipleri

- `@vaur94/mcpbase`, kopyalanan kaynak degil paket bagimliligi olarak kullanilmali
- arac tanimlari `src/tools/` altinda tutulmali
- tekrar kullanilabilir filesystem mantigi `src/services/filesystem/` altinda olmali
- politika mantigi `src/security/` altinda tutulmali
- davranis degisirse dokumanlar iki dilde birden guncellenmeli

## Proje kisitlari

- Node.js `>=22.14.0`
- npm `>=10`
- v1 transport kapsami `stdio`
- sunucuda shell execution destegi yok

## Temel referanslar

- `src/index.ts`
- `src/config/schema.ts`
- `src/config/defaults.ts`
- `src/tools/index.ts`
- `examples/mcp-fileops.config.json`
