# H017 Review

- Hypothesis ID: `H017`
- Name: `Procedural Compression`
- Current statement: Different surface representations may compress into a stable recovered procedural structure.
- Research question: Do representation variants compress into the same recovered structure strongly enough to be meaningful?
- Prior direction and strength: `active / low`
- Prior kill-condition status: `not_tested`

## Evidence Supporting

- `EXP-002` completed all expected records and maintained full representation compliance.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
- Explainability reported explicit compressed-step and expanded-step patterns rather than only flat disagreement.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`

## Evidence Challenging

- `EXP-002` still reported `mixed` backbone and disagreement in primitive and constraint layers.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`

## Mixed Evidence

- Compression-like behavior is visible, but not enough to claim that multiple representations reliably collapse into one stable structure.

## Provider, Representation, and Domain Effects

- Representation family matters.
- Some disagreement may reflect optional elaboration or summarization rather than full structural divergence.

## Relevant Instrument Findings

- Backbone measures appear more stable than primitive or constraint measures, which is consistent with a limited compression story.

## Threats

- representation-format effects
- prompt-induced structure
- missing human comparator

## Alternative Explanations

- Apparent compression may be produced by comparator abstraction rather than by the models recovering the same structure.

## Kill Condition

- Current kill condition: narrative, bullet, graph, and transition-table representations produce materially unrelated recovered structures.
- Status: `partially_met`

## Proposed Direction

`slightly_supported`

## Proposed Evidence Strength

`weak`

## Board Recommendation

`retain`

## Rationale

The evidence is more supportive than neutral, but still too limited for a broader compression claim.

## Next Evidence Needed

- negative non-isomorphic controls
- human extraction comparisons
- constraint-layer calibration

## Human Decision

- Decision:
- Reviewer:
- Date:
