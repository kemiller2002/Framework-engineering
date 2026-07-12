# Comparator v3.1 Closure Report

## Regression Status

PASS.

`comparison/calibration/comparator-v3.1-regression-report.md` records `33` total tests, `33` passed tests, `0` failed tests, and `0` blocking failures.

## Run Consistency Status

PASS.

All generated v3.1 outputs were verified against one immutable run state: `179fa743-b92a-4f75-b4a2-492fa9eb7898`.

- `comparison/generated-v3.1/run-state.json`
- `comparison/generated-v3.1/raw-comparison-data.json`
- `comparison/generated-v3.1/exp-001-comparison-summary.md`
- `comparison/generated-v3.1/data-quality-report.md`
- `comparison/generated-v3.1/recognition-persistence-report.md`
- `comparison/generated-v3.1/structural-stability-report.md`
- `comparison/generated-v3.1/observation-ledger.md`

The `dq=5` shorthand is resolved as:

- `1` explicit `tolerant_parse` event for `ECR-000003-EXP001-P001D` GPT
- `4` dataset-level warning rows documenting tolerant parsing for GPT `P001A` through `P001D`

These are audit-visible data-quality events, not missing or malformed primary records. Dataset completeness remains `12/12`.

## Defect Resolution Summary

- `CD-001` resolved_v3.1
- `CD-002` resolved_v3.1
- `CD-003` resolved_v3.1
- `CD-004` mitigated_v3.1
- `CD-005` resolved_v3.1
- `CD-006` resolved_v3.1
- `CD-007` resolved_v3.1
- `CD-008` mitigated_v3.1

## Approval Scope

Comparator v3.1 is approved only for `ECR-000003`.

Approved experiments:

- `ECR-000003 EXP-001`
- `ECR-000003 EXP-002`
- `ECR-000003 EXP-003`

Comparator approval is not hypothesis validation.

## Freeze Scope

Comparator v3.1 is frozen for `ECR-000003` after limited approval.

- `EXP-002` and `EXP-003` must use the frozen instrument unless a documented blocking defect triggers a versioned emergency change.
- Future ECRs require adapter review.

## Remaining Limitations

- Constraint reporting remains calibration-sensitive.
- Domain-leakage findings remain contextual and should not be treated as recognition proof.
- Future ECRs require adapter review.
- Comparator approval is not hypothesis validation.

## EXP-001 EDR Readiness

`EDR-ECR-000003-EXP001.md` is ready for human completion with verified observations prefilled and interpretation/decision sections left open.

## Exact Next Human Action

Open and complete:

`research/evidence-runs/ECR-000003-representation-sensitivity/edr/EDR-ECR-000003-EXP001.md`

