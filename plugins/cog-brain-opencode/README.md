# cog-brain for opencode

An [opencode](https://opencode.ai) plugin for **cog-brain** — the MCP server that turns
an Obsidian vault into an agent's second brain.

opencode has no plugin marketplace, so this plugin is installed as files. It exists for
one reason: **the MCP server declaration lives in the plugin, not in your
`opencode.json`** — and it is env-free, so the server is spawned with whatever
`COG_BRAIN_*` your shell exports.

## opencode 1.x and 2.x

One file serves both plugin APIs:

| opencode | Entry point | How the server is declared |
| --- | --- | --- |
| 2.x | `setup(ctx)` | `ctx.mcp.transform((editor) => editor.set("cog-brain", …))` |
| 1.x (1.18.29+) | `server()` | the v1 `config` hook mutating `cfg.mcp` |

opencode 2.x dropped the v1 plugin API — a v2 plugin default-exports a definition with
an `id` and a `setup(ctx)`, and there is no mutable global config object anymore, so
the old `config` hook has no place to write. See
[the v1 → v2 migration guide](https://opencode.ai/v2/docs/build/plugins/migrate-v1).

Note the timeout shape differs between the two APIs: v2 wants an object
(`{ startup, catalog, execution }`), v1 wants a single number of milliseconds.

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
opencode plugin list     # → cog-brain …/plugins/cog-brain.js
opencode debug skill     # → cog-brain …/skill/cog-brain/SKILL.md
```

The server is injected by the plugin at runtime, so `opencode debug config` (file
configs only) does not list it — `opencode mcp list` is the check that matters.

Then, in a session:

```
/brain-search what did I record about the k8s upgrade
```

## Layout

| Scope | Path | Role |
| --- | --- | --- |
| global | `~/.config/opencode/plugins/cog-brain.js` | the plugin: declares the `cog-brain` MCP server |
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
