# ECR-000003 Human Review Dashboard

## Overall Status

- PARTIAL_READY_FOR_HUMAN_REVIEW

## Dataset Readiness

- EXP-001: READY_WITH_WARNINGS
- EXP-002: READY_WITH_WARNINGS
- EXP-003: BLOCKED

## Experiment Comparisons

| Experiment | Comparison Complete | EDR Draft Ready | Data Issues | Human Review |
|---|---|---|---|---|
| EXP-001 | yes | yes | missing=0; malformed=4 | Draft |
| EXP-002 | yes | yes | missing=0; malformed=4 | Draft |
| EXP-003 | no | no | missing=9; malformed=0 | Deferred |

## Comparator Status

- Comparator v3.1.0 frozen for ECR-000003.

## EDR Review Order

1. EXP-001
2. EXP-002
3. EXP-003
4. ECR-000003 Summary

## Hypothesis Review Inputs

- pipeline/generated/hypothesis-matrix-update-input.md
- review-board/EXP001-review.md
- review-board/EXP002-review.md
- review-board/EXP003-review.md

## Claims Review Inputs

- pipeline/generated/scientific-claims-review-input.md

## Threats Review Inputs

- pipeline/generated/threats-to-validity-update-input.md

## Blocking Issues

- EXP-003 missing 9 primary responses.
- Next action: `npm run collect:exp003`
- Collection progress path: `collection-dashboard/collection-status.json`

## Exact Next Human Actions

- Review EXP-001 EDR: `edr/EDR-ECR-000003-EXP001.md`
- Review EXP-001 review: `review-board/EXP001-review.md`
- Review EXP-002 EDR: `edr/EDR-ECR-000003-EXP002.md`
- Review EXP-002 review: `review-board/EXP002-review.md`
- Review EXP-003 EDR: `edr/EDR-ECR-000003-EXP003.md`
- Review EXP-003 review: `review-board/EXP003-review.md`
- Review ECR summary EDR: `edr/EDR-ECR-000003-SUMMARY.md`
- Review ECR summary review: `review-board/ECR-000003-summary-review.md`
- Review hypothesis matrix input: `pipeline/generated/hypothesis-matrix-update-input.md`
- Review scientific claims input: `pipeline/generated/scientific-claims-review-input.md`
- Collect remaining EXP-003 responses: `npm run collect:exp003`
- Inspect collection progress: `collection-dashboard/collection-status.json`
