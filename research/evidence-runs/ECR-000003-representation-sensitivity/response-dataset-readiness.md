# ECR-000003 Response Dataset Readiness

## EXP-001

| Packet | GPT | Claude | Gemini | Packet Version | Status |
|---|---|---|---|---|---|
| ECR-000003-EXP001-P001A | present | present | present | not_stated | ready |
| ECR-000003-EXP001-P001B | present | present | present | not_stated | ready |
| ECR-000003-EXP001-P001C | present | present | present | not_stated | ready |
| ECR-000003-EXP001-P001D | present | present | present | 1.1 | ready |

Expected: 4 packets × 3 providers = 12 primary responses.

## EXP-002

| Packet | Condition | GPT | Claude | Gemini | Status |
|---|---|---|---|---|---|
| ECR-000003-EXP002-P001A | narrative | present | present | present | ready |
| ECR-000003-EXP002-P001B | bullets | present | present | present | ready |
| ECR-000003-EXP002-P001C | graph | present | present | present | ready |
| ECR-000003-EXP002-P001D | transition-table | present | present | present | ready |

## EXP-003

| Packet | Domain | GPT | Claude | Gemini | Status |
|---|---|---|---|---|---|
| ECR-000003-EXP003-P001A | technical-troubleshooting | missing | missing | missing | missing |
| ECR-000003-EXP003-P001B | logistics-routing | missing | missing | missing | missing |
| ECR-000003-EXP003-P001C | policy-review | missing | missing | missing | missing |

## Overall

| Metric | Count |
|---|---:|
| Expected primary responses | 33 |
| Present canonical responses | 24 |
| Missing responses | 9 |
| Malformed responses | 8 |
| Exact duplicates | 0 |
| Semantic duplicates | 0 |
| Conflicting duplicates | 0 |
| Ambiguous provider files | 0 |
| Archived ZIP files | 1 |

Overall status:

- NOT_READY
