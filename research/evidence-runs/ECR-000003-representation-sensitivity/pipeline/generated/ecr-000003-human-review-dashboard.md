# ECR-000003 Human Review Dashboard

## Overall Status

- BLOCKED

## Dataset Readiness

- EXP-001: READY_WITH_WARNINGS
- EXP-002: READY_WITH_WARNINGS
- EXP-003: NOT_READY

## Experiment Comparisons

| Experiment | Comparison Complete | EDR Draft Ready | Data Issues | Human Review |
|---|---|---|---|---|
| EXP-001 | yes | yes | missing=0; malformed=4 | required |
| EXP-002 | no | yes | missing=0; malformed=4 | required |
| EXP-003 | no | yes | missing=9; malformed=0 | required |

## Comparator Status

- Comparator v3.1.0 frozen for ECR-000003.

## EDR Review Order

1. EXP-001
2. EXP-002
3. EXP-003
4. ECR-000003 Summary

## Hypothesis Review Inputs

- pipeline/generated/hypothesis-matrix-update-input.md

## Claims Review Inputs

- pipeline/generated/scientific-claims-review-input.md

## Threats Review Inputs

- pipeline/generated/threats-to-validity-update-input.md

## Blocking Issues

- EXP-003 missing 9 primary responses.

## Exact Next Human Actions

- Review EXP-001 EDR: `edr/EDR-ECR-000003-EXP001.md`
- Review EXP-002 EDR: `edr/EDR-ECR-000003-EXP002.md`
- Review EXP-003 EDR: `edr/EDR-ECR-000003-EXP003.md`
- Review ECR summary EDR: `edr/EDR-ECR-000003-SUMMARY.md`
- Review hypothesis matrix input: `pipeline/generated/hypothesis-matrix-update-input.md`
- Review scientific claims input: `pipeline/generated/scientific-claims-review-input.md`
