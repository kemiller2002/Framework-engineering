packet_id: ECR-000002-P001B
artifact_family_id: P001
recognition_condition: paraphrased
blinded_artifact_id: BR-P001

blinded_procedural_content:

An unresolved situation is identified.

Several candidate accounts of that situation are produced.

One or more candidates are used to determine what distinguishing information should be gathered next.

Information is then gathered in a deliberate way.

The gathered information is checked against the candidate accounts.

Poorly fitting candidates are revised, replaced, or removed.

The cycle can repeat if support remains insufficient.

The process ends when one candidate is supported strongly enough or the expected value of further inquiry is too low.

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

Record uncertainty explicitly.

Return exactly one valid JSON object matching the supplied schema.

Do not include markdown.

json_schema:

```json
{
  "packet_id": "",
  "artifact_family_id": "",
  "recognition_condition": "",
  "blinded_artifact_id": "",
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
```
