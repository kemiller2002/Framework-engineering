# FE-012C Repeatability Observations

Repeatability outputs are present and a reproducible dataset comparison pipeline is available through `npm run compare`.

Use the generated reports in `comparison/generated/` as the primary analysis artifacts.

Current generated comparison summary:

- Parsed observations: 90 of 90 expected across both datasets.
- Dataset B files requiring quote normalization before parsing: 15.
- Stable packet/model pairs: 1 of 45.
- Elaboration drift pairs: 8 of 45.
- Structural drift pairs: 36 of 45.
- Backbone-stable pairs: 9 of 45.
- Recognition drift pairs: 41 of 45.

Immediate interpretation:

- The repeatability dataset is usable as collected.
- Storage-format noise exists but did not block parsing.
- Drift is common enough that repeatability should not be described as established.
- Transition and sequence changes dominate the observed differences.

Interpretation constraints:

- Stable agreement is measurement evidence, not theory validation.
- Drift may reflect packet ambiguity, vocabulary pressure, or provider-specific elaboration behavior.
- Repeatability conclusions should be grounded in the generated comparison outputs rather than ad hoc inspection.
