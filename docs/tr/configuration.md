# ⚙️ Yapilandirma

## Varsayilanlar

Runtime varsayilan config degerleri `src/config/defaults.ts` icinde tanimlidir.

```json
{
  "server": {
    "name": "mcp-fileops",
    "version": "0.1.0"
  },
  "logging": {
    "level": "info",
    "includeTimestamp": true
  },
  "security": {
    "readOnly": false,
    "roots": [],
    "allowHiddenPaths": false,
    "followSymlinks": false,
    "maxFileBytes": 1048576,
    "maxBatchEdits": 100,
    "maxSearchResults": 200
  },
  "features": {
    "writeFile": true,
    "replaceInFile": true,
    "applyBatchEdits": true,
    "createDirectory": true,
    "movePath": true
  }
}
```

## Config schema

Depo, `mcpbase` runtime config yapisini su alanlarla genisletir:

- `security.readOnly`
- `security.roots`
- `security.allowHiddenPaths`
- `security.followSymlinks`
- `security.maxFileBytes`
- `security.maxBatchEdits`
- `security.maxSearchResults`
- `features` altinda degistirici arac bayraklari

## Cozumleme sirasi

Runtime oncelik sirasi:

1. varsayilanlar
2. config dosyasi
3. environment variables
4. CLI override degerleri

## Dosya ve ortam ayarlari

- varsayilan config dosya adi: `mcp-fileops.config.json`
- environment variable prefix: `MCP_FILEOPS_`

Ornek environment degerleri:

- `MCP_FILEOPS_LOG_LEVEL=debug`
- `MCP_FILEOPS_READ_ONLY=true`

## Ornek config

Kopyalanabilir bir ornek icin `examples/mcp-fileops.config.json` dosyasina bakin.
