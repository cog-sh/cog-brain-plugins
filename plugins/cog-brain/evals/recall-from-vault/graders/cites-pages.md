---
type: llm
---

PASS if the answer cites at least one vault note by its `.md` path and the content clearly comes from those notes.
FAIL if the answer recites general Rust knowledge without citing any note, or invents note paths that were not returned by a tool.
