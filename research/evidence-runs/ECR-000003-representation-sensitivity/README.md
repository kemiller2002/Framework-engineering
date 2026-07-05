# ECR-000003 Representation Sensitivity

## Purpose

ECR-000003 is a representation-sensitivity experiment series.

It follows ECR-000002 and tests which features carry procedural recognition and structural extraction:

- topology
- surface representation
- domain semantics
- graph form
- node labels
- edge ordering

This series is designed to produce the next high-information observations without requiring new comparator infrastructure.

Models do not update hypotheses directly.

## Research Questions

- `RQ-REP-001`: Does recognition persist under topology-preserving graph perturbations?
- `RQ-REP-002`: Do different surface representations of the same procedure produce stable recovered structures?
- `RQ-REP-003`: Can different domains with the same control-flow produce structurally similar extractions?
- `RQ-REP-004`: Do models differ systematically in structural recognition behavior?

## Experiments

- `EXP-001`: topology perturbation
- `EXP-002`: cross-representation stability
- `EXP-003`: isomorphic procedures

## Hypotheses In Scope

- H016 Structural Recognition
- H017 Procedural Compression
- H018 Procedural Isomorphism
- H013 Recognition Bias
- H003 Multi-Model Convergence
- H015 Measurement Instrument Reliability
- H002 Representation Independence

## Contents

- `pre-registration.md`
- `research-questions.md`
- `hypothesis-impact-matrix.md`
- `shared-response-schema.json`
- `shared-instructions.md`
- `run-instructions.md`
- `analysis-plan.md`
- `interpretation-rules.md`
- `threats-to-validity.md`
- `decision-log.md`
- `metrics/`
- `comparison/`
- `experiments/`
