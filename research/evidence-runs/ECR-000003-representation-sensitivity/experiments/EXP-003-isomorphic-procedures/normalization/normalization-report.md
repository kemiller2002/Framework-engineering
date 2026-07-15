# EXP-003 Normalization Report

- Expected responses: 9
- Canonical responses: 9
- Status: READY_WITH_WARNINGS
- Dataset hash: 8b201a821fc0ecc06c87ad051f549f4af1952b9f34e06f2fefd373b3279b2953

## Canonical Responses

- ECR-000003-EXP003-P001A claude: responses/claude/ECR-000003-EXP003-P001A-claude.json
- ECR-000003-EXP003-P001A gemini: responses/gemini/ECR-000003-EXP003-P001A-gemini.json
- ECR-000003-EXP003-P001A gpt: responses/gpt/ECR-000003-EXP003-P001A-gpt.json
- ECR-000003-EXP003-P001B claude: responses/claude/ECR-000003-EXP003-P001B-claude.json
- ECR-000003-EXP003-P001B gemini: responses/gemini/ECR-000003-EXP003-P001B-gemini.json
- ECR-000003-EXP003-P001B gpt: responses/gpt/ECR-000003-EXP003-P001B-gpt.json
- ECR-000003-EXP003-P001C claude: responses/claude/ECR-000003-EXP003-P001C-claude.json
- ECR-000003-EXP003-P001C gemini: responses/gemini/ECR-000003-EXP003-P001C-gemini.json
- ECR-000003-EXP003-P001C gpt: responses/gpt/ECR-000003-EXP003-P001C-gpt.json

## Moves

- experiments/EXP-003-isomorphic-procedures/responses/claude/ECR-000003-EXP003-P001A-claude.json -> responses/claude/ECR-000003-EXP003-P001A-claude.json
- experiments/EXP-003-isomorphic-procedures/responses/gemini/ECR-000003-EXP003-P001A-gemini.json -> responses/gemini/ECR-000003-EXP003-P001A-gemini.json
- experiments/EXP-003-isomorphic-procedures/responses/gpt/ECR-000003-EXP003-P001A-gpt.json -> responses/gpt/ECR-000003-EXP003-P001A-gpt.json
- experiments/EXP-003-isomorphic-procedures/responses/claude/ECR-000003-EXP003-P001B-claude.json -> responses/claude/ECR-000003-EXP003-P001B-claude.json
- experiments/EXP-003-isomorphic-procedures/responses/gemini/ECR-000003-EXP003-P001B-gemini.json -> responses/gemini/ECR-000003-EXP003-P001B-gemini.json
- experiments/EXP-003-isomorphic-procedures/responses/gpt/ECR-000003-EXP003-P001B-gpt.json -> responses/gpt/ECR-000003-EXP003-P001B-gpt.json
- experiments/EXP-003-isomorphic-procedures/responses/claude/ECR-000003-EXP003-P001C-claude.json -> responses/claude/ECR-000003-EXP003-P001C-claude.json
- experiments/EXP-003-isomorphic-procedures/responses/gemini/ECR-000003-EXP003-P001C-gemini.json -> responses/gemini/ECR-000003-EXP003-P001C-gemini.json
- experiments/EXP-003-isomorphic-procedures/responses/gpt/ECR-000003-EXP003-P001C-gpt.json -> responses/gpt/ECR-000003-EXP003-P001C-gpt.json

## Tolerant Parsing Events

- ECR-000003-EXP003-P001A gpt: normalized_smart_quotes
- ECR-000003-EXP003-P001B gpt: normalized_smart_quotes
- ECR-000003-EXP003-P001C gpt: normalized_smart_quotes

## Duplicate Handling

- None

## Malformed or Ambiguous Files

- None

## Packet Version Issues

- None

## Blockers

- None

## Exact Next Command

```bash
npm run pipeline
```
