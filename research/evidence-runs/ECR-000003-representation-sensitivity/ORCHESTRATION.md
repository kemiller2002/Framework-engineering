# ECR-000003 Orchestration

1. Collect responses.
2. Normalize responses.
3. Verify dataset completeness.
4. Generate normalization certificates.
5. Run Comparator v3.1.
6. Run Comparator 3.2 explainability.
7. Generate cross-experiment explainability summary.
8. Review EDRs and review-board artifacts.

Collection command for current blocked work:

```bash
npm run collect:exp003
```

Explainability commands after official comparison:

```bash
npm run explain:all
npm run reports:explainability
```
