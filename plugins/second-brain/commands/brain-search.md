---
name: brain-search
description: Search the second brain and answer from the notes.
---

Search the operator's second brain for whatever they asked about, then answer from
the notes — not from general knowledge.

1. `semantic_search` the request (start here, always). If a hit's `index_stale` is
   not `0`, call `index_now()` and search again before trusting it.
2. `read_note` the best one to three hits; use `outline` first for long ones.
3. Follow `find_related` / `backlinks` when the question is about how things connect.
4. Answer concisely and cite the note paths you used. Quote the note's own words for
   decisions; flag any note marked `[RETRACTED …]` as no longer current.
