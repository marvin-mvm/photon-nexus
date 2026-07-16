# Photon Nexus

An experimental **memory engine for LLM systems** — the working alpha of the Mata Protocol. The core bet: hallucination is a *provenance* problem. So every answer here must survive three checks that most RAG stacks skip:

1. **Two retrieval tracks must agree on the evidence.** A detail track (1.0k-char chunks) and a context track (1.5k-char, 20% overlap) answer independently; the system computes the Dice overlap of the *chunk IDs* each track reasoned from. Overlap < 0.4 means they answered from different evidence — that's flagged as contextual dissonance and escalated, never merged silently.
2. **Consensus is judged, not averaged.** Alpha vs Beta vs the cached historical answer go before an LLM judge that selects by *evidence density* — the count of verified, non-contradictory pointers back to raw chunks. Fresh winners replace stale cache.
3. **Cached reasoning must stay grounded.** Proven reasoning paths get promoted to a reflex cache (near-zero-latency reuse); if new evidence contradicts a cached path, it's demoted back to full re-reasoning. Near-duplicate artifacts are clustered and the densest becomes canonical.

The extraction front-end is a **six-lobe parallel decomposition**: numeric, causal, temporal, spatial, evidence, and mission-relevance extractors run concurrently, each returning schema-validated JSON with symbolic role abstraction (`[THRESHOLD_ALPHA]` instead of raw values) so extracted logic is domain-agnostic and reusable. See the deployed function: [supabase/functions/hexalobe-orchestrator/](supabase/functions/hexalobe-orchestrator/).

## Architecture

```
                    ingest                       query
                      │                            │
        ┌─────────────▼─────────────┐   ┌─────────▼──────────┐
        │  overlap sharding (L0)    │   │ 9D fingerprint     │
        │  Alpha 1.0k · Beta 1.5k   │   │ recall (88/12      │
        └─────────────┬─────────────┘   │ sim/recency,       │
        ┌─────────────▼─────────────┐   │ champion-first)    │
        │  6-lobe parallel extract  │   └─────────┬──────────┘
        │  NUM DYN CHR SPA EVI MIS  │             │
        └─────────────┬─────────────┘   ┌─────────▼──────────┐
        ┌─────────────▼─────────────┐   │ Alpha vs Beta vs   │
        │  L1 markdown · L2 index   │   │ Legacy → evidence- │
        │  L3 vectors · L4 manifest │   │ overlap check →    │
        └───────────────────────────┘   │ judged consensus   │
                                        └─────────┬──────────┘
   background (pg_cron): link discovery,          │
   artifact clustering, champion election    promote / demote
```

Full design rationale, terminology map, and the honest security posture: **[docs/DESIGN.md](docs/DESIGN.md)**. Next-version implementation blueprints (batch ingestion, fusion scoring, background worker, v16.6 schema): **[docs/blueprints/](docs/blueprints/)**.

## Status

Single-user working alpha. Deployed: the v13.1 orchestrator (extraction + adjudication + promotion), the schema (experience table, 9D vectors, L2 glossary), and a live telemetry UI (lobe activity, audit trail, memory saturation, consensus log). Design-stage: the v14.3–v16.6 blueprints. This is a research vehicle — expect invented vocabulary in the code comments; [docs/DESIGN.md](docs/DESIGN.md) translates all of it.

## Stack

React 18 + Vite + TypeScript telemetry UI · Supabase (Postgres + pgvector, Deno edge functions, pg_cron) · Gemini as extractor lobes and judge.
