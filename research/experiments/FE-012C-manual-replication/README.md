# FE-012C Manual Multi-Model Replication Kit

## Purpose

FE-012C manual replication is a human-operated kit for comparing primitive grammar extraction across GPT, Claude, and Gemini through their web interfaces.

It is designed for transparency and reproducibility.

It does not use APIs, automation, or SDKs.

## Directory Structure

- `protocol.md`
- `primitive-definitions.md`
- `evaluator-rubric.md`
- `experiment-log.md`
- `packet-index.md`
- `packets/`
- `responses/gpt/`
- `responses/claude/`
- `responses/gemini/`
- `comparison/`

## Replication Workflow

1. Open a packet from `packets/`.
2. Paste the entire packet into GPT-5.
3. Save the JSON response in `responses/gpt/`.
4. Paste the identical packet into Claude.
5. Save the JSON response in `responses/claude/`.
6. Paste the identical packet into Gemini.
7. Save the JSON response in `responses/gemini/`.
8. Do not modify the packet prompt.
9. Compare outputs only after all model responses are collected.

No model should ever see another model's response.

## File Naming Convention

All packets and responses use stable packet IDs so results can be compared across models, runs, and future replication rounds.

Packet files use the form:

- `packets/FE-012C-P001-scientific-method.md`

Response files use the form:

- `responses/gpt/FE-012C-P001-gpt.json`
- `responses/claude/FE-012C-P001-claude.json`
- `responses/gemini/FE-012C-P001-gemini.json`

Do not rename packet IDs later.

Do not store model responses without `packet_id`.

Do not mix GPT, Claude, and Gemini outputs in the same folder.

## Limitations

- No APIs
- Human-operated
- Transparent methodology
- Model agreement does not prove the theory
- Disagreement is useful evidence

## Notes

This kit supports model-based replication, not human validation.
