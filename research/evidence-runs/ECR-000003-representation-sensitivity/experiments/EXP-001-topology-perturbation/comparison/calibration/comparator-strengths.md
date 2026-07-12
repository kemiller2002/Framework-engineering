Historical calibration artifact. This document describes Comparator v3.0 before the Comparator v3.1 implementation. Current instrument status is recorded in `comparator-v3.1-approval-record.md`, `comparator-v3.1-regression-report.md`, and the `generated-v3.1` outputs.

Historical Status:
Superseded as current-state guidance by Comparator v3.1 implementation and regression results.

# Comparator Strength Register

## Confirmed Strengths

### CS-001 Role-first normalization remains directionally useful

Evidence:

- Despite severe literal disagreement, the overall dimensional structural profile is still `mostly_stable`.

Why it matters:

- This suggests the dimensional layer is preserving some intended construct separation rather than collapsing immediately into lexical mismatch.

### CS-002 Literal versus dimensional separation is conceptually sound

Evidence:

- The comparator preserves distinct literal and dimensional outputs instead of hiding one behind the other.

Why it matters:

- This makes calibration possible.
- It prevents semantic smoothing from erasing raw disagreement.

### CS-003 Recognition persistence can be tracked by provider and variant

Evidence:

- `recognition-persistence-results.csv` and `recognition-persistence-report.md` do capture provider-specific patterns across P001A-P001D.

Why it matters:

- EXP-001 specifically needs variant-by-variant recognition behavior.

### CS-004 Packet version exclusion is scientifically correct

Evidence:

- Pre-fix P001D responses were excluded from the primary comparison.

Why it matters:

- This prevents packet-version contamination from being mistaken for model drift.

### CS-005 Malformed response handling is visible

Evidence:

- The current data-quality report surfaces malformed P001A GPT and P001C Claude responses.

Why it matters:

- Invalid inputs are not silently treated as normal evidence.

### CS-006 Observation-only EDR draft generation is appropriate

Evidence:

- `comparison/generated/edr-draft.md` carries metadata, observations, evidence inputs, and unresolved uncertainty without updating confidence.

Why it matters:

- This preserves the separation between evidence collection and hypothesis review.

### CS-007 Domain leakage is tracked separately from recognition persistence

Evidence:

- leakage findings appear in their own report instead of overwriting recognition classification.

Why it matters:

- This helps preserve analytical separation between "what was recognized" and "what outside language was introduced."
