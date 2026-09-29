# Evals

Acceptance tests for the `cog-brain` plugin, run with Claude Code's plugin-eval
harness. Each case is a realistic prompt plus graders; every case runs with and
without the plugin, and the score difference (`Δ`) is what the plugin contributes.

```bash
claude plugin eval .            # whole suite (≈3 runs/arm/case — costs model calls)
claude plugin eval . --case recall-from-vault --runs 1 --ablation none   # cheap iteration
```

Requires Claude Code v2.1.269+. Every run is a real model call on your account.

## Cases

- `recall-from-vault` — a natural question the skill should answer *from the vault*.
  Graders: the skill fired (`tool_used: Skill`), and the answer cites note paths (`llm`).
- `declines-offtopic` — an unrelated request must **not** pull in the skill
  (`tool_used: Skill`, min/max 0, scored in both arms).

## Adding cases

Start from the harness's own generator, then keep the two rules that make scores
stable: one grader on the *result* (a file or the final message) and one on the
*steps* (`tool_used`/`tool_order`), and keep `llm` rubrics short with explicit
PASS/FAIL conditions.

**Write cases need an isolated vault.** The plugin's MCP server defaults to
`~/SECOND_BRAIN`; a case that calls `write_note` would edit the real vault. For any
write case, seed a scratch vault and point the server at it via `COG_BRAIN_VAULT`
before relying on the result.
