# ECR-000003 Final Readiness Report

## Overall Status

- BLOCKED

## Response Dataset

| Experiment | Expected | Present | Malformed | Excluded | Status |
|---|---:|---:|---:|---:|---|
| EXP-001 | 12 | 12 | 4 | 0 | READY_WITH_WARNINGS |
| EXP-002 | 12 | 12 | 4 | 0 | READY_WITH_WARNINGS |
| EXP-003 | 9 | 0 | 0 | 0 | NOT_READY |

## Comparison Outputs

| Experiment | Run ID | Comparator | Reports Complete | Status |
|---|---|---|---|---|
| EXP-001 | 179fa743-b92a-4f75-b4a2-492fa9eb7898 | 3.1.0 | yes | available |
| EXP-002 |  | 3.1.0 | no | missing_outputs |
| EXP-003 |  | 3.1.0 | no | missing_outputs |

## EDR Drafts

- `edr/EDR-ECR-000003-EXP001.md`
- `edr/EDR-ECR-000003-EXP002.md`
- `edr/EDR-ECR-000003-EXP003.md`
- `edr/EDR-ECR-000003-SUMMARY.md`

## Hypothesis Review Preparation

- `pipeline/generated/hypothesis-matrix-update-input.md`

## Claims Review Preparation

- `pipeline/generated/scientific-claims-review-input.md`

## Threats Review Preparation

- `pipeline/generated/threats-to-validity-update-input.md`

## Remaining Human Decisions

- Accept or revise experiment EDRs.
- Complete the ECR summary EDR.
- Update the hypothesis evidence matrix manually after accepted EDR review.

## Exact Next Step

Review and accept the three experiment EDRs, then complete the ECR-000003 summary EDR and hypothesis evidence matrix update.
