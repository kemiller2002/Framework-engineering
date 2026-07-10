# Exp 001 Comparison Summary

Run State: 179fa743-b92a-4f75-b4a2-492fa9eb7898

Experiment: ECR-000003 EXP-001 Topology Perturbation

## Dataset Completeness

- Total records discovered: 12
- Included in primary comparison: 12
- Missing or malformed: 0

## Packet Versions

- ECR-000003-EXP001-P001A: not stated
- ECR-000003-EXP001-P001B: not stated
- ECR-000003-EXP001-P001C: not stated
- ECR-000003-EXP001-P001D: 1.1

## Response Validity

- Valid primary records: 12/12
- Data-quality issues: 5

## Recognition Persistence Summary

- gpt: provider_specific_recognition
- claude: gradual_decay
- gemini: provider_specific_recognition

## Structural Stability Summary

- Backbone profile: mixed
- Literal profile: mostly_stable
- Conceptual profile: mostly_stable
- Dimensional profile: mostly_stable

## Provider-Specific Differences

- gpt pattern: provider_specific_recognition.
- claude pattern: gradual_decay.
- gemini pattern: provider_specific_recognition.
- claude introduced watched domain terms in 3 responses.

## Largest Disagreements

- Structural backbone stability is stronger than wording-sensitive literal agreement.
- Primitive disagreement: primitive_sequence.
- Primitive disagreement: primitive_roles.
- Primitive disagreement: transitions.
- Primitive disagreement: transition_backbone.
- Primitive disagreement: dominant_primitive.
- Primitive disagreement: dominant_role.
- Primitive disagreement: candidate_missing_primitives.
- Constraint disagreement: constraint_layer.invariants.
- Constraint disagreement: constraint_layer.preconditions.
- Constraint disagreement: constraint_layer.postconditions.
- Constraint disagreement: constraint_layer.stopping_criteria.
- Constraint disagreement: constraint_layer.validity_conditions.

## Domain Leakage Findings

- ECR-000003-EXP001-P001A claude: evidence (possible_structural_inference).
- ECR-000003-EXP001-P001C claude: diagnosis, evidence (likely_prior_knowledge_leakage).
- ECR-000003-EXP001-P001D claude: diagnosis, hypothesis testing (likely_prior_knowledge_leakage).

## Unresolved Issues

- ECR-000003-EXP001-P001D gpt: tolerant_parse (Smart-quote / tolerant JSON sanitization was required before parsing.)
- dataset : warning_1 (Tolerant parsing used for ECR-000003-EXP001-P001A gpt: responses/gpt/ECR-000003-EXP001-P001A-gpt.json)
- dataset : warning_2 (Tolerant parsing used for ECR-000003-EXP001-P001B gpt: responses/gpt/ECR-000003-EXP001-P001B-gpt.json)
- dataset : warning_3 (Tolerant parsing used for ECR-000003-EXP001-P001C gpt: responses/gpt/ECR-000003-EXP001-P001C-gpt.json)
- dataset : warning_4 (Tolerant parsing used for ECR-000003-EXP001-P001D gpt: responses/gpt/ECR-000003-EXP001-P001D-gpt.json)

## Readiness For EDR Review

- Observation-only EDR draft is ready for human completion.
