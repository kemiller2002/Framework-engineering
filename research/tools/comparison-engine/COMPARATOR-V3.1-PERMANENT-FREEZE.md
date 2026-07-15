# Comparator v3.1 Permanent Freeze

Comparator Version:

`3.1.0`

Freeze Scope:

- official ECR-000003 measurements
- reproducibility baseline
- future comparison reference

Frozen components:

- recognition rules
- structural rules
- primitive reporting rules
- constraint reporting rules
- representation reporting rules
- ontology version
- output contract
- tolerant parsing behavior

Allowed future changes:

- security correction
- raw-data safety correction
- output corruption correction
- adapter-only correction that does not change scoring

Disallowed changes:

- threshold tuning
- ontology tuning to increase agreement
- recognition reclassification
- changed score-bearing fields
- changed agreement categories
- retrospective reinterpretation of ECR-000003

Policy:

Any future scoring change must use Comparator `v3.2` or later with a new version, regression suite, approval, and impact report.

Reference records:

- approval:
  `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/calibration/comparator-v3.1-approval-record.md`
- active freeze record:
  `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/calibration/comparator-v3.1-freeze-record.md`
