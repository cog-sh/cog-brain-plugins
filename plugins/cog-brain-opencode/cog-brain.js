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
// opencode 2.x dropped the v1 plugin API: a v2 plugin default-exports a
// definition with an `id` and a `setup(ctx)`, and it registers the server
// through `ctx.mcp.transform` — there is no mutable global config object
// anymore. opencode 1.x (1.18.29+) accepts the same object and calls
// `server()` instead, so one file serves both.
// https://opencode.ai/v2/docs/build/plugins/migrate-v1
//
// Plain JS with no imports on purpose: nothing to install, nothing to pin.

const DEFAULT_SOURCE = "git+https://github.com/cog-sh/cog-brain"

// opencode 2.x — `Mcp.LocalConfigEncoded`: timeout is an object, not a number.
function serverV2() {
  return {
    type: "local",
    command: ["uvx", "--from", process.env.COG_BRAIN_MCP_SOURCE || DEFAULT_SOURCE, "cog-brain"],
    timeout: { startup: 120000, catalog: 120000, execution: 60000 },
  }
}

// opencode 1.x — `McpLocalConfig`: timeout is a single number of milliseconds.
function serverV1() {
  return {
    type: "local",
    command: ["uvx", "--from", process.env.COG_BRAIN_MCP_SOURCE || DEFAULT_SOURCE, "cog-brain"],
    enabled: true,
    timeout: 60000,
  }
}

export default {
  id: "cog-brain",

  // opencode 2.x
  async setup(ctx) {
    await ctx.mcp.transform((editor) => {
      // Never clobber an explicit choice — a user-declared server (including
      // disabled) wins, and so does one inherited from a parent config.
      if (editor.get("cog-brain")) return

      editor.set("cog-brain", serverV2())
    })
  },

  // opencode 1.x
  async server() {
    return {
      config: async (cfg) => {
        cfg.mcp ??= {}

        if (cfg.mcp["cog-brain"]) return

        cfg.mcp["cog-brain"] = serverV1()
      },
    }
  },
}
