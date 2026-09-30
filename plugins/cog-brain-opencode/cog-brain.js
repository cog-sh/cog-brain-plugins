// cog-brain plugin for opencode — https://opencode.ai
//
// Install: ./install.sh            (see README.md)
// With opencode's own CLI: opencode plugin file:///abs/path/to/cog-brain.js
//
// What it does: declares the cog-brain MCP server in the live config at startup,
// so the user never edits opencode.json by hand and no env is baked in. The
// server is spawned with the environment opencode runs in and reads COG_BRAIN_*
// (vault, backend, state dir) itself — override the source with
// COG_BRAIN_MCP_SOURCE, exactly like `cog-brain mcp-config opencode` does.
//
// Plain JS with no imports on purpose: nothing to install, nothing to pin.

const DEFAULT_SOURCE = "git+https://github.com/cog-sh/cog-brain"

export default async function cogBrain() {
  return {
    // `config` runs once on init with the merged config; mutate it in place.
    config: async (cfg) => {
      cfg.mcp ??= {}

      // Never clobber an explicit choice — a user-declared server (including
      // {enabled: false}) wins, and so does one inherited from a parent config.
      if (cfg.mcp["cog-brain"]) return

      cfg.mcp["cog-brain"] = {
        type: "local",
        command: [
          "uvx",
          "--from",
          process.env.COG_BRAIN_MCP_SOURCE || DEFAULT_SOURCE,
          "cog-brain",
        ],
        enabled: true,
      }
    },
  }
}
