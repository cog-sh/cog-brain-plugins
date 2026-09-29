---
name: brain-ingest
description: Turn a raw source into linked vault pages.
---

Ingest a source (article, transcript, chat, PDF text) into the vault. The core rule:
**nothing is ingested until it is linked.**

1. `semantic_search` the topic first — in a large vault, updating an existing page beats
   creating a new one. Duplicates are forbidden.
2. Extract **1–3 concepts** (not a summary per paragraph). Create each with `write_note`
   (`type: concept`, a real `description`, a body that links existing notes).
3. Update the pages the source touches (`update_note`) and add every new page to its MOC.
   Link the first mention of each concept/entity; link both directions.
4. Register each operation in the log note; a merge counts as a deletion.
5. On disagreement, do not overwrite: record both positions, attributed and dated, and what
   would settle it.
6. End with the ingest report block (Ingested / New pages / Updated pages / Links added /
   Contradictions found / Gaps created).
