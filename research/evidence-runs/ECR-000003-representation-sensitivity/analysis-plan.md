# ECR-000003 Analysis Plan

## EXP-001

Compare:

- classify `recognition_value` for each provider and variant
- compare recognition persistence across providers
- compare recognition persistence against structural stability
- recognition rate across variants
- `recognized_artifact` content
- structural-layer stability
- primitive-layer stability
- graph-derived control-flow stability
- domain terms introduced
- identify whether recognition changes with renumbering, edge-order shuffle, or identity-node expansion

## EXP-002

Compare:

- representation format versus extracted structure
- narrative, bullet, graph, and table stability
- ambiguity changes by representation

## EXP-003

Compare:

- same control-flow across different domains
- domain leakage into procedural extraction
- structural similarity across domain variants

## Comparator Guidance

Use existing comparator v3 and dimensional normalizer if practical.

Do not require new comparator infrastructure in this ECP.
