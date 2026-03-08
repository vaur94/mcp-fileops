# Tool Inventory

## Selection principles

- optimize for high-frequency agent workflows
- prefer deterministic text workflows over broad capability breadth
- expose machine-readable output whenever practical
- keep destructive operations narrow and explicit

## v1 candidate tools

### Read-only tools

- `list_directory`
  - list immediate children with basic metadata
- `get_path_info`
  - inspect whether a path exists and return normalized metadata
- `read_file`
  - read one text file safely
- `read_files`
  - read multiple text files in one call
- `find_paths`
  - discover matching files/directories under allowed roots
- `search_text`
  - search text content across files with structured matches

### Mutating tools

- `write_file`
  - write or create a full file with explicit overwrite rules
- `replace_in_file`
  - deterministic search-and-replace within one file
- `apply_batch_edits`
  - apply multiple validated edits across files with per-edit results
- `create_directory`
  - create one directory path safely
- `move_path`
  - rename or move a file/directory within allowed roots

## Deferred tools

- `delete_path`
- `copy_path`
- JSON/YAML structured editing
- AST-aware code editing

These are deferred because they either increase destructive risk or add package and validation complexity that is not required for the first useful release.

## Tool output expectations

Every tool should return:

- human-readable summary text
- structured content suitable for automated agent follow-up
- normalized error reporting

Mutating tools should also return:

- whether anything changed
- affected paths
- counts for edits or created/moved items
- partial-failure details when relevant
