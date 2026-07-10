# Calibration Summary

## What Appears Scientifically Sound

- The comparator can separate literal and dimensional comparison rather than collapsing them into one score.
- Recognition persistence is measurable across providers and packet variants.
- Packet-version exclusion for pre-fix P001D is correct and should remain unchanged.
- Malformed response handling is visible and prevents silent use of broken inputs.
- Observation-only EDR draft generation is appropriate and should remain unchanged.

## What Requires Calibration

- Recognition classification:
  - Claude P001C demonstrates a probable false `recognized`.
  - `unknown` versus `not_recognized` needs explicit rule text for values like `unrecognized`.
- Structural agreement:
  - current summary labels overstate disagreement severity
  - backbone preservation is not represented clearly enough
- Primitive calibration:
  - disagreement is inflated by abstraction level, wording, and ordering choices
- Constraint calibration:
  - current disagreement output is dominated by schema placement and wording effects
- Representation calibration:
  - AST presence is useful
  - text-heavy fields are overly style-dependent
- Output consistency:
  - machine-readable output and human-facing reports are not currently in sync

## What Should Remain Unchanged

- Pre-fix P001D exclusion logic
- distinction between literal and dimensional comparison
- explicit malformed / missing response reporting
- no automatic hypothesis-confidence updates
- separate leakage reporting rather than folding it into recognition classification

## Recommended Comparator Version

Remain v3.0

Rationale:

- Comparator v3 is useful enough to audit and learn from.
- It is not yet calibrated enough to freeze as v3.1.
- The strongest blockers are:
  - false-recognition risk
  - disagreement-severity inflation
  - stale or inconsistent generated outputs

## Decision Threshold For v3.1

Promote to v3.1 only after:

1. Recognition classification edge cases are regression-tested.
2. Structural headlines reflect backbone stability separately from lexical variance.
3. Constraint and representation fields are recalibrated or demoted to informational status where appropriate.
4. Machine-readable and human-facing outputs are guaranteed to describe the same run state.
