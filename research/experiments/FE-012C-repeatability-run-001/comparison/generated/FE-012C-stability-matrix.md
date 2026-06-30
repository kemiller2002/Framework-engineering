# FE-012C Stability Matrix

## Primitive Occurrence Comparison

| Primitive | Dataset A Count | Dataset B Count | Change | Drift Pattern | Notes |
| --- | ---: | ---: | ---: | --- | --- |
| Act | 12 | 17 | +5 | increase |  |
| Allocate | 3 | 2 | -1 | decrease |  |
| Bound | 36 | 29 | -7 | decrease |  |
| Classify | 21 | 24 | +3 | increase |  |
| Communicate | 12 | 13 | +1 | elaboration_increase | Listed as potentially elaboration-sensitive. |
| Compare | 6 | 8 | +2 | elaboration_increase | Listed as potentially elaboration-sensitive. |
| Coordinate | 4 | 4 | 0 | stable |  |
| Decide | 24 | 28 | +4 | increase |  |
| Define | 0 | 2 | +2 | increase |  |
| Define missing | 0 | 1 | +1 | increase |  |
| Evaluate | 21 | 23 | +2 | increase |  |
| Explain | 9 | 9 | 0 | stable |  |
| Generate | 18 | 20 | +2 | increase |  |
| Interpret | 12 | 15 | +3 | elaboration_increase | Listed as potentially elaboration-sensitive. |
| Observe | 24 | 31 | +7 | increase |  |
| Prioritize | 12 | 11 | -1 | decrease |  |
| Reassess | 22 | 24 | +2 | increase |  |
| Reflect | 3 | 5 | +2 | elaboration_increase | Listed as potentially elaboration-sensitive. |
| Sequence | 0 | 1 | +1 | increase |  |
| Verify | 13 | 13 | 0 | stable | Listed as potentially elaboration-sensitive. |

## Stable Primitives

Coordinate, Explain, Verify

## Drift-Prone Primitives

Act, Allocate, Bound, Classify, Communicate, Compare, Decide, Define, Define missing, Evaluate, Generate, Interpret, Observe, Prioritize, Reassess, Reflect, Sequence

## Candidate Backbone Primitives

Coordinate, Explain

## Candidate Elaboration Primitives

Communicate, Compare, Interpret, Reflect, Verify

## Notes On Schema Limitations

- Primitive counts depend on `primitive_sequence` only.
- Missing `reasoning_shape` or `confidence` fields are handled gracefully and do not count as parse failures.
- Primitive frequency change does not by itself distinguish better extraction from more elaborate extraction.
