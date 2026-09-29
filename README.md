# cog-brain-plugins

Harness plugins for **cog-brain** — the agent-agnostic second brain
([cog-sh/cog-brain](https://github.com/cog-sh/cog-brain)).

This is a **marketplace repo**: one catalog, many plugins. It currently ships the
`second-brain` plugin; other harnesses are added as sibling directories.

## Install

### oh-my-pi (omp)

```bash
omp plugin marketplace add cog-sh/cog-brain-plugins
omp plugin install second-brain@cog-brain-plugins
```

Or in the TUI: `/marketplace add cog-sh/cog-brain-plugins` →
`/marketplace install second-brain@cog-brain-plugins`, then `/reload-plugins`
(skills, slash commands, MCP). Restart the session for newly installed tools/hooks.

### Claude Code

```bash
claude plugin marketplace add cog-sh/cog-brain-plugins
claude plugin install second-brain@cog-brain-plugins
```

The same catalog is published at both `.omp-plugin/marketplace.json` (omp-preferred)
and `.claude-plugin/marketplace.json` (Claude-compatible).

### Any other MCP client

Paste this into the client's MCP config:

```json
{
  "mcpServers": {
    "second-brain": {
      "type": "stdio",
      "command": "uvx",
      "args": ["--from", "git+https://github.com/cog-sh/cog-brain", "second-brain"],
      "env": { "SECOND_BRAIN_BACKEND": "sqlite" }
    }
  }
}
```

Nothing to clone: `uvx` fetches and runs the server from the cog-brain repo.

## What the `second-brain` plugin provides

| Path | Role |
| --- | --- |
| `.mcp.json` | registers the `second-brain` MCP server (stdio, via `uvx`) |
| `skills/second-brain/SKILL.md` | the note conventions the agent follows |
| `commands/brain-search.md` | `/brain-search` — retrieve and answer from the vault |
| `commands/brain-capture.md` | `/brain-capture` — save durable knowledge |
| `commands/brain-index.md` | `/brain-index` — refresh and report index health |

## Layout

```
cog-brain-plugins/
├── .omp-plugin/marketplace.json      # omp catalog
├── .claude-plugin/marketplace.json   # Claude-compatible catalog
└── plugins/
    └── second-brain/
        ├── .claude-plugin/plugin.json
        ├── .mcp.json
        ├── skills/second-brain/SKILL.md
        └── commands/
```

## Configuration

Set these in the plugin's `.mcp.json` `env`, or globally in your shell.

| Variable | Meaning | Default |
| --- | --- | --- |
| `SECOND_BRAIN_VAULT` | Obsidian vault root | `~/SECOND_BRAIN` |
| `SECOND_BRAIN_BACKEND` | memory engine: `sqlite` · `qdrant` · `markdown` | `sqlite` |
| `SECOND_BRAIN_STATE_DIR` | index + manifest location | `~/.local/state/second-brain` |
| `SECOND_BRAIN_QDRANT_URL` | Qdrant endpoint (only for `qdrant`) | `http://127.0.0.1:6333` |
| `SECOND_BRAIN_OLLAMA` | embedding endpoint (only for `qdrant`) | `http://127.0.0.1:11434/api/embed` |

## Adding another harness

Create `plugins/<name>/` with the same shape (`.mcp.json`, optional `skills/`,
`commands/`, `hooks/`, `.claude-plugin/plugin.json`) and add an entry to both
marketplace catalogs. No other change is needed.
