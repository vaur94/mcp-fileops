# 🔌 Entegrasyonlar

## Ortak calistirma modeli

Her MCP istemcisi ayni temel girdilere ihtiyac duyar:

- sunucuyu baslatacak stdio komutu
- config dosyasi yolu
- `security.roots` altinda tanimli bir root izin listesi

Kanonik komut:

```bash
node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

## Onerilen lokal kurulum

```bash
./scripts/setup-local.sh /absolute/project/root /absolute/path/to/mcp-fileops.config.json
```

## OpenCode

`mcp` blogu ve lokal komut dizisi kullanilir:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp-fileops": {
      "type": "local",
      "command": [
        "node",
        "/absolute/path/to/mcp-fileops/bin/cli.js",
        "--config",
        "/absolute/path/to/mcp-fileops.config.json"
      ],
      "enabled": true
    }
  }
}
```

## Codex

CLI kisayolu:

```bash
codex mcp add mcp-fileops -- node /absolute/path/to/mcp-fileops/bin/cli.js --config /absolute/path/to/mcp-fileops.config.json
```

`config.toml` formati:

```toml
[mcp_servers.mcp-fileops]
command = "node"
args = [
  "/absolute/path/to/mcp-fileops/bin/cli.js",
  "--config",
  "/absolute/path/to/mcp-fileops.config.json"
]
```

## Antigravity

`mcpServers` altina stdio komut argumanlariyla bir giris eklenir:

```json
{
  "mcpServers": {
    "mcp-fileops": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-fileops/bin/cli.js",
        "--config",
        "/absolute/path/to/mcp-fileops.config.json"
      ]
    }
  }
}
```

## Entegrasyon kontrolleri

Istemci baglantisi tamamlandiktan sonra su uc noktalar kontrol edilmelidir:

- arac listesini gorebilmeli
- `get_path_info` cagrisi yapabilmeli
- tanimli root sinirlari zorlanmali
