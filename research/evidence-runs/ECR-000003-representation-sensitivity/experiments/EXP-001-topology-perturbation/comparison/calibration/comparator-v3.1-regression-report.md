# Comparator v3.1 Regression Report

- total tests: 33
- passed tests: 33
- failed tests: 0
- warnings: 0
- blocking failures: 0
- mode: full

## Exact Failed Test Names

- None

## Raw Response Hash Verification

- verified: yes
- files checked: 13

## Regression Checks

| ID | Severity | Name | Status | Evidence |
|---|---|---|---|---|
| RG-001 | critical | broad-family resemblance with explicit negation becomes partial | PASS | Recognition classifier regression |
| RG-002 | major | `unrecognized` maps to unknown | PASS | Recognition boundary regression |
| RG-003 | major | empty recognition remains not_recognized | PASS | Recognition empty-field regression |
| RG-004 | critical | raw responses are unchanged | PASS | 13 response hashes compared before/after run |
| RG-005 | critical | all generated outputs share one immutable run state | PASS | Run state ID is written from one in-memory result set |
| RG-006 | major | structural backbone stability is separated from wording variance | PASS | Backbone=mixed; Literal=mostly_stable |
| RG-007 | major | neutral identity-node expansion is handled as elaboration | PASS | Backbone profile mixed |
| RG-008 | major | primitive reporting separates role/transition stability from style variance | PASS | Primitive roles, transition backbone, and style variance are all reported |
| RG-009 | major | constraints are compared conceptually across field placement | PASS | Conceptual=disagreement; placement=high |
| RG-010 | major | free-form representation prose is informational rather than score-bearing | PASS | Representation prose metrics demoted to informational status |
| RG-011 | major | tolerant parsing is explicit and auditable | PASS | Tolerant parse events appear in data-quality output |
| RG-012 | critical | EXP-001 outputs regenerated under generated-v3.1 | PASS | /Users/kevinmiller/dev/Framework-engineering/research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/generated-v3.1 |
| RG-013 | critical | no output consistency mismatch | PASS | primary=12; machine=12; dq=5 |

## Promotion Gate

- all critical tests pass: yes
- all major tests pass: yes
- no output consistency mismatch: yes
- no false-recognition regression: yes
- no raw-response mutation: yes
