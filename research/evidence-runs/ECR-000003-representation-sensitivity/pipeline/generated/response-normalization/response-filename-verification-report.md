# ECR-000003 Response Filename Verification Report

## Overall Status

- NOT_READY

## Experiment Summary

| Experiment | Expected | Canonical | Missing | Malformed | Conflicts | Status |
|---|---:|---:|---:|---:|---:|---|
| EXP-001 | 12 | 12 | 0 | 4 | 0 | READY_WITH_WARNINGS |
| EXP-002 | 12 | 12 | 0 | 4 | 0 | READY_WITH_WARNINGS |
| EXP-003 | 9 | 0 | 9 | 0 | 0 | NOT_READY |

## Renamed Files

- None

## Moved Files

- None

## Duplicate Files

- None

## Ambiguous Files

- None

## Archived ZIP Files

- archive/mobile-response-zips/responses.zip -> archive/mobile-response-zips/responses.zip

## Packet Version Issues

- EXP-001 P001D primary responses correspond to packet version 1.1; pre-fix response remains excluded under responses/pre-fix/p001d/00001D.json.

## Comparator Discovery Verification

| Experiment | Config Present | Canonical Files Discovered | Missing | Status |
|---|---|---:|---:|---|
| EXP-001 | yes | 12 | 0 | ready |
| EXP-002 | yes | 12 | 0 | ready |
| EXP-003 | yes | 0 | 9 | incomplete |

## Remaining Human Actions

- Collect missing EXP-003 responses before comparison.
- Review malformed-but-identity-clear responses before strict-parser-dependent workflows.
- No ambiguous primary candidates remain.
- Review response-filename-verification-report.md before running any new comparator pass.

## Exact Next Commands

```bash
cd /Users/kevinmiller/dev/Framework-engineering/research/evidence-runs/ECR-000003-representation-sensitivity
npm run responses:verify -- --ecr-root . --dry-run
npm run responses:normalize -- --ecr-root . --apply
cd experiments/EXP-001-topology-perturbation && npm run compare
node --input-type=module -e "import { runComparisonEngine } from '../../../../tools/comparison-engine/src/index.js'; await runComparisonEngine('comparison-engine.config.json');" # from EXP-002-cross-representation-stability
node --input-type=module -e "import { runComparisonEngine } from '../../../../tools/comparison-engine/src/index.js'; await runComparisonEngine('comparison-engine.config.json');" # from EXP-003-isomorphic-procedures
```
