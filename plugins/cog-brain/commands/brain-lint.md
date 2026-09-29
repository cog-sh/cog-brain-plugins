---
name: brain-lint
description: Check the second brain for broken links, orphans, stubs and schema gaps.
---

Report the mechanical problems in the vault. Fix nothing that requires judgement; propose it.

1. `vault_status()` — confirm the index is current; `index_now()` if it is stale.
2. `broken_links()` — links that resolve to no note. Group by source; a typo you can fix
   with `update_note` is a fix; a genuine gap is added to the MOC as a to-do.
3. `graph_overview()` — orphans (no links either way) and hubs. An orphan is a bug: propose
   the MOC or note it should hang from.
4. `list_notes()` — flag notes missing `description` (they make poor search chunks).
5. Report counts + the top offenders. Apply only safe, mechanical fixes; list everything
   else as a proposal with the exact note paths.
