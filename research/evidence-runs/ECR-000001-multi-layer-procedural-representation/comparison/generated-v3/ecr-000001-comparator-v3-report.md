# ECR-000001 Comparator v3 Report

## Purpose

Report literal agreement, flat semantic agreement, and role-first dimensional agreement without hiding surface disagreement.

## Why v3 Exists

- v2 could over-merge phrases that shared an object noun but differed in procedural role.
- v3 separates role, object, purpose, stage, and control flow.
- role is primary, so object overlap alone cannot create equivalence.

## v1 / v2 / v3 Behavior

- v1 literal full/partial/disagreement/unclear: 0/20/29/5
- v2 flat semantic full/partial/disagreement/unclear: 37/2/5/10
- v3 dimensional full/partial/disagreement/unclear: 25/18/6/5

## False-Positive Reduction

- Fields reduced from flat-semantic full agreement to a weaker dimensional result: 15.
- v3 false-positive candidates: 0.
- v3 validation recommendation: safe_for_limited_calibration_use.

## Unresolved Items

- Unresolved dimensional matches recorded: 708.

## Caution

- v3 is still provisional.
- Literal disagreement remains visible and is not overridden by dimensional matching.
- Dimensional agreement is a measurement aid, not proof of equivalence.
