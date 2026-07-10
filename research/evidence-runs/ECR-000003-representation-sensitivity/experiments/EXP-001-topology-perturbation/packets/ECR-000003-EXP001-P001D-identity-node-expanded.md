packet_id: ECR-000003-EXP001-P001D
experiment_id: EXP-001
variant_id: P001D
artifact_family_id: P001
recognition_condition: graph_only_identity_node_expanded
blinded_artifact_id: BR-EXP001-P001
packet_version: 1.1
refinement_reason: Corrected omitted terminal edge so the identity-node-expanded variant preserves the baseline graph topology.

blinded_procedural_content:

Graph form:

START -> N1
N1 -> N1a
N1a -> N2A
N1 -> N1b
N1b -> N2B
N1 -> N1c
N1c -> N2C
N2A -> N3
N2B -> N3
N2C -> N3
N3 -> N4
N4 -> N5 [threshold not met]
N4 -> N6 [one path selected]
N4 -> END [continuation not justified]
N6 -> END
N5 -> N5a
N5a -> N2A
N5 -> N5b
N5b -> N2B
N5 -> N5c
N5c -> N2C

Node notes:

- N1a, N1b, N1c are pass-through states.
- N5a, N5b, N5c are pass-through states.
- N1 expands one state into multiple paths.
- N3 adds a differentiating input.
- N4 re-sorts path fit after the new input appears.
- N5 reopens continuation when separation remains weak.
- N6 closes the graph when one path remains strongest after re-sorting.

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
