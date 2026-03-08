# 🧩 mcpbase Uyumlulugu

## Uyumluluk hedefi

`mcp-fileops`, yayinlanmis npm paketi olan `@vaur94/mcpbase@1.3.0` surumunu hedef alarak implemente edilmistir.

## Dogrulanmis kullanim modeli

- `src/config/schema.ts`, `createRuntimeConfigSchema` ile runtime config yapisini genisletir
- `src/index.ts`, `loadConfig` ile config yukler
- `src/index.ts`, `ApplicationRuntime` olusturur
- `src/index.ts`, `createMcpServer` ile MCP sunucusunu olusturur
- `src/index.ts`, `startStdioServer` ile sunucuyu baslatir

## Gelecek calismalar icin kurallar

- kopyalanmis kaynak yerine paket exportlari kullanilmali
- GitHub tarafindaki upstream icerigi, yayinli paketle dogrulanmadikca sadece referans kabul edilmeli
- gelecekteki uyumluluk guncellemeleri acik sekilde dokumante edilmeli
