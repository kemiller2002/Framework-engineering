# FE-013 Procedural Language Packet

packet_id:
FE-013-P004

blinded_artifact_id:
BA-013-004

instructions:
You are participating in a blinded procedural language study.

Do not evaluate the framework.

Do not redesign the framework.

Do not identify the framework unless recognition is unavoidable.

Your task is to recover the procedural structure.

Do not use the primitive vocabulary from FE-012C.

Do not output primitive sequences.

Extract compiler-like procedural properties:
- entry conditions
- exit conditions
- preconditions
- postconditions
- branches
- loops
- invariants
- termination conditions
- procedural AST

Return valid JSON only.

No markdown.

blinded_procedural_content:
Gather findings from a case.

Define the problem boundary.

Generate multiple candidate explanations.

Explain how each candidate fits the findings.

Evaluate relative plausibility.

Decide the next test or action.

Verify the leading explanation.

Reassess if new findings conflict with the current view.

output_schema:
{
  "packet_id": "FE-013-P004",
  "recognized_artifact": "",
  "entry_conditions": [],
  "exit_conditions": [],
  "preconditions": [],
  "postconditions": [],
  "required_steps": [],
  "optional_steps": [],
  "branches": [
    {
      "condition": "",
      "paths": []
    }
  ],
  "loops": [
    {
      "loop_condition": "",
      "returns_to": ""
    }
  ],
  "invariants": [],
  "termination_conditions": [],
  "procedural_ast": {
    "type": "",
    "label": "",
    "children": []
  },
  "canonical_summary": "",
  "ambiguities": [],
  "confidence": {
    "ast": "",
    "constraints": "",
    "overall": ""
  },
  "notes": ""
}

confidence_values:
- High
- Moderate
- Low
