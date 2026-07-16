# H002 Review

- Hypothesis ID: `H002`
- Name: `Representation Independence`
- Current statement: Procedural structure may remain more stable than any single surface representation.
- Research question: Does recovered structure remain meaningfully stable when surface representation changes?
- Prior direction and strength: `active / low-moderate`
- Prior kill-condition status: `not_tested`

## Evidence Supporting

- `EXP-002` completed all expected records and maintained full representation compliance.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
- `EXP-003` reported `mostly_stable` backbone, conceptual profile, and dimensional profile across domain variants.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`

## Evidence Challenging

- `EXP-002` still reported primitive disagreement and constraint disagreement.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
- Explainability still surfaced material structural divergences and high-priority review items.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`

## Mixed Evidence

- Backbone stability appears stronger than primitive or constraint stability, but the evidence does not justify treating representation changes as harmless.
  Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/ECR-000003-FINDINGS.md`

## Provider, Representation, and Domain Effects

- Provider effects remain visible, which weakens any strong claim that representation alone explains the observed stability.
- Representation effects appear smaller at the backbone layer than at the primitive and constraint layers.
- Domain effects in `EXP-003` did not erase backbone similarity, but they still affected recognition and detail layers.

## Relevant Instrument Findings

- Comparator `3.1.0` remains frozen for accepted measurement.
- Comparator `3.2.0` explainability supports a backbone-versus-detail distinction, but does not remove ambiguity.

## Threats

- representation-format effects
- prompt-induced structure
- missing human baseline
- comparator-dependent interpretation

## Alternative Explanations

- Apparent stability may reflect comparator abstraction rather than true representation independence.
- Shared packet schema may constrain outputs enough to create partial similarity regardless of representation.

## Kill Condition

- Current kill condition: primitive, AST, constraint, and natural-language representations produce unrelated results.
- Status: `tested_not_met`

## Proposed Direction

`slightly_supported`

## Proposed Evidence Strength

`weak`

## Board Recommendation

`retain`

## Rationale

The evidence supports limited backbone-level robustness across representations, but not a stronger claim of broad representation independence.

## Next Evidence Needed

- negative non-isomorphic controls
- human baseline extraction
- repeated representation-family calibration

## Human Decision

- Decision:
- Reviewer:
- Date:
