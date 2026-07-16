# ECR-000003 Hypothesis Kill-Condition Review

| Hypothesis | Current Kill Condition | Tested By ECR-000003? | Relevant Evidence | Weak / Broad? | Recommended Refinement |
|---|---|---|---|---|---|
| H002 | primitive, AST, constraint, and natural-language representations produce unrelated results | yes | `EXP-002` and `EXP-003` preserved some backbone stability but not full layer stability | somewhat broad | distinguish backbone collapse from detail-layer disagreement |
| H003 | agreement falls apart across diversified artifacts or repeatability runs | yes | `EXP-001` and `EXP-002` mixed; `EXP-003` stronger | broad | specify which layer must collapse for the kill condition to count |
| H013 | better-blinded or novel artifacts preserve agreement without recognition | yes, partially | recognition varied while some backbone stability remained | broad | separate lexical recognition from structural effect |
| H015 | JSON validity, schema compliance, and agreement collapse across runs | yes | normalization and comparator workflow succeeded; tolerant parsing persisted | workable but mixed constructs | split data-quality failure from semantic-comparison failure |
| H016 | graph-only topology variants consistently reduce recognition while preserving extracted structure | no | no accepted graph-only control in reviewed set | appropriately narrow | keep as written until a decisive control exists |
| H017 | narrative, bullet, graph, and transition-table representations produce materially unrelated recovered structures | yes | `EXP-002` mixed backbone and disagreement in detail layers | broad | distinguish role compression from transition and constraint compression |
| H018 | isomorphic procedures with matched control flow produce unrelated structural extractions | yes | `EXP-003` mostly stable backbone but disagreement remains | workable | add an explicit negative-control comparison requirement |

## Review Notes

- Kill conditions should remain visible even where results are favorable.
- Several current kill conditions are too broad because they do not distinguish backbone-level weakening from full multi-layer failure.
- `H016` is the cleanest current kill condition, but it remains untested in accepted ECR-000003 evidence.
