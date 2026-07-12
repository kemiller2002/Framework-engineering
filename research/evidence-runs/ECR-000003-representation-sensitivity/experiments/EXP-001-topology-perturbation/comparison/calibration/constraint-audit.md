Historical calibration artifact. This document describes Comparator v3.0 before the Comparator v3.1 implementation. Current instrument status is recorded in `comparator-v3.1-approval-record.md`, `comparator-v3.1-regression-report.md`, and the `generated-v3.1` outputs.

Historical Status:
Superseded as current-state guidance by Comparator v3.1 implementation and regression results.

# Constraint Calibration Audit

## Scope

This audit reviews:

- `comparison/generated/constraint-stability-report.md`
- canonical EXP-001 response files

Current output marks every constraint field as `disagreement`.

## Headline Assessment

The current constraint comparator is not yet measuring the intended construct consistently.

Most of the reported disagreement appears to come from:

- schema differences
- wording differences
- field-placement differences
- comparator strictness

Not primarily from genuine procedural disagreement.

## Constraint Field Review

### Invariants

Observed behavior:

- some models treat pass-through-node properties as invariants
- others treat reconvergence at `N3` as the invariant
- others treat ordering of differentiating input before re-sorting as the invariant

Audit judgment:

- mostly schema and wording driven
- not strong evidence of true disagreement

### Preconditions

Observed behavior:

- some responses include only `START -> N1`
- others add "differentiating input appears before re-sorting"
- others move those conditions into validity conditions instead

Audit judgment:

- mostly field-placement and schema difference

### Postconditions

Observed behavior:

- some responses describe termination through `END`
- others describe strongest-path closure
- others merge the two

Audit judgment:

- mostly wording and comparator strictness

### Stopping criteria

Observed behavior:

- some responses treat `continuation not justified` as a stopping criterion
- some treat `one path remains strongest` as a stopping criterion
- some list both

Audit judgment:

- partly genuine modeling difference
- mostly schema sensitivity because the packet naturally supports both criteria

### Validity conditions

Observed behavior:

- some responses use this field for "re-sorting occurs after differentiating input"
- others place that same idea under invariants or preconditions

Audit judgment:

- mostly schema difference and comparator strictness

## Cause Classification

| Field | Genuine Differences | Schema Differences | Wording | Comparator Strictness | Ontology Gaps |
|---|---|---|---|---|---|
| Invariants | Low | High | High | Medium | Low |
| Preconditions | Low | High | Medium | Medium | Low |
| Postconditions | Low | Medium | High | Medium | Low |
| Stopping criteria | Medium | Medium | Medium | Medium | Low |
| Validity conditions | Low | High | Medium | Medium | Low |

## Conclusion

Constraint comparison should not be frozen in its current scoring form.

What is trustworthy:

- the comparator correctly exposes that models distribute similar ideas across different constraint fields

What is not trustworthy:

- the conclusion that constraint preservation is broadly poor

Calibration recommendation:

- constraint metrics should remain visible
- but current disagreement labels should not yet be interpreted as reliable evidence of construct-level divergence
