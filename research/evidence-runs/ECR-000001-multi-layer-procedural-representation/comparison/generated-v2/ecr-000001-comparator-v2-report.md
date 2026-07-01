# ECR-000001 Comparator v2 Report

## Purpose

Report both literal agreement and semantic-normalized agreement for ECR-000001 without hiding surface disagreement.

## Data Set Summary

- Valid files: 8.
- Malformed files: 1.
- Missing files: 0.
- Ontology concepts: 12.

## Literal Agreement Summary

- full_agreement: 0
- partial_agreement: 20
- disagreement: 29
- unclear: 5

## Semantic Agreement Summary

- full_agreement: 37
- partial_agreement: 2
- disagreement: 5
- unclear: 10

## Cases Where Semantic Agreement Improved Over Literal Agreement

- ECR-000001-P001 structural_layer.entry_conditions: literal=partial_agreement, semantic=full_agreement, shared concepts=ENTRY_PROBLEM_IDENTIFICATION.
- ECR-000001-P001 structural_layer.exit_conditions: literal=partial_agreement, semantic=full_agreement, shared concepts=CONFIDENCE_THRESHOLD, REASSESSMENT_LOOP, TERMINATION_OR_CLOSURE.
- ECR-000001-P001 structural_layer.required_steps: literal=partial_agreement, semantic=full_agreement, shared concepts=COMPARISON, EVIDENCE_EVALUATION, HYPOTHESIS_GENERATION, INFORMATION_GATHERING, REASSESSMENT_LOOP.
- ECR-000001-P001 structural_layer.loops: literal=disagreement, semantic=full_agreement, shared concepts=CONFIDENCE_THRESHOLD, REASSESSMENT_LOOP.
- ECR-000001-P001 structural_layer.branches: literal=partial_agreement, semantic=full_agreement, shared concepts=TERMINATION_OR_CLOSURE.
- ECR-000001-P001 structural_layer.termination_conditions: literal=partial_agreement, semantic=full_agreement, shared concepts=TERMINATION_OR_CLOSURE.
- ECR-000001-P001 constraint_layer.preconditions: literal=disagreement, semantic=full_agreement, shared concepts=ENTRY_PROBLEM_IDENTIFICATION.
- ECR-000001-P001 constraint_layer.postconditions: literal=disagreement, semantic=full_agreement, shared concepts=TERMINATION_OR_CLOSURE.
- ECR-000001-P001 constraint_layer.stopping_criteria: literal=disagreement, semantic=full_agreement, shared concepts=CONFIDENCE_THRESHOLD, TERMINATION_OR_CLOSURE.
- ECR-000001-P001 constraint_layer.validity_conditions: literal=disagreement, semantic=full_agreement, shared concepts=INFORMATION_GATHERING.
- ECR-000001-P001 representation_layer.natural_language_summary: literal=disagreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION.
- ECR-000001-P001 representation_layer.canonical_summary: literal=disagreement, semantic=full_agreement, shared concepts=ENTRY_PROBLEM_IDENTIFICATION, EVIDENCE_EVALUATION, TERMINATION_OR_CLOSURE.
- ECR-000001-P001 representation_layer.ambiguities: literal=disagreement, semantic=full_agreement, shared concepts=COMMITMENT_DECISION.
- ECR-000001-P001 product_relevance_layer.clarity_relevance_observations: literal=disagreement, semantic=full_agreement, shared concepts=EXECUTION_CYCLE.
- ECR-000001-P001 product_relevance_layer.edf_relevance_observations: literal=disagreement, semantic=full_agreement, shared concepts=TERMINATION_OR_CLOSURE.
- ECR-000001-P002 structural_layer.exit_conditions: literal=partial_agreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION, REASSESSMENT_LOOP, TERMINATION_OR_CLOSURE.
- ECR-000001-P002 structural_layer.required_steps: literal=partial_agreement, semantic=full_agreement, shared concepts=COMMITMENT_DECISION, EVIDENCE_EVALUATION, REASSESSMENT_LOOP.
- ECR-000001-P002 structural_layer.loops: literal=partial_agreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION, REASSESSMENT_LOOP.
- ECR-000001-P002 constraint_layer.invariants: literal=partial_agreement, semantic=full_agreement, shared concepts=COMMITMENT_DECISION.
- ECR-000001-P002 constraint_layer.postconditions: literal=partial_agreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION, REASSESSMENT_LOOP.
- ECR-000001-P002 representation_layer.natural_language_summary: literal=disagreement, semantic=full_agreement, shared concepts=COMMITMENT_DECISION, EVIDENCE_EVALUATION.
- ECR-000001-P002 representation_layer.canonical_summary: literal=disagreement, semantic=full_agreement, shared concepts=COMMITMENT_DECISION, EVIDENCE_EVALUATION, EXECUTION_CYCLE, REASSESSMENT_LOOP.
- ECR-000001-P002 representation_layer.ambiguities: literal=disagreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION, REASSESSMENT_LOOP, TERMINATION_OR_CLOSURE.
- ECR-000001-P002 product_relevance_layer.research_only_observations: literal=disagreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION, EXECUTION_CYCLE.
- ECR-000001-P003 structural_layer.entry_conditions: literal=partial_agreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 structural_layer.exit_conditions: literal=partial_agreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 structural_layer.required_steps: literal=partial_agreement, semantic=full_agreement, shared concepts=COMPARISON, HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 structural_layer.branches: literal=partial_agreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 structural_layer.termination_conditions: literal=partial_agreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION, HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 constraint_layer.invariants: literal=disagreement, semantic=full_agreement, shared concepts=COMPARISON, HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 constraint_layer.preconditions: literal=disagreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 constraint_layer.postconditions: literal=partial_agreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 constraint_layer.validity_conditions: literal=disagreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 representation_layer.natural_language_summary: literal=disagreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION, HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 representation_layer.canonical_summary: literal=disagreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 representation_layer.ambiguities: literal=disagreement, semantic=full_agreement, shared concepts=EVIDENCE_EVALUATION.
- ECR-000001-P003 product_relevance_layer.clarity_relevance_observations: literal=disagreement, semantic=full_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.
- ECR-000001-P003 product_relevance_layer.research_only_observations: literal=disagreement, semantic=partial_agreement, shared concepts=HIERARCHICAL_CLASSIFICATION.

## Cases Where Disagreement Remains After Semantic Normalization

- ECR-000001-P001 structural_layer.optional_steps: disagreement remains after semantic normalization.
- ECR-000001-P001 product_relevance_layer.research_only_observations: disagreement remains after semantic normalization.
- ECR-000001-P002 structural_layer.branches: disagreement remains after semantic normalization.
- ECR-000001-P002 structural_layer.termination_conditions: disagreement remains after semantic normalization.
- ECR-000001-P002 product_relevance_layer.clarity_relevance_observations: disagreement remains after semantic normalization.

## Instrument Readiness Recommendation

Conditionally ready. Semantic normalization is available, but malformed input remains a tooling threat.

## Caution

- Literal disagreement remains real at the surface representation level.
- Semantic agreement indicates possible conceptual overlap, not proven equivalence.
- If semantic agreement increases while literal agreement remains low, the instrument may be collecting equivalent concepts in varied wording.
- If semantic disagreement remains high, either the models differ structurally or the ontology is incomplete.
- If many items are unresolved, the ontology needs revision before strong conclusions.
- Semantic normalization is provisional and is a measurement aid, not theory validation.

## Validation Note

Semantic normalization requires validation before hypothesis confidence updates.
