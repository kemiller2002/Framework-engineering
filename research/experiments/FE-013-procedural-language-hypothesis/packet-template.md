# FE-013 Packet Template

Each packet should include:

- `packet_id`
- `blinded_artifact_id`
- `blinded_procedural_content`
- `instructions`
- `output_schema`
- `confidence_values`

## Packet Instructions

Use this instruction block in every packet:

```text
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
```

## Confidence Values

- High
- Moderate
- Low
