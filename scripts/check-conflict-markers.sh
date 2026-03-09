#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-.}"

if ! command -v rg >/dev/null 2>&1; then
  echo "❌ ripgrep (rg) is required." >&2
  exit 2
fi

# Detect unresolved git merge conflict markers.
# Match canonical markers with optional labels, including the common base marker (|||||||).
# This avoids false positives from decorative comment lines like "=========".
pattern='^<<<<<<<(?: .*)?$|^=======\s*$|^>>>>>>> (?:.*)?$|^\|\|\|\|\|\|\|(?: .*)?$'

if rg -n --hidden --glob '!.git' "$pattern" "$ROOT_DIR"; then
  echo "❌ Unresolved merge conflict markers found." >&2
  exit 1
fi

echo "✅ No unresolved merge conflict markers found in ${ROOT_DIR}."
