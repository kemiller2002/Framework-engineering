# ECR-000002 Run Instructions

## Goal

Collect a manual recognition-sensitivity pass beginning with the `P001D` graph-only stop or go test.

## Execution Mode

Manual execution only.

## Run Order

1. GPT `P001D`
2. Claude `P001D`
3. Gemini `P001D`

Stop after `P001D` and compare recognition and structural stability before running `P002` and `P003` packets.

## Conversation Isolation

- Use a fresh conversation per packet.
- No previous packet should be visible.
- No previous outputs should be visible.

## Save Paths

- `responses/gpt/ECR-000002-P001A-gpt.json`
- `responses/gpt/ECR-000002-P001B-gpt.json`
- `responses/gpt/ECR-000002-P001C-gpt.json`
- `responses/gpt/ECR-000002-P001D-gpt.json`
- `responses/gpt/ECR-000002-P002A-gpt.json`
- `responses/gpt/ECR-000002-P002B-gpt.json`
- `responses/gpt/ECR-000002-P002C-gpt.json`
- `responses/gpt/ECR-000002-P003A-gpt.json`
- `responses/gpt/ECR-000002-P003B-gpt.json`
- `responses/gpt/ECR-000002-P003C-gpt.json`
- `responses/claude/ECR-000002-P001A-claude.json`
- `responses/claude/ECR-000002-P001B-claude.json`
- `responses/claude/ECR-000002-P001C-claude.json`
- `responses/claude/ECR-000002-P001D-claude.json`
- `responses/claude/ECR-000002-P002A-claude.json`
- `responses/claude/ECR-000002-P002B-claude.json`
- `responses/claude/ECR-000002-P002C-claude.json`
- `responses/claude/ECR-000002-P003A-claude.json`
- `responses/claude/ECR-000002-P003B-claude.json`
- `responses/claude/ECR-000002-P003C-claude.json`
- `responses/gemini/ECR-000002-P001A-gemini.json`
- `responses/gemini/ECR-000002-P001B-gemini.json`
- `responses/gemini/ECR-000002-P001C-gemini.json`
- `responses/gemini/ECR-000002-P001D-gemini.json`
- `responses/gemini/ECR-000002-P002A-gemini.json`
- `responses/gemini/ECR-000002-P002B-gemini.json`
- `responses/gemini/ECR-000002-P002C-gemini.json`
- `responses/gemini/ECR-000002-P003A-gemini.json`
- `responses/gemini/ECR-000002-P003B-gemini.json`
- `responses/gemini/ECR-000002-P003C-gemini.json`

## Recording Rules

- Record any malformed output without silently editing it.
- Record recognition in `recognized_artifact` only.
- Do not update hypotheses during execution.
- For `P001D`, compare results against `P001C` before continuing the broader ECR-000002 run.
