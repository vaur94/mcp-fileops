# 🧰 Tools

Türkçe sürüm: [docs/tr/tools.md](../tr/tools.md)

## Implemented v1 tools

### Read-only

- `list_directory`: list immediate children with metadata
- `get_path_info`: inspect a path and normalized metadata
- `read_file`: read one text file safely
- `read_files`: read multiple text files in one call
- `find_paths`: discover files and directories under allowed roots
- `search_text`: search file content and return structured matches

### Mutating

- `write_file`: create or overwrite a full file with explicit rules
- `replace_in_file`: deterministic in-file search and replace
- `apply_batch_edits`: apply validated multi-edit changes with structured results
- `create_directory`: create a directory path safely
- `move_path`: rename or move files and directories within allowed roots

## Registration order

All tools are registered in `src/tools/index.ts`.

## Shared expectations

- every tool runs inside configured root boundaries
- every tool returns machine-usable structured content
- mutating tools respect `security.readOnly`
- mutating tools also respect feature flags under `features`

## Deferred capabilities

Deferred on purpose:

- `delete_path`
- `copy_path`
- AST-aware code editing
- structured JSON or YAML editors

Last updated: 2026-03-10
