# Next Research Decision

Status: `proposal`

## Candidate A — Human Baseline Procedural Extraction

- expected information gain:
  `high`
- hypotheses affected:
  `H002`, `H003`, `H015`, `H017`, `H018`
- falsification value:
  `high`
- effort:
  `high`
- dependency value:
  `high`
- publication value:
  `very_high`
- urgency:
  `high`

## Candidate B — Negative Non-Isomorphic Controls

- expected information gain:
  `very_high`
- hypotheses affected:
  `H002`, `H013`, `H016`, `H017`, `H018`
- falsification value:
  `very_high`
- effort:
  `medium`
- dependency value:
  `very_high`
- publication value:
  `very_high`
- urgency:
  `very_high`

## Candidate C — Model-Version Stability

- expected information gain:
  `medium`
- hypotheses affected:
  `H003`, `H015`
- falsification value:
  `medium`
- effort:
  `medium`
- dependency value:
  `medium`
- publication value:
  `medium`
- urgency:
  `medium`

## Candidate D — Additional Procedural Families

- expected information gain:
  `high`
- hypotheses affected:
  `H003`, `H017`, `H018`
- falsification value:
  `high`
- effort:
  `high`
- dependency value:
  `medium`
- publication value:
  `high`
- urgency:
  `medium`

## Candidate E — Recognition-Control Replication

- expected information gain:
  `high`
- hypotheses affected:
  `H013`, `H016`
- falsification value:
  `high`
- effort:
  `medium`
- dependency value:
  `high`
- publication value:
  `high`
- urgency:
  `high`

## Recommended Candidate

`Candidate B — Negative Non-Isomorphic Controls`

## Rationale

- The largest current interpretive risk is false structural equivalence.
- `EXP-003` produced the strongest candidate theoretical signal, so the next test should be adversarial rather than confirmatory.
- Negative controls would directly test whether the instrument incorrectly reports stable structure when only superficial similarity is present.
- This decision also informs H013, H016, H017, and H018 at once.

## Alternatives Considered

- Human baseline remains the strongest follow-on for publication quality, but it is more expensive and should benefit from a sharper adversarial model-side test first.
- Recognition-control replication remains important, but it narrows one threat rather than addressing false equivalence directly.

## Not Authorized Automatically

- Do not create `ECR-000004` from this proposal alone.
