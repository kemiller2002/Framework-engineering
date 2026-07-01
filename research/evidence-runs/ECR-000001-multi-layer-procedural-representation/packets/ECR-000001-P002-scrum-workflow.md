# ECR-000001 Calibration Packet

packet_id:
ECR-000001-P002

blinded_artifact_id:
BA-ECR-002

instrument_version:
ECR-000001-v1.1

refinement_reason:
P001 calibration showed models may collapse plausible procedural alternatives; v1.1 asks models to preserve ambiguity and mark evidence support level.

standard_instructions:
You are participating in a blinded procedural observation study.

Your task is to recover procedural observations from the packet.

Your objective is faithful extraction, not normalization.

Do not evaluate the theory behind the study.

Do not evaluate Framework Engineering.

Do not update hypotheses.

Do not redesign, critique, optimize, or extend the procedure.

If recognition is unavoidable, record it only in the recognized_artifact field.

Base your response only on the packet content and reasonable procedural implications of that content.

If multiple procedural decompositions are equally reasonable, do not choose one simply to make the representation cleaner. Record the ambiguity explicitly.

Prefer reporting multiple plausible interpretations over collapsing them into a single interpretation when the packet supports more than one reading.

Do not introduce additional procedural steps solely because they are commonly associated with the recognized artifact.

Do not use prior knowledge of a recognized artifact to fill in structure beyond what is reasonably supported by the packet.

Do not invent unsupported procedural structure.

Record uncertainty explicitly.

Return exactly one valid JSON object matching the supplied schema.

Do not include markdown.

Allowed support_level values:

- explicit
- strongly_implied
- inferred

Definitions:

explicit:
Directly stated in the packet.

strongly_implied:
Not directly stated, but required or strongly implied by the procedural content.

inferred:
A plausible interpretation added by the model, but not required by the text.

For extracted observation arrays, use the preferred object format shown in the schema whenever support level, source text, or ambiguity should be preserved.

Plain strings remain acceptable for concise observations, but object entries are preferred.

blinded_procedural_content:
Define a near-term working target.

Prioritize available work.

Commit to what will be taken into the current work cycle.

Carry out the work to produce an immediately usable result.

Reflect on the cycle outcome and reassess the next cycle.

response_schema:
{
  "packet_id": "ECR-000001-P002",
  "blinded_artifact_id": "BA-ECR-002",
  "recognized_artifact": "",
  "structural_layer": {
    "entry_conditions": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "exit_conditions": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "required_steps": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "optional_steps": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "loops": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "branches": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "termination_conditions": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "control_flow_shape": ""
  },
  "primitive_layer": {
    "primitive_sequence": [],
    "transitions": [],
    "dominant_primitive": "",
    "candidate_missing_primitives": []
  },
  "constraint_layer": {
    "invariants": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "preconditions": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "postconditions": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "stopping_criteria": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "validity_conditions": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ]
  },
  "representation_layer": {
    "procedural_ast": {},
    "natural_language_summary": "",
    "canonical_summary": "",
    "ambiguities": [
      {
        "location": "",
        "description": "",
        "plausible_interpretations": [],
        "effect_on_extraction": ""
      }
    ]
  },
  "product_relevance_layer": {
    "clarity_relevance_observations": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "edf_relevance_observations": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ],
    "research_only_observations": [
      {
        "value": "",
        "support_level": "",
        "source_text": "",
        "ambiguity": ""
      }
    ]
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
