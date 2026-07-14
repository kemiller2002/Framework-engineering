# ECR-000003 Response Filename Verification Report

## Overall Status

- BLOCKED

## Experiment Summary

| Experiment | Expected | Canonical | Missing | Malformed | Conflicts | Status |
|---|---:|---:|---:|---:|---:|---|
| EXP-001 | 12 | 12 | 0 | 0 | 0 | READY_WITH_WARNINGS |
| EXP-002 | 12 | 12 | 0 | 0 | 0 | READY_WITH_WARNINGS |
| EXP-003 | 9 | 8 | 1 | 1 | 0 | BLOCKED |

## Exact Next Commands

```bash
npm run normalize:dry
npm run normalize
npm run normalize:verify
npm run normalize:certify
npm run pipeline
```
