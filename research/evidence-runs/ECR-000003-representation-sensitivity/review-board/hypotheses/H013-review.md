# H013 Review

- Hypothesis ID: `H013`
- Name: `Recognition Bias`
- Current statement: Models may reconstruct familiar frameworks from prior knowledge rather than from packet structure alone.
- Research question: Is recognition materially driving recovered structure?
- Prior direction and strength: `active / moderate`
- Prior kill-condition status: `not_tested`

## Evidence Supporting

- `EXP-003` produced leakage findings and persistent recognition for some providers.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
- Explainability recorded repeated `recognition_without_structural_effect` and `terminology_leakage_only` cases, confirming recognition pressure remains active in the dataset.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`

## Evidence Challenging

- Recognition varied while `EXP-003` backbone remained `mostly_stable`, which weakens the claim that recognition is always required for structural recovery.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md`
- `EXP-001` included `not_recognized`, `partial`, and `unknown` states while still yielding comparator outputs.
  Source: `research/evidence-runs/ECR-000003-representation-sensitivity/pipeline/generated/ecr-000003-comparison-summary.md`

## Mixed Evidence

- Recognition pressure is real, but its effect on recovered structure appears inconsistent rather than universally dominant.

## Provider, Representation, and Domain Effects

- Provider differences appear large enough that recognition bias may not be a single unified phenomenon.
- Domain language and representation cues likely both contribute to recognition.

## Relevant Instrument Findings

- Comparator `3.1.0` can distinguish recognition category differences from structural agreement categories.
- Explainability suggests recognition should be analyzed separately from structural recovery rather than collapsed into one signal.

## Threats

- topology may still be recognizable
- domain terms may cue known frameworks
- no fully accepted recognition-control replication yet

## Alternative Explanations

- Some apparent recognition effects may actually be general reasoning priors rather than artifact recognition.
- Shared procedural schemas may make some framework families naturally easier to reconstruct even without recognition.

## Kill Condition

- Current kill condition: better-blinded or novel artifacts preserve agreement without recognition.
- Status: `tested_not_met`

## Proposed Direction

`mixed`

## Proposed Evidence Strength

`moderate`

## Board Recommendation

`split`

## Rationale

The evidence supports keeping recognition bias active, but the phenomenon is broad enough that lexical recognition, structural recognition, and structural import should be reviewed separately.

## Next Evidence Needed

- recognition-control replication
- negative non-isomorphic controls
- explicit graph-only or low-cue controls

## Human Decision

- Decision:
- Reviewer:
- Date:
