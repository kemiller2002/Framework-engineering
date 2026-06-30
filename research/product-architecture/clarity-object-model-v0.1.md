# Clarity Object Model v0.1

Status:
Conceptual model.

Purpose:
Describe how Clarity represents movement from uncertainty to decision.

## Core Objects

- Mission
- Objective
- Question
- Belief
- Evidence
- Assumption
- Alternative
- Confidence
- Kill Condition
- Evidence Run
- Decision
- Commitment

## Relationships

- Mission owns Objectives.
- Objective generates Questions.
- Question contains competing Beliefs.
- Belief is supported or weakened by Evidence.
- Belief depends on Assumptions.
- Belief competes with Alternatives.
- Belief has Confidence.
- Belief has Kill Conditions.
- Evidence Runs update Beliefs.
- Beliefs can produce Decisions.
- Decisions can create Commitments.
- Commitments move into EDF for execution.

## Conceptual Graph

```text
Mission
  -> Objective
    -> Question
      -> Belief
        -> Evidence
        -> Assumption
        -> Alternative
        -> Confidence
        -> Kill Condition
        -> Evidence Run
      -> Decision
        -> Commitment
          -> EDF
```

## Key Principle

Clarity stores beliefs, not notes.

Notes, documents, emails, reports, and observations become evidence attached to beliefs.

This model emerged from research practice but does not validate the research theory.
