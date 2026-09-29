---
name: brain-graph
description: Show the shape of the vault — hubs, orphans, and how a note connects.
---

Answer a question about the vault's structure, using the graph tools.

1. `graph_overview(k=15)` — hubs (most outgoing links → MOC candidates) and orphans.
2. For a specific note: `backlinks(path)` (who points here, where it points) and
   `find_related(path)` (semantic neighbours + 1-hop links).
3. `broken_links()` when the question is about gaps.
4. To export for outside analysis, the CLI does it (`cog-brain graph --export csv|graphml`),
   which carries each page's `type` as a node attribute.

Report the structure in prose: the hubs, the disconnected clusters, and the one or two
links that would most improve connectivity.
