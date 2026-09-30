# cog-brain for opencode

An [opencode](https://opencode.ai) plugin for **cog-brain** — the MCP server that turns
an Obsidian vault into an agent's second brain.

opencode has no plugin marketplace, so this plugin is installed as files. It exists for
one reason: **the MCP server declaration lives in the plugin, not in your
`opencode.json`** — and it is env-free, so the server is spawned with whatever
`COG_BRAIN_*` your shell exports.

## Install

```bash
# global — ~/.config/opencode/{plugins,skill,command}
./install.sh

# or per project — <dir>/.opencode/{plugins,skill,command}
./install.sh --project ~/work/repo
```

The script copies three things (see *Layout* below) and prints where they went.
**Restart opencode** — config is loaded once at startup.

MCP-only alternative, if you already keep the skill and commands elsewhere:

```bash
opencode plugin file://$PWD/cog-brain.js     # writes ./opencode.json (or .opencode/opencode.json)
opencode plugin --global file://$PWD/cog-brain.js
```

## Verify

```bash
opencode mcp list        # → ✓ cog-brain connected
opencode debug config    # → mcp["cog-brain"] …, plugin: [… cog-brain.js]
opencode debug skill     # → cog-brain …/skill/cog-brain/SKILL.md
```

Then, in a session:

```
/brain-search what did I record about the k8s upgrade
```

## Layout

| Scope | Path | Role |
| --- | --- | --- |
| global | `~/.config/opencode/plugins/cog-brain.js` | the plugin: declares `mcp["cog-brain"]` |
| global | `~/.config/opencode/skill/cog-brain/SKILL.md` | vault conventions (auto-discovered) |
| global | `~/.config/opencode/command/brain-*.md` | `/brain-search`, `/brain-capture`, … (auto-discovered) |
| project | `<dir>/.opencode/{plugins,skill,command}/…` | same three, scoped to that project |

Skill and command files are **copied from `../cog-brain/`** at install time — the vault
conventions live in exactly one place in this repo, and opencode discovers these two
directories on its own. Only the MCP declaration needs the plugin.

## Configuration

Nothing is baked into the plugin. The server inherits your environment:

| Variable | Meaning | Default |
| --- | --- | --- |
| `COG_BRAIN_VAULT` | Obsidian vault root | `~/SECOND_BRAIN` |
| `COG_BRAIN_BACKEND` | `sqlite` · `qdrant` · `markdown` | `sqlite` |
| `COG_BRAIN_STATE_DIR` | index + manifest location | `~/.local/state/cog-brain` |
| `COG_BRAIN_MCP_SOURCE` | where `uvx` fetches the server from | `git+https://github.com/cog-sh/cog-brain` |

An explicitly declared `cog-brain` entry in `opencode.json` always wins — the plugin
never clobbers it (including `{"enabled": false}`).

Requires [`uv`](https://docs.astral.sh/uv/) on `PATH` (`uvx` launches the server).
