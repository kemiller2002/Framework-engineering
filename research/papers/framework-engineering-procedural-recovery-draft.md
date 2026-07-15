# Recovering Procedural Structure Across Topology, Representation, and Domain Changes

> Internal research draft. Not peer reviewed. Claims remain provisional.

## Abstract

This draft summarizes ECR-000003, a three-experiment study on whether procedural structure can be recovered under topology perturbation, representation shifts, and domain changes. The evidence supports cautious methodological claims more strongly than broad theoretical claims. Comparator `v3.1.0` provided the official measurement baseline, and Comparator `3.2.0` explainability supported interpretation without changing official scores.

## Introduction

Framework Engineering currently investigates whether procedural artifacts exhibit recoverable structure that is more stable than their surface language. The present draft focuses on evidence from ECR-000003 rather than on claims of validation.

## Research Questions

- Can topology perturbation preserve enough signal for structural recovery?
- Can multiple surface representations compress into a related recovered structure?
- Can different domains instantiate partially similar procedural backbones?
- Is the current measurement instrument reliable enough for formal review?

## Methodology

ECR-000003 used three experiments:

- `EXP-001` topology perturbation
- `EXP-002` cross-representation stability
- `EXP-003` procedural isomorphism

Each experiment used `gpt`, `claude`, and `gemini`. Responses were normalized, certified, compared under Comparator `3.1.0`, and then reviewed through Comparator `3.2.0` explainability outputs.

## EXP-001 Topology Perturbation

`EXP-001` suggests topology perturbation does not fully destroy measurement, but the resulting backbone remained mixed and primitive/constraint disagreement persisted.

## EXP-002 Cross-Representation Stability

`EXP-002` suggests representation changes preserve some comparability while still producing meaningful disagreement in primitive and constraint layers.

## EXP-003 Procedural Isomorphism

`EXP-003` suggests different domains can produce `mostly_stable` backbone profiles under this instrument, but provider-specific recognition, primitive disagreement, and constraint disagreement remain important caveats.

## Results

- all three datasets completed certified official comparison
- `EXP-003` produced the strongest backbone stability signal
- primitive and constraint disagreement persisted across experiments
- provider-specific recognition and leakage patterns remained visible

## Discussion

The results are consistent with partial backbone stability and partial structural recovery. They are not sufficient to conclude that all measured disagreements are superficial, or that recognition has no structural role.

## Threats to Validity

- no human baseline
- provider-specific response style
- recognition and vocabulary leakage
- topology recognition risk
- limited artifact family count
- tolerant parsing events

## Implications for Framework Engineering

Framework Engineering may have a useful methodological path for structured procedural comparison, but ECR-000003 does not validate the broader discipline.

## Implications for Measurement

Comparator `3.1.0` appears adequate as an official ECR-local measurement instrument. Comparator `3.2.0` improves interpretability but should not be confused with rescoring.

## Future Work

- negative non-isomorphic controls
- human baseline extraction
- recognition-control replication
- additional artifact families

## Conclusion

ECR-000003 provides a usable evidence packet for hypothesis review. It supports cautious claims about measurement and possible structural recovery while preserving important contradictory evidence.

## Appendix A — Instruments

- response normalization and certification
- Comparator `3.1.0`
- Comparator `3.2.0` explainability

## Appendix B — Experiment Artifacts

- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/`
- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-002-cross-representation-stability/`
- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/`

## Appendix C — Hypothesis Mapping

- H002 Representation Independence
- H003 Multi-Model Convergence
- H013 Recognition Bias
- H015 Measurement Instrument Reliability
- H016 Structural Recognition
- H017 Procedural Compression
- H018 Procedural Isomorphism
