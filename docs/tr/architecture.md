# 🏗️ Mimari

## Amac

`mcp-fileops`, MCP runtime sorumluluklarini `@vaur94/mcpbase` paketine birakir; proje ozelindeki dosya sistemi guvenligi, arac davranislari ve testler ise bu depoda yer alir.

## Runtime akisi

1. `bin/cli.js`, derlenmis `dist/index.js` paketini yukler
2. `src/index.ts`, `loadConfig` ile config yukler
3. `src/index.ts`, `StderrLogger` olusturur
4. `src/index.ts`, `ApplicationRuntime` olusturur
5. `src/tools/index.ts`, tam v1 arac yuzeyini kaydeder
6. `createMcpServer` ve `startStdioServer`, sunucuyu `stdio` uzerinden aciga cikarir

## Kaynak kod yapisi

```text
src/
  config/
  errors/
  security/
  services/filesystem/
  tools/
  index.ts
tests/
  unit/
  integration/
  protocol/
```

## Katman sinirlari

- `src/config`: schema ve default degerler
- `src/errors`: dosya sistemi alanina ozel hatalar
- `src/security`: root politikasi ve mutation guard yapilari
- `src/services/filesystem`: tekrar kullanilabilir dosya sistemi mantigi
- `src/tools`: yalnizca MCP arac tanimlari
- `src/index.ts`: bootstrap girisi ve exportlar

## Mimari kisitlar

- `mcpbase` runtime kodu kopyalanmamalidir
- filesystem servisleri MCP arac wrapperlarindan bagimsiz kalmalidir
- v1 transport kapsami yalnizca `stdio` olmalidir
- sunucuya shell execution eklenmemelidir
