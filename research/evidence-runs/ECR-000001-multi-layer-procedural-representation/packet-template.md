# ECR-000001 Packet Template

Each packet must include:

- `packet_id`
- `blinded_artifact_id`
- `blinded procedural content`
- `response schema`
- `standard instructions`

## Standard Instructions

Use this exact language in every packet:

```text
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
```
