# Research Operating Manual

## Purpose

This manual defines how Framework Engineering research collects evidence, updates hypotheses, and avoids theory inflation.

## Rules

1. Every new idea starts as a hypothesis.
2. Every hypothesis must have:
   - statement
   - rationale
   - evidence for
   - evidence against
   - confidence
   - kill condition
   - next test
   - dependencies
   - competing hypotheses
3. Every evidence run must test multiple hypotheses when practical.
4. Every run must collect a common measurement set unless there is a documented reason not to.
5. Every run must separate observations from interpretations.
6. Every completed evidence run must produce an Evidence Decision Record before hypothesis review or next-experiment selection.
7. Confidence may not be updated directly from a run or comparator output.
8. The research queue should be updated from accepted EDR output, not from intuition alone.
9. Next experiments should be chosen by expected information gain when practical.
10. New abstractions must explain observations that existing abstractions cannot.
11. Clarity and EDF are consumers of research findings, not proof of the research findings.
12. Research informs product design only after repeated support.
13. Failed hypotheses should be retired, not reworded indefinitely.
14. Kill conditions must be respected.
15. Once a comparator or measurement instrument is approved and frozen for an active ECR, it must remain frozen unless a documented blocking defect requires a versioned emergency change.
16. A downstream experiment may not start until the accepted EDR for the prior experiment selects it or another action as the highest-information next step.

## EDR Flow

ECR or experiment
-> observations
-> comparator or measurement
-> Evidence Decision Record
-> Hypothesis Review Board
-> Research Queue
-> next highest-information experiment

## Response Normalization Gate

Before official comparison:

1. Collect responses.
2. Normalize responses into canonical paths.
3. Verify dataset completeness.
4. Generate normalization certificates.
5. Run Comparator v3.1 only against certified datasets.

Official comparison must refuse missing, blocked, invalidated, or stale certificates.

## Explainability Layer

Comparator v3.1 and Comparator 3.2 serve different functions.

- Comparator v3.1 records the official measurement result.
- Comparator 3.2 explains why differences appeared and which ones matter.

Comparator 3.2 must consume official v3.1 outputs.
It must not overwrite those outputs or update hypotheses automatically.

## Required Operating References

- `research-constitution.md`
- `research-dependency-graph.md`
- `abstraction-governance.md`
- `evidence-run-checklist.md`
- `hypothesis-lifecycle.md`
- `edr/edr-specification.md`
- `research-queue/research-queue.md`
