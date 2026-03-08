#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TARGET_ROOT_INPUT="${1:-${PWD}}"
TARGET_CONFIG_INPUT="${2:-${REPO_ROOT}/mcp-fileops.config.json}"

if ! command -v npm >/dev/null 2>&1; then
  echo "[mcp-fileops] npm is required." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[mcp-fileops] Node.js is required." >&2
  exit 1
fi

NODE_VERSION="$(node --input-type=module -e "const [major, minor] = process.versions.node.split('.').map(Number); if (major > 22 || (major === 22 && minor >= 14)) { console.log(process.versions.node); process.exit(0); } process.exit(1);")" || {
  echo "[mcp-fileops] Node.js >=22.14.0 is required." >&2
  exit 1
}

echo "[mcp-fileops] node version: ${NODE_VERSION}"

resolve_absolute_path() {
  node --input-type=module -e "import path from 'node:path'; console.log(path.resolve(process.argv[1]));" "$1"
}

TARGET_ROOT="$(resolve_absolute_path "${TARGET_ROOT_INPUT}")"
TARGET_CONFIG="$(resolve_absolute_path "${TARGET_CONFIG_INPUT}")"

echo "[mcp-fileops] repo root: ${REPO_ROOT}"
echo "[mcp-fileops] allowed root: ${TARGET_ROOT}"
echo "[mcp-fileops] config path: ${TARGET_CONFIG}"

cd "${REPO_ROOT}"

echo "[mcp-fileops] installing dependencies..."
npm ci

echo "[mcp-fileops] building project..."
npm run build

mkdir -p "$(dirname "${TARGET_CONFIG}")"

if [[ ! -f "${TARGET_CONFIG}" ]]; then
  cat > "${TARGET_CONFIG}" <<EOF
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
    "roots": ["${TARGET_ROOT}"],
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
EOF
  echo "[mcp-fileops] wrote config: ${TARGET_CONFIG}"
else
  echo "[mcp-fileops] config already exists, leaving it untouched."
fi

echo "[mcp-fileops] local setup complete."
echo "[mcp-fileops] stdio command: node ${REPO_ROOT}/bin/cli.js --config \"${TARGET_CONFIG}\""
