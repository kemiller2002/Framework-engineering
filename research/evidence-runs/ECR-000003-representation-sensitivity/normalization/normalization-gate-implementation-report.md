# Normalization Gate Implementation Report

- Component status: implemented
- Discovered candidates: 33
- EXP-001 expected: 12
- EXP-001 canonical: 12
- EXP-001 status: READY_WITH_WARNINGS
- EXP-002 expected: 12
- EXP-002 canonical: 12
- EXP-002 status: READY_WITH_WARNINGS
- EXP-003 expected: 9
- EXP-003 canonical: 8
- EXP-003 status: BLOCKED
- Comparator gate behavior: official comparison requires READY or READY_WITH_WARNINGS certificate with matching dataset and config hashes.
- Limitations: ZIP introspection is not implemented; archive ZIPs are inventoried but not unpacked.

## Exact Next Commands

```bash
npm run normalize:dry
npm run normalize
npm run normalize:verify
npm run normalize:certify
npm run pipeline
```
