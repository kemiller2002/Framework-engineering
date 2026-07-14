# ECR-000003 Dataset Completeness

## Summary

| Experiment | Packets | Providers | Expected | Canonical Present | Missing | Malformed | Conflicting | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| EXP-001 | 4 | 3 | 12 | 12 | 0 | 0 | 0 | READY |
| EXP-002 | 4 | 3 | 12 | 12 | 0 | 0 | 0 | READY |
| EXP-003 | 3 | 3 | 9 | 8 | 1 | 0 | 0 | BLOCKED |

## Missing Responses

- EXP-003 missing 1 primary responses.

## Malformed Responses


## Duplicate Responses

- No conflicting duplicates detected by current canonical-path grouping.

## Packet Version Issues

- EXP-001 P001D requires packet version 1.1 and the pre-fix packet remains excluded.

## Overall Status

- BLOCKED

Comparison may proceed only when all expected primary responses are present, no conflicting duplicates remain, no unsafe malformed response is required for the primary dataset, and packet-version rules pass.
