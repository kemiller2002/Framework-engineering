# ECR-000003 Hypothesis Review Board

Status: `draft`

Comparator used for official measurements: `3.1.0`

Explainability used for review support: `3.2.0-explainability`

## H002 Representation Independence

- Research question:
  Does procedural structure remain more stable than any single representation?
- Prior direction:
  active / unresolved
- Prior evidence strength:
  low-moderate
- Evidence supporting:
  `EXP-002` retained full representation compliance while comparator outputs remained available across all 12 records. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
  `EXP-003` reported `mostly_stable` backbone, conceptual profile, and dimensional profile across domain variants. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
- Evidence challenging:
  `EXP-002` still reported primitive disagreement and constraint disagreement. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
  `ECR-000003` explainability shows many material structural divergences and medium/high review priorities remain. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- Contradictory or mixed evidence:
  Backbone stability appears stronger than literal and primitive sequence stability, but not strong enough to treat representation changes as harmless. Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- Instrument limitations:
  No human baseline; tolerant parsing remained visible in all three experiments. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`
- Threats to validity:
  representation-format effects, prompt-induced structure, comparator output only. Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/threats-to-validity-update-input.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/threats-to-validity.md`
- Kill condition:
  Primitive, AST, constraint, and natural-language representations produce unrelated results.
- Kill condition status:
  `tested_not_met`
- Proposed direction:
  `mixed`
- Proposed evidence strength:
  `weak`
- Board recommendation:
  `retain`
- Rationale:
  Evidence is consistent with partial representation robustness, but disagreement in primitive and constraint layers prevents a stronger claim.
- Next evidence needed:
  Negative non-isomorphic controls and a human baseline.

## H003 Multi-Model Convergence

- Research question:
  Do different model families converge on similar procedural structures under the same instrument?
- Prior direction:
  active / unresolved
- Prior evidence strength:
  moderate
- Evidence supporting:
  `EXP-003` showed `mostly_stable` structural backbone across providers and variants. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
  All three experiments completed with full primary datasets under Comparator `3.1.0`. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`
- Evidence challenging:
  `EXP-001` and `EXP-002` structural backbone remained `mixed`. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/generated-v3.1/exp-001-comparison-summary.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
  Provider-specific recognition patterns diverged, especially in `EXP-003` (`gpt` persistent, `claude` gradual decay, `gemini` persistent). Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
- Contradictory or mixed evidence:
  Convergence appears stronger for backbone than for primitive sequence, transitions, or constraints. Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- Instrument limitations:
  Model families are limited to three providers; no blind human comparator exists.
- Threats to validity:
  provider-specific response style, model version drift, recognition leakage. Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/threats-to-validity-update-input.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/threats-to-validity.md`
- Kill condition:
  Agreement falls apart across diversified artifacts or repeatability runs.
- Kill condition status:
  `partially_met`
- Proposed direction:
  `slightly_supported`
- Proposed evidence strength:
  `weak`
- Board recommendation:
  `retain`
- Rationale:
  Cross-model convergence is present at some layers, but not sufficiently stable across all measured layers.
- Next evidence needed:
  Human baseline extraction and additional artifact families.

## H013 Recognition Bias

- Research question:
  Are models reconstructing known frameworks from prior knowledge rather than extracting packet structure?
- Prior direction:
  active / unresolved
- Prior evidence strength:
  moderate
- Evidence supporting:
  `EXP-003` produced five leakage findings and persistent recognition for `gpt` and `gemini`. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
  Explainability recorded `recognition_without_structural_effect: 40` and `terminology_leakage_only: 28`, confirming recognition pressure remained active in the data. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- Evidence challenging:
  Recognition varied while the `EXP-003` backbone remained `mostly_stable`, which weakens the claim that recognition is always required for structural recovery. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
  `EXP-001` included `not_recognized`, `partial`, and `unknown` states within one experiment while still yielding comparator outputs. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`
- Contradictory or mixed evidence:
  Recognition pressure is clearly present, but its structural import appears inconsistent rather than dominant in every case.
- Instrument limitations:
  Recognition-control replication and graph-only follow-on work remain incomplete.
- Threats to validity:
  topology may still be recognizable; domain terms may cue familiar families. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/threats-to-validity.md`
- Kill condition:
  Better-blinded or novel artifacts preserve agreement without recognition.
- Kill condition status:
  `tested_not_met`
- Proposed direction:
  `mixed`
- Proposed evidence strength:
  `moderate`
- Board recommendation:
  `split`
- Rationale:
  Evidence suggests lexical recognition bias and structural recognition pressure should be reviewed separately rather than collapsed into one hypothesis.
- Next evidence needed:
  Negative non-isomorphic controls and explicit recognition-control replication.

## H015 Measurement Instrument Reliability

- Research question:
  Can the packet-based instrument collect comparable procedural-structure outputs reliably enough for research use?
- Prior direction:
  active / unresolved
- Prior evidence strength:
  moderate
- Evidence supporting:
  All ECR-000003 datasets were normalized, certified, and compared under frozen Comparator `3.1.0`. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/response-filename-verification-report.md`
  Official outputs, explainability outputs, and EDR drafts were generated for all three experiments. Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-final-readiness-report.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/comparator-3.2-explainability-implementation-report.md`
- Evidence challenging:
  Tolerant parsing remained necessary in `EXP-001` (5), `EXP-002` (4), and `EXP-003` (3). Source: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`
  Explainability still surfaced many high-priority differences requiring human review. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- Contradictory or mixed evidence:
  The instrument is operational and reproducible enough to support review, but not strong enough to remove human interpretation or comparator caveats.
- Instrument limitations:
  Comparator output is still the primary evidence source; no accepted human baseline exists.
- Threats to validity:
  schema effects, comparator adapter issues, tolerant parsing events. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/threats-to-validity-update-input.md`
- Kill condition:
  JSON validity, schema compliance, and agreement collapse across runs.
- Kill condition status:
  `tested_not_met`
- Proposed direction:
  `slightly_supported`
- Proposed evidence strength:
  `moderate`
- Board recommendation:
  `strengthen_qualitatively`
- Rationale:
  The instrument worked end-to-end for ECR-000003, but only with visible caveats and review burden.
- Next evidence needed:
  Human baseline comparison and non-isomorphic negative controls.

## H016 Structural Recognition

- Research question:
  Can models recognize procedural families from topology alone?
- Prior direction:
  active / unresolved
- Prior evidence strength:
  low
- Evidence supporting:
  `EXP-001` retained mixed backbone outputs under topology perturbation while recognition categories varied. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/generated-v3.1/exp-001-comparison-summary.md`
  Explainability recorded repeated `recognition_without_structural_effect` cases. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- Evidence challenging:
  `EXP-001` still produced `mixed` backbone rather than consistently stable topology-only recovery. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/generated-v3.1/exp-001-comparison-summary.md`
  The graph-only recognition-control follow-up was not part of the final ECR-000003 evidence set.
- Contradictory or mixed evidence:
  Observations suggest structural recognition remains plausible, but not cleanly isolated.
- Instrument limitations:
  No accepted pure graph-only control in this reviewed evidence packet.
- Threats to validity:
  topology may still be recognizable; perturbations may not preserve perceived structure. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/threats-to-validity.md`
- Kill condition:
  If graph-only topology variants consistently reduce recognition while preserving extracted structure, recognition is not primarily topology-driven.
- Kill condition status:
  `not_tested`
- Proposed direction:
  `waiting`
- Proposed evidence strength:
  `insufficient`
- Board recommendation:
  `defer`
- Rationale:
  ECR-000003 raises the question but does not cleanly answer it.
- Next evidence needed:
  Explicit graph-only or recognition-control replication.

## H017 Procedural Compression

- Research question:
  Do different surface representations compress into a stable recovered structure?
- Prior direction:
  active / unresolved
- Prior evidence strength:
  low
- Evidence supporting:
  `EXP-002` completed all 12 records with full representation compliance. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
  Explainability reported explicit compressed-step and expanded-step patterns rather than only flat disagreement. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- Evidence challenging:
  `EXP-002` still reported `mixed` backbone and disagreement in primitive and constraint layers. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
- Contradictory or mixed evidence:
  Compression-like behavior appears, but full structural compression into one stable recovered form is not established.
- Instrument limitations:
  No human comparator to confirm whether compression findings reflect procedure understanding or model-specific summarization.
- Threats to validity:
  representation-format effects, schema effects, prompt-induced structure. Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/threats-to-validity-update-input.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/threats-to-validity.md`
- Kill condition:
  If narrative, bullet, graph, and transition-table representations produce materially unrelated recovered structures, the compression hypothesis weakens.
- Kill condition status:
  `partially_met`
- Proposed direction:
  `mixed`
- Proposed evidence strength:
  `weak`
- Board recommendation:
  `retain`
- Rationale:
  Compression patterns are visible, but not yet strong enough for a broader generalization.
- Next evidence needed:
  Negative controls and human extraction comparisons.

## H018 Procedural Isomorphism

- Research question:
  Can different domains instantiate the same procedural structure strongly enough to be recognized as structurally similar?
- Prior direction:
  proposed
- Prior evidence strength:
  very low
- Evidence supporting:
  `EXP-003` reported `mostly_stable` backbone, literal, conceptual, and dimensional profiles across technical troubleshooting, logistics routing, and policy review. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
  Explainability preserved a distinction between vocabulary shifts and backbone stability. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.2-explainability/isomorphic-procedure-explainability.md`
- Evidence challenging:
  `EXP-003` still showed disagreement in primitive sequence, transitions, and constraints. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
  Five leakage findings and multiple high-priority explainability items remain in the experiment. Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.2-explainability/human-review-priority.md`
- Contradictory or mixed evidence:
  The evidence is consistent with partial cross-domain structural similarity, but not with strong isomorphic equivalence.
- Instrument limitations:
  No negative non-isomorphic controls and no human baseline.
- Threats to validity:
  domain examples may not be truly isomorphic; model prior knowledge; no human validation. Source: `research/evidence-runs/ECR-000003-representation-sensitivity/threats-to-validity.md`
- Kill condition:
  If isomorphic procedures with identical control-flow produce unrelated structural extractions, the isomorphism hypothesis weakens.
- Kill condition status:
  `tested_not_met`
- Proposed direction:
  `slightly_supported`
- Proposed evidence strength:
  `weak`
- Board recommendation:
  `retain`
- Rationale:
  This is the most promising candidate theoretical finding in ECR-000003, but it remains provisional and instrument-dependent.
- Next evidence needed:
  Negative non-isomorphic controls and human expert review.

## Board-Wide Notes

- No recommendation in this document is automatically accepted.
- Proposed directions and strengths are inputs for human review, not durable hypothesis-matrix changes.
- Contradictory evidence remains visible by design.
