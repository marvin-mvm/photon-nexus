# Photon Nexus — Design (the Mata Protocol)

An experimental **local-first memory engine for LLM systems**. The design position: separate *logic* (structured, user-owned reasoning artifacts) from *language* (the LLM as translator), and make every answer traceable to physical evidence.

This document translates the internal protocol vocabulary into standard engineering terms. The colorful names are kept because they're how the codebase speaks, but every mechanism is an established pattern applied deliberately.

## Terminology map

| Protocol term | Engineering term |
|---|---|
| Shard / L0 | Chunk (raw evidence, overlap-sharded) |
| Hexalobe | Six specialized parallel LLM extractors |
| Alpha / Beta pyramids | Multi-granularity retrieval (1.0k vs 1.5k chunks, 20% overlap) |
| Stereoscopic Fusion | Evidence-overlap verification between retrieval tracks |
| Supreme Court | LLM-as-judge escalation with provenance grounding |
| Logic Chip / Thought Asset | Schema-validated reasoning artifact with chunk provenance |
| Symbolic Role Mapping | Variable abstraction (`[THRESHOLD_ALPHA]`) → domain-agnostic, reusable logic |
| Reflex promotion (L2→L1) | Semantic caching of verified reasoning paths |
| Cognitive Darwinism / demotion | Cache invalidation when new evidence contradicts a cached path |
| Champion election | Vector-similarity dedup with canonical selection by evidence density |
| BCE self-talk worker | Background enrichment jobs (pg_cron) discovering cross-document links |
| 85% Saturation Handover | Context-window compaction: distill state, re-anchor a fresh session |
| Wormhole | Discovered cross-chunk link (shared variables or vector resonance) |

## The memory hierarchy (L0–L4)

```
L4  Executive manifest — sector centroids, attention weights
L3  Vector topology  — 9D structural fingerprints per chunk
L2  Glossary        — deterministic index: variable → chunk IDs
L1  Structural markdown — reconstructed high-fidelity text (tables, formulas)
L0  Evidence        — raw chunks, overlap-sharded (Alpha 1.0k / Beta 1.5k)
```

Fixed vertical depth (search stays O(log N)); growth is horizontal (new sectors). Every layer above L0 carries pointers back down — any claim in a final answer can be audited to the exact raw chunks that produced it.

## The reasoning loop

1. **Ingestion** — a file is overlap-sharded into two granularities and pushed through six parallel extractors (numeric, causal, temporal, spatial, evidence, mission-relevance), each returning schema-validated JSON with `evidence_density` and `shard_pointers`.
2. **Recall** — a new prompt is fingerprinted and matched against the experience table (cosine similarity, 88/12 weighted with recency; cached "champion" artifacts rank first).
3. **Dual-track verification** — Alpha (detail) and Beta (context) tracks answer independently; **fusion computes the Dice overlap of their evidence chunks**. Overlap < 0.4 = the tracks reasoned from different evidence → flag contextual dissonance and escalate to the judge.
4. **Adjudication** — the judge compares Alpha vs Beta vs the cached Legacy artifact and selects by evidence density (most verified, non-contradictory links back to L0). A fresh winner replaces the cached artifact.
5. **Promotion / demotion** — winners are cached for near-zero-latency reuse; cached logic that new evidence contradicts is demoted back to full re-reasoning. Near-duplicate artifacts (>0.98 similarity) are clustered under a parent, and the densest becomes the canonical "champion"; challengers are retained as future fine-tuning data.
6. **Background enrichment** — an hourly worker scans the glossary for variable collisions across distant chunks and the L4 manifest for cross-sector vector resonance, precomputing links while the user is offline.
7. **Context compaction** — at 85% window saturation, session reasoning is distilled into a handover artifact and injected into a fresh session.

## Security posture (stated plainly)

Chunks at rest are XOR-masked with a session key derived via HKDF-SHA256 from five inputs: an optical PUF entropy seed (a photographed resin artifact — the physical tie-in that names the project), a user passphrase, a device ID, a project salt, and a per-message nonce. Unmasking happens just-in-time in memory, then buffers are zeroed.

This is **device-bound key derivation with stream masking** — a defensible privacy layer for local data. It is *not* information-theoretic or "quantum-proof" security, and this design doc doesn't claim it is. The honest property: keys never persist, and possession of the SSD alone doesn't yield plaintext.

## Status

Working alpha: the deployed v13.1 orchestrator (6-lobe extraction + triple-consensus adjudication + database promotion) plus the schema and telemetry UI in this repo. The v14.3–v16.6 components — batch ingestion orchestrator, stereoscopic fusion scoring, the BCE background worker, and the champion-election schema — exist as implementation blueprints in [blueprints/](blueprints/) and are the current build front.
