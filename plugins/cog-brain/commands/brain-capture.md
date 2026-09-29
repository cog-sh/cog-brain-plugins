---
name: brain-capture
description: Capture durable knowledge into the second brain.
---

Save what is worth keeping from this conversation into the second brain. Durable, not
raw: decisions and their rationale, constraints, resolved failures, how a system works.

1. `semantic_search` for the topic first — this is the **no-duplicates** rule.
2. Found an existing note → `update_note` it (never a parallel copy).
3. New knowledge → `write_note` with a non-empty `description`, `moc` for the closest
   MOC, and a body that links at least one existing note via `[[...]]`.
4. Superseded a claim? Retract it per the skill: `retracted: true` + `superseded_by`,
   with a "why withdrawn" section — do not delete or overwrite it.
5. Indexing is automatic. Report the paths you touched.
