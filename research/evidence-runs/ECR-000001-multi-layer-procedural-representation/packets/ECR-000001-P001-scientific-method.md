# ECR-000001 Calibration Packet

packet_id:
ECR-000001-P001

blinded_artifact_id:
BA-ECR-001

standard_instructions:
You are participating in a blinded procedural observation study.

Your task is to recover procedural observations from the packet.

Do not evaluate the theory behind the study.

Do not evaluate Framework Engineering.

Do not update hypotheses.

Do not redesign, critique, optimize, or extend the procedure.

If recognition is unavoidable, record it only in the recognized_artifact field.

Base your response only on the packet content and reasonable procedural implications of that content.

Do not invent unsupported procedural structure.

Record uncertainty explicitly.

Return exactly one valid JSON object matching the supplied schema.

Do not include markdown.

blinded_procedural_content:
A process begins when an unresolved situation or unanswered question is identified.

One or more possible explanations are proposed without assuming that any are correct.

Information is intentionally gathered to distinguish between the competing explanations.

The gathered information is examined to determine how well each explanation accounts for the observations.

When confidence is insufficient, additional information may be gathered or alternative explanations may be developed.

This cycle continues until one explanation is sufficiently supported by the available evidence or additional investigation is no longer justified.

response_schema:
{
  "packet_id": "ECR-000001-P001",
  "blinded_artifact_id": "BA-ECR-001",
  "recognized_artifact": "",
  "structural_layer": {
    "entry_conditions": [],
    "exit_conditions": [],
    "required_steps": [],
    "optional_steps": [],
    "loops": [],
    "branches": [],
    "termination_conditions": [],
    "control_flow_shape": ""
  },
  "primitive_layer": {
    "primitive_sequence": [],
    "transitions": [],
    "dominant_primitive": "",
    "candidate_missing_primitives": []
  },
  "constraint_layer": {
    "invariants": [],
    "preconditions": [],
    "postconditions": [],
    "stopping_criteria": [],
    "validity_conditions": []
  },
  "representation_layer": {
    "procedural_ast": {},
    "natural_language_summary": "",
    "canonical_summary": "",
    "ambiguities": []
  },
  "product_relevance_layer": {
    "clarity_relevance_observations": [],
    "edf_relevance_observations": [],
    "research_only_observations": []
  },
  "confidence": {
    "structural_layer": "",
    "primitive_layer": "",
    "constraint_layer": "",
    "representation_layer": "",
    "product_relevance_layer": "",
    "overall": ""
  },
  "notes": ""
}
