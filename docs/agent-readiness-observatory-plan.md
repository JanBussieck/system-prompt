# Agent Readiness Observatory — Plan

**Goal:** Build an objective, longitudinal database of how dev tools are recommended and cited by LLM coding agents, and how specific company changes (MCP, docs, pricing/signup friction, llms.txt, etc.) move those numbers — usable for client audits, the free leaderboard/list-builder, and content.

Two example outputs this system should produce automatically:
- *"tldraw shipped an MCP server on 2026-03-12 → its selection share in Claude Code for 'infinite canvas' tasks rose from 41% → 63% over 4 weeks; matched controls flat; no model update in window → attributable."*
- *"Formspree removed its signup wall on 2026-05-02 → chosen as the default form backend in 4/5 greenfield builds, up from 1/5."*

---

## 1. The core idea: two measurement modes

1. **Cross-sectional score (the leaderboard).** For each tool, a current "Agent Visibility Score" per model/agent — selection share, ranking, citation rate, first-try usage. A snapshot, re-run on a schedule → becomes a time series.
2. **Event-study ablations (the causal layer).** Watch companies for changes, timestamp each event, and measure the before/after delta in the LLM outcomes around it. Because *the company* makes the change and *you* observe, these are **quasi-experiments (natural experiments), not true RCTs** — you infer causality with time-series + controls, not by controlling the variable.

Plus a third, optional but powerful layer:

3. **Controlled ablations (true experiments you run).** In a sandbox, host two variants of a tool's docs (with/without `llms.txt`, with/without an MCP server), point an agent's retrieval/MCP at each, and measure the delta. This gives clean causal proof for "does lever X help," complementing the messy observational leaderboard. You can run these on tools you control, on open-source tools, or on synthetic tools.

---

## 2. The #1 methodological rule: separate "tool changed" from "model changed"

The biggest confound is **model updates** — when Claude/GPT/Gemini ship a new version, everyone's scores move at once. If you don't control for this you'll credit a tool's MCP launch for a lift that was really a model update. Defenses:

- **Pin model versions** for every probe run; record the exact model ID + date.
- **Run a stable control set** of unchanged tools every cycle. If the whole cohort moves, it's the model, not the tool.
- **Difference-in-differences:** estimate a change's effect as *(tool's delta around the event) − (matched controls' delta over the same window, same model)*.
- **Re-baseline on model updates** and log them as events in their own right.
- **Interrupted time series:** dense sampling around detected events, look for a level/slope break that controls don't share.

Honest limitation: **you cannot retro-probe old model versions.** Backfilled historical events can only be correlated with *today's* model knowledge, not the model as it was then. Real ablation power accrues **forward from the day you start measuring** — so start the time series now, even coarse.

---

## 3. Architecture: three subsystems + a database

```
  WATCHER  ──detects changes──►  events[]
     │                              │
  (crawls tool surfaces)            │
                                    ▼
  PROBER   ──runs prompt/agent battery──►  observations[]
     │        across model × agent matrix       │
     ▼                                          ▼
  DATABASE (tools, snapshots, events, probes, observations, scores)
     │
     ▼
  ANALYZER ──event-study / diff-in-diff──►  attributions[], scores[]
     │
     ▼
  SURFACES: public leaderboard · gated per-tool report · audit deck · Field Notes
```

### Watcher — detect company-side changes (independent variables / "events")
Snapshot each tool's key surfaces on a schedule, diff against last snapshot, emit timestamped events.

| Surface | What it reveals | Source / method |
|---|---|---|
| `/llms.txt`, `/llms-full.txt` | agent-legibility | direct fetch + diff |
| Docs site (sitemap) | docs overhaul, new quickstart/examples | crawl + structural diff |
| MCP presence | MCP server launched | MCP registries, their repo/docs, `.well-known` |
| OpenAPI / type defs | API surface change | fetch spec + diff |
| Pricing / signup page | free-tier / signup-friction change | crawl + diff + heuristic ("no credit card", "free trial") |
| GitHub | releases, stars, README, MCP repos | GitHub API |
| npm / PyPI | version bumps, download trend | registry APIs |
| Changelog / blog RSS | launches, AI features | RSS/Atom |
| Wayback Machine | **backfill historical events** | CDX API |

Each event: `{tool_id, type, detected_at, evidence_url, confidence}`. Backfill past events with Wayback + GitHub release history to seed the timeline (with the retro-probe caveat above).

### Prober — measure LLM-side outcomes (dependent variables)
Run a **prompt battery** across a **model × agent matrix**, sampled many times per prompt.

Outcomes measured:
- **Selection share** — tool-agnostic prompts ("best X for Y?", "add X to this app") → is the tool named/chosen? (% over N samples).
- **Ranking position** — in "top N" answers, what rank.
- **Citation rate** — in web/retrieval/agent mode, are the tool's docs cited.
- **First-try usage success** — coding agent in a sandbox actually wires it up correctly (build + smoke test). *Expensive tier.*
- **API recency / hallucination** — does the model use the current API cold.

Two harnesses:
- **Cheap knowledge/selection probe** (raw model API, no docs) — breadth, cents/run. Measures training-prior + reasoning. Run wide.
- **Expensive agent-in-sandbox probe** — depth, $/run. Measures runtime + tool use. Run on a curated tier + around detected events.

Sampling: 15–30 samples per prompt (temperature) → rates with confidence intervals; vary phrasing to kill prompt sensitivity. Trigger an **extra dense probe when the Watcher detects an event** to densify the before/after.

Graders: tool-mention/rank extraction (regex + schema'd LLM extraction), citation parsing, and automated build/test grading for usage runs.

### Analyzer — turn observations into scores + attributions
- Aggregate observations → `scores` per (tool, model, date): per-measure + a transparent composite.
- For each event, run interrupted-time-series + diff-in-diff vs. matched controls → `attribution` with effect size, CI, and a confound flag (coinciding model update?).

---

## 4. Data model (the "objective database by model × tool × measure")

- `tools` — id, name, category, tier, homepage, docs_url, repo, npm, competitors[].
- `snapshots` — tool_id, surface, ts, content_hash, blob_ref (raw HTML/spec in object storage).
- `events` — tool_id, type, detected_at, evidence_url, confidence.
- `models` — id, provider, version_string, first_seen, notes.
- `probes` — id, model_id, agent, prompt_id, category, mode(knowledge|agent|web), ts.
- `observations` — probe_id, tool_id, selected(bool), rank(int?), cited(bool), usage_success(bool?), raw_ref.
- `scores` — tool_id, model_id, date, selection_share, rank_avg, citation_rate, usage_success, composite, ci.
- `attributions` — event_id, model_id, measure, effect, ci, control_set[], confound_flags[].

Relational store (Postgres) for the entities + object storage for raw transcripts/HTML; a columnar warehouse (DuckDB locally, or **BigQuery** — already connected via MCP) for the analysis queries.

---

## 5. Scoring

Publish a per-measure breakdown **and** a composite "Agent Visibility Score" per (tool, model, date). Keep it **transparent and falsifiable** — show the components and the sample sizes/CIs. (This is the same credibility ethos as the listicle post: a scoreboard people can audit gets cited; a black-box number gets discounted.) Never a single opaque number.

---

## 6. Tech stack (concrete, lean-first)

- **Orchestration:** scheduled jobs — GitHub Actions cron or a small queue/worker (Trigger.dev / a cron on a VPS). Watchers daily; probes weekly + on-event.
- **Watcher:** fetch + parse (cheerio/undici), GitHub + npm APIs, RSS, Wayback CDX; structural diffing; snapshots to S3/R2.
- **Prober:** container-per-run sandboxes for agent tasks; model provider SDKs for knowledge probes; strict per-run budget + rate limits.
- **DB:** Postgres (Supabase/Neon) + object storage; DuckDB/BigQuery for analysis.
- **Analysis:** Python (pandas/statsmodels) or DuckDB SQL notebooks for event studies.
- **Surface:** reuse the Astro site for the public leaderboard + per-tool pages; gated deep reports behind the email/cost gate discussed earlier.
- **Cost control:** cheap-model knowledge probes for breadth; expensive agent runs only for a curated tier + event windows; cache; hard daily budget circuit-breaker; precompute the leaderboard so visitors cost ~$0.

---

## 7. Phased rollout

**Phase 0 — seed the time series (weeks 1–3).**
Pick 2 categories (e.g., design/creative + maps), 15–30 tools, 2–3 pinned models, **knowledge-probe only**. Weekly cron. Stand up the DB + a basic leaderboard. Backfill events with Wayback/GitHub. You now have a growing time series and a shippable free leaderboard.

**Phase 1 — automate events + widen (weeks 4–8).**
Add the Watcher (auto event detection), more categories (analytics, auth, media), more models/agents, and diff-in-diff analysis. First Field Notes from real detected events.

**Phase 2 — the deep tier + causal proof (weeks 9+).**
Add sandboxed agent usage runs for a curated set, controlled ablations (toggle llms.txt/MCP in a sandbox), and gated per-tool audit reports. This is the paid-audit engine.

---

## 8. Honest limitations (state them; it's the brand)

- Quasi-experimental, not RCT — infer, don't assert; always show controls + CIs.
- Can't retro-probe old model versions → forward-looking power only; start now.
- Companies change several things at once → attribute to a *window*, not always a single lever; controlled ablations resolve the ambiguous ones.
- Goodhart: once the leaderboard matters, tools optimize to it. Rotate/augment the prompt battery; keep some probes private.
- Non-determinism → sample enough, report intervals.

---

## 9. Dual use

One database, three products: **audits** (client's score + ablation-ranked roadmap), **the free leaderboard** (list-builder + SEO + the longitudinal moat), and **content** (every detected event → a Field Note). The observatory is the asset; everything else is a view over it.
