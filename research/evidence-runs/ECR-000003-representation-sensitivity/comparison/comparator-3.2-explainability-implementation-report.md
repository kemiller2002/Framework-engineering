# Comparator 3.2 Explainability Implementation Report

## Component Status

- explainability modules: implemented
- per-experiment explainability outputs: generated
- cross-experiment summary: generated
- EDR explainability inputs: generated

## Source Run IDs

- EXP-001: e2a2ed75-2dbc-46b4-a20d-742ea34a0393
- EXP-002: f443d0d6-9763-45e1-911e-e014ab1856f2
- EXP-003: 831e1fe8-ab35-4464-a66d-7dba12db6cc5

## Explainability Run IDs

- EXP-001: 1a0891893c0d
- EXP-002: 994c1266fc93
- EXP-003: 38babc6d86aa

## Difference Counts

- EXP-001: 1276
- EXP-002: 1085
- EXP-003: 551

## High-Priority Review Items

- high: 66
- medium: 12

## Tests

- `npm run test:explainability`
- `npm test`

## Limitations

- Comparator 3.2 explanations are heuristic and do not rescore v3.1 outputs.
- Response-change rejection depends on file modification time relative to the official v3.1 run manifest.

## Exact Next Actions

```bash
npm run explain:all
npm run reports:explainability
```
