# OODA Output 2

## Observe

- Unusual network traffic has been detected.
- The activity may indicate ransomware, but that is not confirmed.
- Telemetry is incomplete.
- There is time pressure.
- Executives want a rapid recommendation.
- Response options include immediate isolation, additional evidence gathering, or narrower containment first.

## Evidence Status

- Confirmed: unusual traffic exists; telemetry is incomplete; the team is under time and executive pressure.
- Uncertain: whether the activity is active ransomware, a false positive, or precursor movement.
- Missing: precise scope, affected assets, and confidence about compromise status.

## Orientation Assumptions

- Immediate broad isolation may reduce risk if compromise is active but could disrupt operations unnecessarily.
- Waiting for perfect certainty is unrealistic under the current time pressure.
- A narrow containment-first response is only defensible if reassessment happens quickly.

## Decision Options

- Immediate broad isolation
- Narrow containment first
- Gather more evidence before containment

## Confidence / Uncertainty

Recommended option confidence: medium

Uncertainty remains high because the telemetry is incomplete and the scenario does not confirm active ransomware.

## Action

Recommend narrow containment first while accelerating evidence collection and preparing escalation criteria for broader isolation.

## Reassessment Triggers

- Confirmation of encryption activity or known ransomware indicators
- Evidence of lateral movement affecting additional assets
- Loss of confidence in the initially contained scope
- New telemetry showing the activity is benign or attributable to a non-ransomware cause
