#!/usr/bin/env bash

# Use the Unofficial Bash Strict Mode
# @see http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

warn() {
  echo "$*" >&2
}

die() {
  warn "$*"
  exit 1
}

usage() {
  die "Usage: sh $0 <export_class> <sketch_file_path> [opts...]"
}

# Normalize current directory
cd "${BASH_SOURCE%/*}" || exit

# Parse arguments
export_class="$1"
sketch_file_path="$2"
shift 2
[[ -z "${export_class:-}" || -z "${sketch_file_path:-}" ]] && usage

# Get command components
sketch_app_path="$(mdfind kMDItemCFBundleIdentifier == 'com.bohemiancoding.sketch3' | head -n 1)"
sketchtool_bin="${sketch_app_path}/Contents/Resources/sketchtool/bin/sketchtool"
assets_path="$(cd ../.design/exports; pwd)"
normalized_sketch_file_path="$(cd ..; echo "$(pwd)/${sketch_file_path}")"

# Run the command
"$sketchtool_bin" export "$export_class" \
  --output="$assets_path" "$@" \
  "$normalized_sketch_file_path"

echo "[scripts/assets-sketch-export] ✓ Exported assets from $sketch_file_path"
