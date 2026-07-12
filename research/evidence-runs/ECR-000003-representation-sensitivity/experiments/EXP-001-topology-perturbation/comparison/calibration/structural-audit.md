Historical calibration artifact. This document describes Comparator v3.0 before the Comparator v3.1 implementation. Current instrument status is recorded in `comparator-v3.1-approval-record.md`, `comparator-v3.1-regression-report.md`, and the `generated-v3.1` outputs.

Historical Status:
Superseded as current-state guidance by Comparator v3.1 implementation and regression results.

# Structural Agreement Audit

## Scope

This audit reviews the structural disagreement behavior reported in:

- `comparison/generated/structural-stability-report.md`
- `comparison/generated/exp-001-comparison-summary.md`
- canonical response files used by EXP-001

## Headline Assessment

The structural comparator is measuring something real, but the disagreement presentation is not calibrated to the intended construct.

Observed problem:

- every provider-scope and variant-scope row is labeled `disagreement-heavy`
- the overall structural profile is still `mostly_stable`

That combination strongly suggests that literal structural comparison is over-counting wording and decomposition differences as structural disagreement.

## Disagreement Categories

### A. Literal only

These are the dominant cases.

Examples:

- `entry_conditions`
  - "Procedure begins at START and enters N1"
  - "START node is reached"
  - "Execution starts at START node leading directly to A7"
- `exit_conditions`
  - some providers merge both exits into one sentence
  - others split them into separate items
- `required_steps`
  - some responses list graph nodes
  - others list graph actions
  - others combine node plus action

Interpretation:

- The underlying topology is usually preserved.
- The comparator is mostly reacting to phrasing and decomposition choices.

### B. Dimensional only

Few clear examples were observed.

Interpretation:

- Dimensional normalization is not the main source of false structural disagreement here.
- Most structural instability is created before dimensional comparison, at the field/value representation level.

### C. True structural disagreement

Some real structural divergence does exist, but it is narrower than the current report implies.

Examples:

- P001D introduces pass-through nodes `N1a/N1b/N1c` and `N5a/N5b/N5c`.
  - Some responses treat them as explicit structural steps.
  - Others compress them into the higher-level expansion and loop.
- Claude P001B introduces an extra inferred exit interpretation:
  - "Procedure may exit at END via X1 when threshold is not met"
  - That adds structural semantics beyond the packet's explicit topology.

Interpretation:

- These are real disagreements, but they are localized.
- They do not justify the blanket impression that all provider or variant comparisons are structurally unstable.

### D. Possible ontology deficiency

Examples:

- `entry_conditions` and `exit_conditions` show persistent dimensional weakness even when all responses obviously refer to start/end topology.
- The role-first normalization does not appear strong enough to collapse:
  - begin / enter / start / initiate
  - exit / terminate / close / reach END

Interpretation:

- Structural disagreement is inflated partly because the dimensional ontology is not yet strong on boundary-condition language.

### E. Comparator defect

Most important defect:

- Scope-level summary language (`disagreement-heavy`) does not reflect the actual research question for EXP-001.

Why:

- EXP-001 is about topology perturbation stability.
- The current structure comparator gives little weight to backbone preservation and too much weight to field-level wording divergence.

## Audit Summary

| Area | Primary Cause |
|---|---|
| Entry conditions | A, D |
| Exit conditions | A, D |
| Required steps | A, C |
| Loops | A with some C |
| Branches | A with some C |
| Termination conditions | A, D |
| Scope-level summary labels | E |

## Conclusion

Structural comparison is directionally useful, but not yet calibrated for scientific freezing.

What is trustworthy:

- the comparator does detect malformed or missing data
- it preserves the distinction between literal and dimensional comparison
- it surfaces real pass-through-node and inferred-exit differences

What is not yet trustworthy:

- the severity implied by `disagreement-heavy`
- the use of field-level textual divergence as a proxy for structural instability

Recommended calibration target before v3.1:

- separate backbone preservation from explanatory phrasing variance
- keep literal reporting, but do not let it dominate the structural headline
