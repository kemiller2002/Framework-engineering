# P001D Graph Recognition Plan

## Purpose

Test whether recognition persists when the P001 family is expressed primarily as graph topology rather than prose.

## Comparison Set

- `P001C structural`
- `P001D graph_only`

## Fields

- `recognized_artifact`
- `control_flow_shape`
- entry conditions
- exit conditions
- required steps
- loops
- branches
- termination conditions
- primitive sequence
- constraints
- canonical summary

## Key Questions

1. Does recognition persist?
2. Does extracted structure remain stable?
3. Does graph-only content reduce recognition but preserve structure?
4. Do models introduce domain terminology despite instructions?
5. Does `P001D` produce less product relevance speculation?

## Interpretation Rules

- If recognition persists, H016 structural recognition gains preliminary support.
- If recognition drops but structure remains stable, H013 recognition bias weakens as an explanation for extraction.
- If recognition drops and structure collapses, recognition may be materially contributing to extraction.
- If models inject domain terms not present in the graph, mark as prior-knowledge leakage.

## Non-Claim

This comparison is a focused extension inside ECR-000002.

It does not resolve H013 or validate H016 by itself.
