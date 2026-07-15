# ECR-000003 Response Filename Verification Report

## Overall Status

- READY_WITH_WARNINGS

## Experiment Summary

| Experiment | Expected | Canonical | Missing | Malformed | Conflicts | Status |
|---|---:|---:|---:|---:|---:|---|
| EXP-001 | 12 | 12 | 0 | 0 | 0 | READY_WITH_WARNINGS |
| EXP-002 | 12 | 12 | 0 | 0 | 0 | READY_WITH_WARNINGS |
| EXP-003 | 9 | 9 | 0 | 0 | 0 | READY_WITH_WARNINGS |

## Exact Next Commands

```bash
npm run normalize:dry
npm run normalize
npm run normalize:verify
npm run normalize:certify
npm run pipeline
```
