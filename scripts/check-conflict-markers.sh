#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-.}"

if ! command -v rg >/dev/null 2>&1; then
  echo "❌ ripgrep (rg) is required." >&2
  exit 2
fi

# Detect unresolved git merge conflict markers.
# We only match exact marker lines to avoid false positives in comments/styling blocks.
if rg -n --hidden --glob '!.git' '^(<<<<<<< .+|=======|>>>>>>> .+)$' "$ROOT_DIR"; then
  echo "❌ Unresolved merge conflict markers found." >&2
  exit 1
fi

echo "✅ No unresolved merge conflict markers found in ${ROOT_DIR}."
