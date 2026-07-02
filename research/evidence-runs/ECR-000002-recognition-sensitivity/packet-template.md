# ECR-000002 Packet Template

Each packet must include:

- `packet_id`
- `artifact_family_id`
- `recognition_condition`
- `blinded_artifact_id`
- `blinded_procedural_content`
- `instructions`
- `response schema`

## Required Packet Rules

- Do not include the source artifact name in the prompt body.
- Do not include local file references.
- Do not include hypothesis update instructions.
- Do not include Framework Engineering, Clarity, or EDF validation language.
- Do not leave placeholder text.

## Standard Instructions

Use this exact language in every packet:

```text
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
```
