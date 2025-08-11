#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
HOOK_SRC="$ROOT_DIR/githooks/pre-commit"
HOOK_DEST="$ROOT_DIR/.git/hooks/pre-commit"

if [ ! -d "$ROOT_DIR/.git" ]; then
  echo "ERROR: .git directory not found. Initialize git before installing hooks." >&2
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DEST"
chmod +x "$HOOK_DEST"

echo "Installed pre-commit hook -> .git/hooks/pre-commit"
python scripts/validate_tasks.py || true
