---
name: brain-index
description: Refresh the second brain index and report its health.
---

Bring the index in line with the vault and report status.

1. `vault_status()` — read the current state (notes on disk vs indexed, last run,
   `stale`).
2. If anything is stale, call `index_now()` (add `full=True` only if the backend or
   chunker changed).
3. `vault_status()` again and summarize: notes indexed, stale count, backend.
4. If the user is diagnosing problems, also run `backlinks` / `broken_links` on the
   notes touched recently and surface any dangling links.
