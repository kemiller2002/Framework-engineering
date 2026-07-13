# Mobile Response Ingest Guide

## Purpose

This workflow allows phone-based response collection without manually typing canonical filenames.

## Steps

1. Save or upload the response using any temporary filename.
2. Place it anywhere under `incoming-responses/`.
3. Ensure the response includes correct packet metadata.
4. Run the normalization command.
5. The normalizer derives the canonical filename from JSON metadata.
6. Review the generated normalization report.

## Commands

Dry run:

```bash
cd /Users/kevinmiller/dev/Framework-engineering/research/evidence-runs/ECR-000003-representation-sensitivity
npm run responses:verify -- --ecr-root . --incoming-only --dry-run
```

Apply:

```bash
cd /Users/kevinmiller/dev/Framework-engineering/research/evidence-runs/ECR-000003-representation-sensitivity
npm run responses:incoming -- --ecr-root . --incoming-only --apply
```
