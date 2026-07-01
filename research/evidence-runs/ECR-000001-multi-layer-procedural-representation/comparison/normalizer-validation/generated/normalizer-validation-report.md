# Normalizer Validation Report

## Purpose

Validate whether the semantic normalizer preserves procedural distinctions without over-merging concepts.

## Ontology Version

- 0.1

## Summary

- Number of test cases: 20
- Expected passes: 8
- False-positive candidates: 1
- False-negative candidates: 2
- Ontology gaps: 9
- Recommendation: needs_revision

## Interpretation

- Over-merged concepts are treated as the primary risk.
- Unresolved phrases are acceptable when the ontology lacks a safe match.
- This report does not validate semantic normalization; it only audits immediate failure modes.
