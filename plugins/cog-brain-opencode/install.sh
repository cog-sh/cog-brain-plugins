#!/usr/bin/env sh
# Install the cog-brain plugin for opencode.
#
#   ./install.sh                 # global:  ~/.config/opencode/{plugins,skill,command}
#   ./install.sh --project DIR   # project: DIR/.opencode/{plugins,skill,command}
#   ./install.sh --help
#
# Copies three things out of this repo (no duplication in the repo itself):
#   plugins/cog-brain-opencode/cog-brain.js  -> plugin (declares the MCP server)
#   plugins/cog-brain/skills/cog-brain/      -> skill (vault conventions)
#   plugins/cog-brain/commands/brain-*.md    -> /brain-* commands
# opencode discovers the latter two on its own; the plugin only wires the server.
set -eu

SELF=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)          # …/plugins/cog-brain-opencode
PLUGIN_DIR=$(CDPATH= cd -- "$SELF/.." && pwd)              # …/plugins
COMMANDS_SRC="$PLUGIN_DIR/cog-brain/commands"
SKILL_SRC="$PLUGIN_DIR/cog-brain/skills/cog-brain"

scope=global
target=$HOME/.config/opencode

while [ $# -gt 0 ]; do
  case $1 in
    --project)
      [ $# -ge 2 ] || { echo "install.sh: --project needs a directory" >&2; exit 2; }
      scope=project
      target=$(CDPATH= cd -- "$2" 2>/dev/null && pwd || echo "$2")
      target="$target/.opencode"
      shift 2
      ;;
    --help|-h)
      sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "install.sh: unknown argument: $1 (try --help)" >&2
      exit 2
      ;;
  esac
done

[ -f "$SKILL_SRC/SKILL.md" ] || { echo "install.sh: missing $SKILL_SRC/SKILL.md" >&2; exit 1; }
[ -d "$COMMANDS_SRC" ] || { echo "install.sh: missing $COMMANDS_SRC" >&2; exit 1; }

mkdir -p "$target/plugins" "$target/skill/cog-brain" "$target/command"
cp "$SELF/cog-brain.js" "$target/plugins/cog-brain.js"
cp "$SKILL_SRC/SKILL.md" "$target/skill/cog-brain/SKILL.md"
for f in "$COMMANDS_SRC"/brain-*.md; do
  cp "$f" "$target/command/$(basename "$f")"
done

echo "cog-brain → $target ($scope)"
echo "  plugins/cog-brain.js        (declares the MCP server; no opencode.json edit)"
echo "  skill/cog-brain/SKILL.md    (vault conventions)"
echo "  command/$(ls "$target/command" | grep -c '^brain-') brain-*.md          (slash commands)"
echo
echo "The vault is the default ~/SECOND_BRAIN; the backend is sqlite unless you export"
echo "COG_BRAIN_VAULT / COG_BRAIN_BACKEND / COG_BRAIN_STATE_DIR. Restart opencode,"
echo "then check: opencode mcp list"
