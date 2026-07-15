# Compression And Elaboration Rules

Comparator 3.2 classifies granularity relationships as:

- `equivalent_same_granularity`
- `equivalent_compressed`
- `equivalent_expanded`
- `partially_equivalent_compressed`
- `partially_equivalent_expanded`
- `incompatible_granularity`
- `unclear`

Interpretation rules:

- Expanded or compressed wording can still preserve the same backbone.
- Neutral pass-through steps usually count as `elaboration_only`.
- Expanded forms do not collapse into equivalence when they introduce unsupported branches or termination conditions.
- Compression and elaboration are diagnostic only. They do not change official v3.1 classifications.
