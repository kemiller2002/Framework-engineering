# ECR-000003 Hypothesis Review Board Summary

Status: `proposal_only`

| Hypothesis | Prior Direction | Proposed Direction | Prior Strength | Proposed Strength | Kill Condition | Recommendation |
|---|---|---|---|---|---|---|
| H002 | unresolved | slightly_supported | low-moderate | weak | tested_not_met | retain |
| H003 | unresolved | slightly_supported | moderate | weak | partially_met | retain |
| H013 | unresolved | mixed | moderate | moderate | tested_not_met | split |
| H015 | unresolved | supported | moderate | moderate | tested_not_met | retain |
| H016 | unresolved | waiting | low | insufficient | not_tested | defer |
| H017 | unresolved | slightly_supported | low | weak | partially_met | retain |
| H018 | proposed | slightly_supported | very low | weak | tested_not_met | retain |

## Strongest Supporting Patterns

- `EXP-003` preserved more backbone-level stability across domains than either `EXP-001` or `EXP-002`.
- ECR-000003 completed end-to-end under a frozen comparator and normalization workflow.
- Explainability supports the claim that some disagreement is elaboration or wording drift rather than pure structural collapse.

## Strongest Challenges

- Primitive, transition, and constraint disagreements remained material across experiments.
- Provider-specific recognition behavior stayed visible.
- No accepted human baseline exists.

## Mixed Findings

- Representation changes do not uniformly destroy structure, but neither do they preserve all layers reliably.
- Recognition pressure is real, but its structural effect appears uneven rather than uniformly dominant.
- Cross-provider convergence appears stronger at backbone layers than at detailed semantic layers.

## Most Affected Hypotheses

- `H013` because recognition pressure remained active but not uniformly causal.
- `H015` because the instrument performed well enough for review, but still with visible caveats.
- `H018` because `EXP-003` produced the strongest provisional cross-domain signal.

## Least-Tested Hypotheses

- `H016` because no accepted graph-only control exists in the reviewed evidence set.

## Possible Splits

- `H003` backbone convergence vs primitive convergence vs recognition convergence
- `H013` recognition persistence vs recognition import vs structural effect
- `H016` topology-driven recognition vs semantic-cue-driven recognition
- `H017` role compression vs transition compression vs constraint compression

## Instrument Dependencies

- accepted quantitative interpretation depends on Comparator `3.1.0`
- supporting interpretation depends on Comparator `3.2.0` explainability
- accepted evidence still depends on normalization and file-certification workflow

## Limiting Threats

- missing human baseline
- recognition leakage
- representation-format effects
- provider-specific style
- possible comparator abstraction effects

## Next Evidence Priorities

1. Negative non-isomorphic controls
2. Human baseline procedural extraction
3. Recognition-control replication
4. Constraint-layer calibration
5. Model-version repeatability

## Human Decisions Required

- accept or revise each proposed direction and strength
- decide whether to split `H013`
- decide whether `H016` should remain active or move to deferred status
- approve or reject the matrix-update proposal
- approve the next highest-information research action
