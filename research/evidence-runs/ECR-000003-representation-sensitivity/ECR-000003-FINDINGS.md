# ECR-000003 Findings

## Executive Summary

ECR-000003 completed three experiments on topology perturbation, cross-representation stability, and cross-domain procedural isomorphism using certified datasets, frozen Comparator `v3.1.0`, and Comparator `3.2.0` explainability support. The evidence is consistent with limited backbone stability under some transformations, persistent provider-specific variation, and continued recognition or domain-language pressure. The run supports cautious methodological claims more strongly than broad theoretical claims.

## Research Questions

- `RQ-REP-001`
  Does topology perturbation materially change recovered procedural structure?
- `RQ-REP-002`
  Do different surface representations compress into a stable recovered structure?
- `RQ-REP-003`
  Can different domains instantiate a partially stable shared procedural backbone?
- `RQ-REP-004`
  Is the current measurement instrument reliable enough to support formal evidence review?

## Method Summary

- experiment structure:
  three experiments, covering topology perturbation, cross-representation stability, and cross-domain procedural isomorphism
- providers:
  `gpt`, `claude`, `gemini`
- normalization:
  response normalization and dataset certification completed for all experiments
- dataset certification:
  all three experiment datasets were certified before official comparison
- Comparator v3.1:
  official ECR-000003 measurements were produced under frozen Comparator `3.1.0`
- Comparator 3.2 explainability:
  post-processing explainability outputs were generated without rescoring official results
- EDR review:
  experiment and summary EDR drafts exist; human acceptance remains pending
- hypothesis review:
  an ECR-000003 hypothesis review board packet and summary now exist as draft synthesis artifacts

## EXP-001 Findings

- `EXP-001` completed all `12` expected records.
- Structural backbone result remained `mixed`.
- Primitive stability and constraint concept comparison both remained in disagreement.
- Representation compliance was `full_agreement`.
- Interpretation:
  topology perturbation did not collapse the experiment, but it did not establish robust topology invariance either.

Evidence:

- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/generated-v3.1/exp-001-comparison-summary.md`

## EXP-002 Findings

- `EXP-002` completed all `12` expected records.
- Structural backbone result remained `mixed`.
- Primitive stability and constraint concept comparison remained in disagreement.
- Representation compliance was `full_agreement`.
- Explainability identified compression and elaboration patterns, but not enough to erase substantive disagreement.

Evidence:

- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.1/exp-002-comparison-summary.md`
- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/comparison/generated-v3.2-explainability/cross-representation-explainability.md`

## EXP-003 Findings

- `EXP-003` completed all `9` expected records.
- Structural backbone, literal, conceptual, and dimensional profiles were all `mostly_stable`.
- Primitive sequence, transitions, dominant primitives, and constraint fields still showed disagreement.
- Recognition differed by provider: `gpt` persistent recognition, `claude` gradual decay, `gemini` persistent recognition.
- Domain leakage was visible, but explainability attributed many cases to terminology presence without observed backbone change.

Evidence:

- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.1/comparison-summary.md`
- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/comparison/generated-v3.2-explainability/isomorphic-procedure-explainability.md`

## Cross-Experiment Findings

### Repeated Observations

- Datasets were completed, normalized, certified, and compared successfully across all three experiments.
- Primitive and constraint disagreement persisted more often than representation compliance failure.

### Provider-Specific Patterns

- Provider-specific recognition and decomposition patterns remained visible and require continued caution.

### Representation Effects

- Representation changes did not destroy comparability, but they did not preserve every measured layer.

### Domain Effects

- Cross-domain vocabulary shifts remained visible in `EXP-003`, even where backbone stability appeared stronger than expected.

### Recognition Effects

- Recognition pressure remained active, but did not uniformly determine backbone change.

### Structural Backbone Effects

- Backbone stability was weakest in `EXP-001` and `EXP-002`, and strongest in `EXP-003`.

### Primitive Effects

- Primitive sequence and transition disagreement remained common across all three experiments.

### Constraint Effects

- Constraint disagreement remained common and often looked like field placement or decomposition variance rather than simple absence.

### Instrument Findings

- The measurement instrument was strong enough to support formal evidence review.
- It was not strong enough to remove the need for human review or to settle unresolved theoretical questions.

## Hypothesis Evidence Summary

| Hypothesis | Proposed Direction | Proposed Strength | Key Support | Key Challenge |
|---|---|---|---|---|
| H002 | mixed | weak | `EXP-003` mostly stable backbone across domain variants | `EXP-002` mixed backbone and disagreement in primitive/constraint layers |
| H003 | slightly_supported | weak | cross-model backbone stability appears in `EXP-003` | `EXP-001` and `EXP-002` remain mixed |
| H013 | mixed | moderate | leakage and recognition persistence are real observed phenomena | recognition did not always alter backbone |
| H015 | slightly_supported | moderate | ECR-000003 completed certified, frozen-instrument comparison and explainability | tolerant parsing and no human baseline remain |
| H016 | waiting | insufficient | topology perturbation keeps the question active | no clean accepted graph-only control |
| H017 | mixed | weak | compression/elaboration patterns observed in `EXP-002` | structural and constraint disagreement remain |
| H018 | slightly_supported | weak | `EXP-003` mostly stable backbone across domains | primitive, transition, and constraint disagreement remain |

## Claims Supported Cautiously

- Evidence is consistent with structural backbone being more stable than some wording-sensitive layers in parts of ECR-000003.
- Observations suggest recognition pressure and watched terminology are real threats, but they do not always produce backbone change.
- Candidate methodological finding:
  packet-based procedural extraction can support formal evidence review when combined with normalization, certification, comparator freeze, and explainability.
- Candidate theoretical finding:
  cross-domain procedural isomorphism warrants further testing because `EXP-003` produced `mostly_stable` backbone profiles despite domain changes.

## Claims Not Supported

- Framework Engineering is proven.
- universal procedural grammar is proven.
- Clarity improves real-world decisions.
- EDF improves reasoning.
- human and model reasoning are equivalent.
- all model providers behave similarly.
- recognition is required for structural recovery.

## Threats to Validity

- graph representation may prime procedural analysis
- topology may still be recognizable
- perturbations may not preserve perceived structure
- node labels may carry hidden semantics
- domain examples may not be truly isomorphic
- prompt may induce structured outputs
- model prior knowledge
- no human validation
- tolerant parsing remained necessary for some records

## Remaining Uncertainty

- whether negative non-isomorphic controls would sharply reduce apparent backbone stability
- whether human experts would recover similar structures from the same packets
- whether provider-specific differences reflect style, knowledge, or genuine structural disagreement
- whether recognition pressure can be cleanly separated into lexical and structural forms

## Recommended Next Research Action

Run negative non-isomorphic controls before opening a new exploratory ECR family.

Rationale:

- the highest current risk is false structural equivalence
- `EXP-003` produced the most promising structural result, so the next test should be adversarial
- this would challenge H018 directly and clarify how much structure survives when apparent isomorphism is intentionally removed

## What ECR-000003 Contributes

- a completed three-experiment representation-sensitivity evidence packet
- the first formal use of certified datasets plus a frozen comparator in this research line
- explainability outputs that separate some lexical, compression, and recognition differences from backbone effects
- a concrete basis for formal hypothesis review

## What ECR-000003 Does Not Establish

- no hypothesis is proven
- no product claim is validated
- no universal grammar has been demonstrated
- no claim of human/model equivalence is warranted
- no evidence supports automatic expansion to ECR-000004 without review
