packet_id: ECR-000003-EXP001-P001B
experiment_id: EXP-001
variant_id: P001B
artifact_family_id: P001
recognition_condition: graph_only_renumbered
blinded_artifact_id: BR-EXP001-P001

blinded_procedural_content:

Graph form:

START -> A7
A7 -> K2
A7 -> M9
A7 -> R4
K2 -> T6
M9 -> T6
R4 -> T6
T6 -> X1
X1 -> Q8 [threshold not met]
X1 -> V3 [one path selected]
X1 -> END [continuation not justified]
Q8 -> K2
Q8 -> M9
Q8 -> R4
V3 -> END

Node notes:

- A7 expands one state into multiple paths.
- T6 adds a differentiating input.
- X1 re-sorts path fit after the new input appears.
- Q8 reopens continuation when separation remains weak.
- V3 closes the graph when one path remains strongest after re-sorting.

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
