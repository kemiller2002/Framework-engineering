# H018 Review

- Hypothesis ID: `H018`
- Name: `Procedural Isomorphism`
- Current statement: Different domains may instantiate the same procedural structure strongly enough to be recognized as structurally similar.
- Research question: Can cross-domain procedures preserve meaningful structural similarity despite vocabulary and context changes?
- Prior direction and strength: `proposed / very low`
- Prior kill-condition status: `not_tested`

## Evidence Supporting

- `EXP-003` reported `mostly_stable` backbone, literal, conceptual, and dimensional profiles across the tested domains.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
- Explainability preserved a distinction between vocabulary shifts and backbone stability.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.2-explainability/isomorphic-procedure-explainability.md`

## Evidence Challenging

- `EXP-003` still showed disagreement in primitive sequence, transitions, and constraints.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
- Leakage findings and high-priority explainability items remain.
  Sources: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`, `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.2-explainability/human-review-priority.md`

## Mixed Evidence

- The evidence is consistent with partial cross-domain structural similarity, but not with strong isomorphic equivalence.

## Provider, Representation, and Domain Effects

- Domain changes did not erase backbone similarity, but they still changed recognition and detail layers.

## Relevant Instrument Findings

- Comparator `3.1.0` captured stronger agreement at backbone and conceptual layers than at primitive or constraint layers.

## Threats

- the selected domains may not be truly isomorphic
- model prior knowledge may supply extra alignment
- no human validation baseline exists

## Alternative Explanations

- Similarity may reflect generic problem-solving templates rather than true domain-independent procedural isomorphism.

## Kill Condition

- Current kill condition: isomorphic procedures with matched control flow produce unrelated structural extractions.
- Status: `tested_not_met`

## Proposed Direction

`slightly_supported`

## Proposed Evidence Strength

`weak`

## Board Recommendation

`retain`

## Rationale

This is the strongest candidate theoretical result from ECR-000003, but it remains provisional and highly dependent on follow-on falsification.

## Next Evidence Needed

- negative non-isomorphic controls
- human expert review
- additional procedural families

## Human Decision

- Decision:
- Reviewer:
- Date:
