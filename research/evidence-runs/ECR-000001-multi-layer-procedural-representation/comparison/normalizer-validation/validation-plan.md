# Validation Plan

## Purpose

Validate whether the semantic normalizer preserves meaningful procedural distinctions without collapsing distinct concepts too aggressively.

## Phases

Phase 1:
Adversarial pair testing.

Phase 2:
Audit existing Comparator v2 matches.

Phase 3:
Identify false positives.

Phase 4:
Identify false negatives.

Phase 5:
Recommend ontology changes.

Phase 6:
Decide whether Comparator v2 is safe for hypothesis review.

## Principles

- Literal differences must remain visible.
- Prefer unresolved over incorrect normalization.
- Over-merged concepts are more dangerous than unresolved concepts.
- Semantic agreement is not proof of equivalence.
