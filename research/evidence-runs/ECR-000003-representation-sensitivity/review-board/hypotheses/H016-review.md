# H016 Review

- Hypothesis ID: `H016`
- Name: `Structural Recognition`
- Current statement: Models may recognize procedural families from topology or structural cues alone.
- Research question: Does recognition persist from structure even when higher-level semantic cues are reduced?
- Prior direction and strength: `active / low`
- Prior kill-condition status: `not_tested`

## Evidence Supporting

- `EXP-001` retained mixed backbone outputs under topology perturbation while recognition categories varied.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/generated-v3.1/exp-001-comparison-summary.md`
- Explainability recorded repeated `recognition_without_structural_effect` cases.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`

## Evidence Challenging

- `EXP-001` still produced `mixed` backbone rather than consistently stable topology-only recovery.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/generated-v3.1/exp-001-comparison-summary.md`
- No accepted pure graph-only control is part of the final ECR-000003 evidence set.

## Mixed Evidence

- ECR-000003 keeps the structural-recognition question active, but does not isolate it cleanly.

## Provider, Representation, and Domain Effects

- Some providers may be more sensitive to structural cues than others, but current evidence is not clean enough to separate that from general recognition bias.

## Relevant Instrument Findings

- Comparator outputs can show recognition states and structural stability side by side, but the underlying packets were not designed as a decisive structure-only test.

## Threats

- topology may still carry recognizable meaning
- perturbations may not be neutral
- missing graph-only control in accepted evidence

## Alternative Explanations

- Recognition may be driven more by residual semantic cueing than by topology alone.
- Apparent structural recognition could be a byproduct of generic procedural priors.

## Kill Condition

- Current kill condition: graph-only topology variants consistently reduce recognition while preserving extracted structure.
- Status: `not_tested`

## Proposed Direction

`waiting`

## Proposed Evidence Strength

`insufficient`

## Board Recommendation

`defer`

## Rationale

This hypothesis remains live but not reviewable to conclusion from accepted ECR-000003 evidence alone.

## Next Evidence Needed

- graph-only recognition-control replication
- low-cue topology controls
- targeted provider comparison

## Human Decision

- Decision:
- Reviewer:
- Date:
