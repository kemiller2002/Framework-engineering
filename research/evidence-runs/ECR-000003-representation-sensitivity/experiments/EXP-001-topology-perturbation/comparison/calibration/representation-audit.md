# Representation Calibration Audit

## Scope

This audit reviews representation-layer outputs:

- procedural AST
- natural-language summary
- canonical summary
- ambiguities
- notes

Current report:

- `procedural_ast_presence`: `full_agreement`
- all other representation fields: `disagreement`

## Field Review

### Procedural AST presence

Assessment:

- reliable signal

Reason:

- the question is binary
- all valid responses provided an AST-like object
- this measures instrument compliance rather than semantic alignment, but it does so consistently

### Natural-language summary

Assessment:

- overly style-dependent

Reason:

- summaries vary in compression level
- some are node-oriented
- some are action-oriented
- some foreground termination and loop logic, others foreground branching

Recommendation:

- informational, not scored

### Canonical summary

Assessment:

- partially useful, but currently too style-dependent for strong scoring

Reason:

- this field is closer to the intended abstraction target than natural-language summary
- but models still vary widely in how much detail they compress

Recommendation:

- keep for review
- do not treat current disagreement labels as stable evidence

### Ambiguities

Assessment:

- useful as a qualitative review aid
- poor as a scored comparison field

Reason:

- ambiguity reporting is highly response-style dependent
- different models surface different subsets of the same uncertainty

Recommendation:

- informational, not scored

### Notes

Assessment:

- not reliable as a scored signal

Reason:

- this field is open-ended explanatory prose
- disagreement here is expected and uninformative

Recommendation:

- informational only

## Reliable Signal Versus Style Noise

| Field | Reliable Signal? | Recommended Use |
|---|---|---|
| `procedural_ast_presence` | Yes | scored or compliance-tracked |
| `natural_language_summary` | No | informational |
| `canonical_summary` | Limited | informational with human review |
| `ambiguities` | Limited | informational |
| `notes` | No | informational only |

## Conclusion

Representation metrics are currently mixed:

- AST presence provides stable instrument-compliance signal
- text-heavy fields are dominated by stylistic variance

Before v3.1:

- representation metrics should be split into:
  - compliance-like fields
  - review-only fields
