# FE-013 Procedural Language Packet

packet_id:
FE-013-P001

blinded_artifact_id:
BA-013-001

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
A process begins when an unresolved situation or unanswered question is identified.

One or more possible explanations are proposed without assuming that any are correct.

Information is intentionally gathered to distinguish between the competing explanations.

The gathered information is examined to determine how well each explanation accounts for the observations.

When confidence is insufficient, additional information may be gathered or alternative explanations may be developed.

This cycle continues until one explanation is sufficiently supported by the available evidence or additional investigation is no longer justified.

output_schema:
{
  "packet_id": "FE-013-P001",
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
