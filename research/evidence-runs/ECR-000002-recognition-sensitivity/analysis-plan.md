# ECR-000002 Analysis Plan

## Within Artifact Family

Compare:

- canonical versus paraphrased versus structural
- graph_only where available
- recognition rate
- structural stability
- primitive stability
- constraint stability
- AST stability
- canonical summary stability

For `P001`, compare `P001C structural` against `P001D graph_only` specifically to isolate topology-level recognition sensitivity.

## Across Artifact Type

Compare:

- reasoning versus execution versus static
- control-flow shape
- loop and branch richness
- termination conditions
- product relevance patterns

## Across Models

Compare:

- GPT versus Claude versus Gemini
- literal agreement
- dimensional agreement
- recognition differences

## H016-Focused Check

For `P001D`, record whether recognition persists after lexical reduction has been pushed below the `P001C` level.

## Comparator Guidance

Use the existing ECR-000001 comparator v3 approach if practical.

This ECP does not require new comparator tooling.

## Interpretation Boundary

No hypothesis confidence updates should occur without human review.
