# Unresolved Items Sampling Plan

Purpose:
Before ECR-000002, sample unresolved dimensional items to determine whether unresolved count reflects ontology gaps, extractor verbosity, or appropriate conservatism.

Plan:
- Sample 50 unresolved items.
- Categorize each as:
  - safe_unresolved
  - ontology_gap
  - extractor_noise
  - schema_issue
  - should_have_matched

Decision rule:
- If most are safe_unresolved, proceed.
- If most are ontology_gap, revise ontology.
- If most are extractor_noise, revise packet instructions.
- If most are schema_issue, revise schema.
