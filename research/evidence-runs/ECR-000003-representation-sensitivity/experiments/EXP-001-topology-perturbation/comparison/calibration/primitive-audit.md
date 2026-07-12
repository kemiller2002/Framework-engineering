Historical calibration artifact. This document describes Comparator v3.0 before the Comparator v3.1 implementation. Current instrument status is recorded in `comparator-v3.1-approval-record.md`, `comparator-v3.1-regression-report.md`, and the `generated-v3.1` outputs.

Historical Status:
Superseded as current-state guidance by Comparator v3.1 implementation and regression results.

# Primitive Calibration Audit

## Scope

This audit reviews primitive disagreement behavior reported in:

- `comparison/generated/primitive-stability-report.md`
- canonical EXP-001 response files

Current output:

- `primitive_sequence`: disagreement
- `transitions`: disagreement
- `dominant_primitive`: disagreement
- `candidate_missing_primitives`: disagreement

## Assessment

The primitive comparator is currently too strict for the way models express procedural structure.

The reported disagreement is mostly not evidence of true procedural divergence.

## Source Of Disagreement By Primitive Field

### Primitive sequence

Primary causes:

- wording
- abstraction level
- ordering

Examples:

- node-centric sequences
  - `START -> N1 -> N2A/N2B/N2C -> N3 -> N4`
- action-centric sequences
  - `expand -> converge -> differentiate -> re-sort -> terminate or loop`
- mixed sequences
  - node names plus action labels in one list

Audit classification:

- mostly wording and abstraction
- occasional ordering
- rarely actual procedural difference

### Transitions

Primary causes:

- representation form
- ordering
- compression versus expansion

Examples:

- expanded object form
  - one transition per edge
- compressed string form
  - `N1->N2A|N2B|N2C`
- pass-through expansion in P001D
  - some models include `N1a/N1b/N1c`
  - others compress directly to `N2A/N2B/N2C`

Audit classification:

- mostly representation and ordering
- some actual procedural difference in pass-through handling

### Dominant primitive

Primary causes:

- wording
- ontology

Examples:

- "conditional branching followed by convergence and conditional iteration"
- "expand into candidate paths, merge, differentiate, re-sort, and either continue looping or terminate"
- "branch-converge-reassess"

Interpretation:

- These often point to the same procedural role cluster.
- Current disagreement here is mostly a normalization problem, not a construct problem.

### Candidate missing primitives

Primary causes:

- missing-primitive speculation style
- comparator strictness
- ontology gaps

Examples:

- one model lists threshold definition
- another lists path-selection rule
- another lists evaluation metric

Interpretation:

- This field behaves more like a reviewer note than a stable comparable measurement.
- It should not currently carry the same calibration weight as explicit primitive sequence or transition structure.

## Cause Matrix

| Field | Wording | Ordering | Missing Primitive | Ontology | Actual Procedural Difference |
|---|---|---|---|---|---|
| `primitive_sequence` | High | Medium | Low | Medium | Low |
| `transitions` | Medium | High | Low | Low | Medium |
| `dominant_primitive` | High | Low | Low | High | Low |
| `candidate_missing_primitives` | Medium | Low | High | High | Low |

## Conclusion

Primitive disagreement is currently exaggerated by normalization and representation sensitivity.

Scientifically useful:

- pass-through expansion versus compression in P001D
- explicit versus implicit loop transitions

Not yet scientifically stable:

- dominant primitive
- candidate missing primitives

Calibration implication:

- primitive sequence and transitions may remain score-bearing after calibration
- dominant primitive and candidate missing primitives should be treated as lower-confidence until comparator normalization improves
