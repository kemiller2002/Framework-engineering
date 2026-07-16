# ECR-000003 Hypothesis Review Board Packet

Status: `draft`

## Board Purpose

Review accepted ECR-000003 evidence from `EXP-001`, `EXP-002`, and `EXP-003` and prepare proposal-only hypothesis updates for human approval.

The board does not prove hypotheses correct. The board does not update the durable hypothesis matrix automatically.

## Evidence Scope

- `EXP-001` topology perturbation
- `EXP-002` cross-representation stability
- `EXP-003` isomorphic procedures
- accepted experiment comparison outputs under Comparator `3.1.0`
- explainability support outputs under Comparator `3.2.0`
- EDRs for `EXP-001`, `EXP-002`, and `EXP-003`
- findings, readiness, threats, and claims-review support artifacts

## Instrument Versions

- Official comparison instrument: Comparator `3.1.0`
- Review support layer: Comparator `3.2.0` explainability
- Packet family: ECR-000003 representation-sensitivity multi-model response set

## Experiment Summaries

### EXP-001 Topology Perturbation

- Purpose: test whether topology-preserving or topology-adjacent graph perturbations materially change recovered structure.
- Main pattern: structural backbone remained `mixed`; recognition states varied; primitive and constraint disagreement remained visible.
- Main caution: topology changes did not isolate structural recognition cleanly enough to answer the recognition question on their own.

### EXP-002 Cross-Representation Stability

- Purpose: test whether the same procedure expressed through different representations compresses into a stable recovered structure.
- Main pattern: all records were collected and compared successfully; representation compliance was strong; backbone remained `mixed`; primitive and constraint disagreement persisted.
- Main caution: the evidence is more consistent with partial compression than with strong representation independence.

### EXP-003 Isomorphic Procedures

- Purpose: test whether different domains can instantiate the same procedural structure strongly enough to produce similar recovered outputs.
- Main pattern: backbone, conceptual profile, and dimensional profile were `mostly_stable`; provider-specific recognition behavior remained material; primitive, transition, and constraint disagreement still occurred.
- Main caution: this is the strongest candidate theoretical finding in ECR-000003, but it remains instrument-dependent and vulnerable to recognition leakage.

## Known Instrument Limits

- no blind human baseline
- provider-specific style remains entangled with procedure extraction
- tolerant parsing remained necessary in accepted runs
- explainability outputs are review aids, not accepted replacements for Comparator `3.1.0`
- comparator results remain stronger for backbone-level questions than for primitive or constraint equivalence

## Material Threats

- recognition leakage
- representation-format effects
- schema effects
- model version drift
- domain language effects
- comparator adapter issues
- small number of model providers
- missing human baseline

## Hypotheses Under Review

- `H002` Representation Independence
- `H003` Multi-Model Convergence
- `H013` Recognition Bias
- `H015` Measurement Instrument Reliability
- `H016` Structural Recognition
- `H017` Procedural Compression
- `H018` Procedural Isomorphism

## Board Decision Rules

1. One experiment cannot prove a hypothesis.
2. Model agreement is not independent validation.
3. Provider-specific behavior is not automatically procedural behavior.
4. Literal disagreement is not structural disagreement.
5. Recognition is separate from structural recovery.
6. Instrument findings are not automatically theory findings.
7. Product claims require separate evidence.
8. Kill conditions remain visible.
9. Mixed evidence remains mixed.
10. Uncertainty is acceptable.

## Required Review Sequence

1. Read `HRB-READINESS.md`.
2. Review each file in `review-board/hypotheses/`.
3. Review `HYPOTHESIS-SPLIT-CANDIDATES.md`.
4. Review `HYPOTHESIS-KILL-CONDITION-REVIEW.md`.
5. Review `HYPOTHESIS-REVIEW-BOARD-SUMMARY.md`.
6. Record human decisions in `HYPOTHESIS-REVIEW-BOARD-DECISION.md`.
