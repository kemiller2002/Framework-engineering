# Five Whys Output 2

## Problem Boundary

Analyze the peak-hours production outage and identify a plausible underlying cause chain without assuming that the recent deployment is necessarily the sole root cause.

## Observations

- Memory exhaustion was observed before the outage.
- A recent deployment occurred earlier the same day.
- Alert noise made it harder to identify the most important signals.
- A rollback attempt failed.
- The runbook was incomplete.
- Ownership during the incident was unclear.

## Why Chain

1. Why did the outage occur?
   The production service likely became unavailable after memory exhaustion.
2. Why did memory exhaustion occur?
   A recent change may have increased memory demand or exposed an existing weakness under peak load.
3. Why was the condition not contained quickly?
   The incident signal was obscured by alert noise and the team did not have a clear operational path.
4. Why was recovery not immediate?
   The rollback attempt failed and the runbook was incomplete.
5. Why did the response process break down?
   Ownership during the incident was unclear, which likely weakened coordinated response.

## Alternative Hypotheses

- A traffic pattern or load spike may have exposed a pre-existing capacity issue.
- The recent deployment may be correlated with the outage without being the direct cause.
- Memory exhaustion may have been a symptom of a broader infrastructure or configuration problem.

## Evidence for Each Why

- Outage linked to memory exhaustion: medium to high, because memory exhaustion was observed before the outage.
- Recent change as cause of memory exhaustion: medium, because a deployment occurred earlier that day but direct causal proof is absent.
- Alert noise delayed containment: medium, because the scenario explicitly states that alert noise made signal prioritization harder.
- Failed rollback and incomplete runbook impaired recovery: high, because both are directly stated in the scenario.
- Unclear ownership weakened incident response: medium to high, because unclear ownership is directly stated and plausibly affects coordination.

## Confidence

Overall confidence: medium

The analysis identifies a plausible combined technical and operational cause chain, but the evidence is insufficient to isolate a single confirmed root cause.

## Verification

- Check deployment diffs, rollout timing, and memory profiles.
- Review system metrics around the onset of memory exhaustion.
- Confirm whether rollback failed because of tooling, configuration mismatch, or procedural confusion.
- Compare the runbook to the actual recovery path attempted.
- Reconstruct ownership and decision flow during the incident timeline.
