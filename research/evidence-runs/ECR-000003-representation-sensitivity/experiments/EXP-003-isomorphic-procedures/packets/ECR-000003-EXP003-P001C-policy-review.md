packet_id: ECR-000003-EXP003-P001C
experiment_id: EXP-003
variant_id: P001C
artifact_family_id: P001
recognition_condition: domain_variant_policy
blinded_artifact_id: BR-EXP003-P001

blinded_procedural_content:

A policy position is uncertain.

Candidate interpretations are generated.

Relevant review inputs are gathered.

Interpretations are assessed.

The process loops if acceptability remains insufficient.

The process ends when an interpretation is accepted or further review is not justified.

instructions:

You are participating in a blinded procedural observation study.

Your task is to recover procedural observations from the packet.

Your objective is faithful extraction, not normalization.

Do not evaluate the theory behind the study.

Do not evaluate Framework Engineering.

Do not update hypotheses.

Do not redesign, critique, optimize, or extend the procedure.

If recognition is unavoidable, record it only in the recognized_artifact field.

Do not use prior knowledge of a recognized artifact to fill in structure beyond what is reasonably supported by the packet.

Base your response only on the packet content and reasonable procedural implications of that content.

Do not invent unsupported procedural structure.

If multiple procedural decompositions are equally reasonable, do not choose one simply to make the representation cleaner. Record the ambiguity explicitly.

Prefer reporting multiple plausible interpretations over collapsing them into a single interpretation when the packet supports more than one reading.

For graph or table packets, do not infer domain terminology unless it is present in the packet.

Record uncertainty explicitly.

Return exactly one valid JSON object matching the supplied schema.

Do not include markdown.

json_schema:

```json
{
  "packet_id": "",
  "experiment_id": "",
  "variant_id": "",
  "artifact_family_id": "",
  "recognition_condition": "",
  "blinded_artifact_id": "",
  "recognized_artifact": "",
  "structural_layer": {"entry_conditions":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"exit_conditions":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"required_steps":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"optional_steps":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"loops":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"branches":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"termination_conditions":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"control_flow_shape":""},
  "primitive_layer": {"primitive_sequence":[],"transitions":[],"dominant_primitive":"","candidate_missing_primitives":[]},
  "constraint_layer": {"invariants":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"preconditions":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"postconditions":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"stopping_criteria":[{"value":"","support_level":"","source_text":"","ambiguity":""}],"validity_conditions":[{"value":"","support_level":"","source_text":"","ambiguity":""}]},
  "representation_layer": {"procedural_ast":{},"natural_language_summary":"","canonical_summary":"","ambiguities":[{"location":"","description":"","plausible_interpretations":[],"effect_on_extraction":""}]},
  "recognition_analysis": {"recognition_occurred":"","recognition_basis":"","domain_terms_introduced":[],"prior_knowledge_leakage_risk":""},
  "confidence": {"structural_layer":"","primitive_layer":"","constraint_layer":"","representation_layer":"","recognition_analysis":"","overall":""},
  "notes": ""
}
```
