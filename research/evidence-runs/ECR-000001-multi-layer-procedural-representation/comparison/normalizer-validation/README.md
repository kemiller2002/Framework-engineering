# Semantic Normalizer Validation

This directory contains the validation layer for the ECR-000001 procedural semantic normalizer.

Purpose:
- stress-test ontology behavior before using Comparator v2 for hypothesis review
- expose false positives, false negatives, and ontology gaps
- keep literal disagreement visible

Run:

```bash
npm run validate:normalizer
```

Generated outputs are written to `comparison/normalizer-validation/generated/`.

V3 dimensional validation is available through `npm run validate:normalizer:v3`.
