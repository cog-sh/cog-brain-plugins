# AGENTS.md — cog-brain-plugins

Agent/contributor guide for **this repository**. (Humans: see [README.md](README.md).)

## What this is

A **marketplace repo**: one catalog, many per-harness plugins. It hosts plugins
that wire [cog-brain](https://github.com/cog-sh/cog-brain) (MCP server + skill +
commands) into agent harnesses.

## Repo map

```
.omp-plugin/marketplace.json       # omp catalog (preferred)
.claude-plugin/marketplace.json    # Claude-compatible catalog (same shape)
plugins/cog-brain/                 # the plugin
  .claude-plugin/plugin.json       # plugin manifest
  .mcp.json                        # MCP server declaration (uvx --from git+…cog-brain)
  skills/cog-brain/SKILL.md        # the vault conventions
  commands/brain-*.md              # thin scoped entry points
  evals/                          # claude plugin eval suite (prompt.md + graders/)
```

## Add a harness plugin

1. `plugins/<name>/` with:
   - `plugins/<name>/.claude-plugin/plugin.json` — `{name, version, description}`;
   - `plugins/<name>/.mcp.json` — the server, `{"mcpServers": {"cog-brain": {type, command, args, env}}}`;
   - optional `skills/<skill>/SKILL.md`, `commands/*.md`, `hooks/`, `rules/`.
2. Add an entry to **both** catalogs (`plugins[]` → `{name, source: "./<name>", …}`).
   `metadata.pluginRoot: "plugins"` prefixes relative sources.
3. Keep the server declaration identical across harnesses — only the surrounding
   plugin layout differs.

## Conventions

- **`README.md` is for humans; `AGENTS.md` is for agents.** Keep them separate.
- Plugin and skill names are `cog-brain`; the MCP entry is `cog-brain`; env prefix
  is `COG_BRAIN_`. The vault path is unrelated (default `~/SECOND_BRAIN`).
- The vault conventions live *only* in `plugins/cog-brain/skills/cog-brain/SKILL.md`
  — do not duplicate them into commands (commands are thin entry points).
- Catalogs must be valid JSON; `omp plugin marketplace add ./…` and
  `claude plugin validate plugins/cog-brain` are the quick checks.

## Evals

`plugins/cog-brain/evals/<case>/{prompt.md,graders/*.md}`; run from the plugin root
with `claude plugin eval .`. Rules that keep scores stable: one grader on the result
and one on the steps (`tool_used`/`tool_order`); short `llm` rubrics with explicit
PASS/FAIL. **Write cases need an isolated vault** — the server defaults to the real
`~/SECOND_BRAIN`, so seed a scratch vault and set `COG_BRAIN_VAULT` first.
