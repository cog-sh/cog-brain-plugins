---
name: cog-brain
description: The operator's knowledge base — an Obsidian vault exposed through the `cog-brain` MCP server. Use when the user asks to recall something ("what did I record about X", "search my notes"), to save/capture a decision or fact, or when durable project knowledge should outlive the session. Covers hybrid search, reading, safe note writes, the wiki-link graph, and retractions.
---

# Second Brain

Vault: an Obsidian folder of flat Markdown notes; structure is `[[wiki-links]]`, MOC
notes, and tags (not folders). Storage/retrieval runs through a **pluggable memory
backend** (default `sqlite`; `qdrant` for embeddings, `markdown` for zero-infra) —
the tools are identical whichever is active.

**Start every recall with `semantic_search`.**

## Read

- `semantic_search(query, k=8, tag=None, folder=None, chunks_per_note=1)` — hybrid
  search; returns chunks with `file_path`, `title`, `heading_path`, `text`, `score`.
  Every hit carries `index_stale`: `0` fresh, `-1` never run, `>0` notes changed since
  the last index — mention it or call `index_now()`.
- `outline(file_path)` — headings only; cheap way to see a long note's shape.
- `read_note(file_path, max_chars=None)` — full text. A retracted note starts with a
  `[RETRACTED NOTE …]` banner: do not restate it as current knowledge.
- `find_related(file_path, k=10)` — semantic neighbours + 1-hop `[[link]]` expansion.
- `backlinks(file_path)` — who links here, and where this note points.
- `broken_links()` — links to nowhere; check after bulk renames.
- `graph_overview(k=15)` — hubs (most outgoing links → MOC candidates) and orphans.
- `list_notes(tag=None, folder=None, limit=200)` — inventory with `type`/`status`/`retracted`.
- `vault_status()` — index health (notes on disk vs indexed, last run, staleness).

**Rule:** `file_path` comes **only** from a tool result — never invent filenames.

## Write

- `write_note(file_path, title, content, description, tags=None, moc=None, type="zettel",
  status="seedling", aliases=None, retracted=False, supersedes=None, auto_index=True)`:
  - `description` is **required** — one sentence; it is the RAG chunk title;
  - `moc` accepts `Rust MOC` or `[[Rust MOC]]`;
  - `file_path` is kebab-case EN at the vault root;
  - the body must link at least one **existing** note; links that do not resolve yet
    come back in `unresolved_links` (a hub may be written before its spokes);
  - the note is indexed automatically.
- `update_note(file_path, content=None, append=False, title=None, description=None,
  tags=None, moc=None, type=None, status=None, aliases=None, retracted=None,
  supersedes=None, superseded_by=None, auto_index=True)` — patch in place; only the
  fields you pass change; `updated` is bumped. Use `append=True` to add to the body.
- `index_now(full=False)` — re-index manually (only needed after edits outside the server).

## Retractions (failure-path preservation)

A dead end or superseded claim is **never deleted or silently rewritten** — it will be
hit again:

- the retracted note gets `retracted: true` + `superseded_by` and a "why it was
  withdrawn" section;
- the successor gets `supersedes`;
- `status` is **not** changed — it describes maturity, not workflow;
- a retracted note **stays searchable** and is flagged, so the next reader knows it is
  no longer current.

## Don't

- Don't create notes from raw/noisy material — ask for `daily/`.
- Don't duplicate: found something similar → `update_note`, not a new note.
- Volatile facts (versions, numbers, dates) carry a date: `As of 2026-09-29 …`.

## Backends & configuration (env)

| var | meaning |
| --- | --- |
| `COG_BRAIN_VAULT` | vault root (default `~/SECOND_BRAIN`) |
| `COG_BRAIN_BACKEND` | `sqlite` (default) · `qdrant` · `markdown` |
| `COG_BRAIN_STATE_DIR` | index/manifest location |
| `COG_BRAIN_QDRANT_URL`, `COG_BRAIN_OLLAMA` | only for the `qdrant` backend |

## Vault model

- **One idea per page, densely linked**; a page type is declared in frontmatter `type:`:
  - `source` — a clipped article/video/chat, claims kept as claims (audit trail);
  - `entity` — a person/org/product/tool (add `kind:`);
  - `concept` — the pages that compound; the only type where the agent synthesises;
  - `synthesis` — only when it says what no single source did. Do not write one just to have one.
- Layout: `raw/` (sources land, never edited) → `wiki/` (the artifact) with
  `index.md` (catalog, read first) and `log.md` (one line per operation);
  `output/` for drafts/reports that later get re-ingested.
- Frontmatter: `title, type, created, updated, aliases[], tags[]` (+ `url/author/published`
  for sources, `kind:` for entities). Leave a field out rather than guess.

## Linking

- Link the **first mention** of any concept/entity on every page — both directions.
  Link, don't restate. A link to a not-yet-existing page is fine — it is a to-do, not a bug.
- Add the new page's row to its MOC (`update_note` on the MOC) — a note that only sits in
  the `moc:` field is half-wired.
- Optional typed links, five relations only, and **only when the source states it**:
  `supports` · `contradicts` · `extends` · `part-of` · `applies` (inline `rel:: [[X]]`).
  Typed edges let "what contradicts this page?" be a query.

## Ingest contract

**Nothing is ingested until it is linked.** Every ingest run ends with this block:

```
Ingested: <source>
New pages: n — list
Updated pages: n — list
Links added: n
Contradictions found: n
Gaps created: n
```

- Search before creating — in a large vault, updating beats creating.
- Calibration: one source yields **1–3 concept pages**, not a summary per paragraph.
- Register every operation in `log.md`; a merge counts as a deletion, and nothing is
  deleted without a log line.

## Contradictions & freshness

- Never overwrite on disagreement: record **both positions**, attributed and dated, plus
  "what would settle it". Never resolve a contradiction by picking the more recent source.
- Supersede by strikethrough with a date, never deletion. Keep confidence labels
  (`stated` / `reported` / `self-reported` / `unverified`) — a self-reported number never
  loses the label.

## Maintenance

- Mechanical fixes (broken links, format) are applied; **judgement calls** (merges,
  deletions, renames) are proposed with a diff — never applied silently.
- The health check is four numbers, not vanity counts: orphan rate (<5% healthy, >15%
  broken), average degree (3–8), main component (≥~80% of pages), stale concepts
  (`updated` > 90 days). Report the trend, not the total.
