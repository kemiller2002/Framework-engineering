# ARC-004 - Tiny Problem

Status: Working draft

## Scenario

My coffee maker will not turn on.

## Purpose

Test whether Framework Engineering recognizes when a lightweight process is appropriate.

## Expected Good Behavior

- Use the smallest useful analysis.
- Downshift to EDF-0 or equivalent minimal diagnostic form.
- Avoid unnecessary FCR-heavy, multi-lens, or full Reference Case treatment.
- Produce immediate practical control points.

## Framework Response

Complexity: Very Low

## Known

- Coffee maker does not power on.

## Unknown

- Outlet status
- Power cord status
- GFCI / breaker state
- Reservoir / carafe interlock
- Switch or internal fuse

## Immediate Control Points

1. Verify outlet has power.
2. Verify power cord is fully seated.
3. Check GFCI or breaker.
4. Ensure reservoir and carafe are properly installed.
5. If still dead, test for failed switch or internal thermal fuse.

## Confidence

Moderate.

## Reason

Common failure modes are known, but evidence does not justify assuming a single cause.

## Result

PASS.

## Finding

Framework Engineering did not over-engineer a trivial problem.

## Calibration Behavior

Complexity Calibration.
