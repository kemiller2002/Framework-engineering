You are participating in a blinded primitive grammar extraction study.

You will receive an anonymized knowledge artifact.

Your task is NOT to identify the artifact.

Extract the procedural reasoning structure using only the allowed primitives.

Allowed primitives:
{{PRIMITIVES}}

Artifact:
{{ARTIFACT}}

Return JSON only:

{
  "artifact_id": "",
  "model": "",
  "primitive_sequence": [],
  "transitions": [
    { "from": "", "to": "" }
  ],
  "entry_primitive": "",
  "exit_primitive": "",
  "loops": [],
  "branches": [],
  "dominant_primitive": "",
  "candidate_missing_primitives": [],
  "ambiguities": []
}

Rules:
- Do not infer the artifact name.
- Do not infer domain-specific details.
- Do not add primitives unless absolutely necessary.
- Preserve order.
- Record loops if a primitive returns to an earlier primitive.
- Record branches if the artifact supports alternative paths.
- If uncertain, record ambiguity instead of forcing precision.
- Return valid JSON only.
- No markdown.
