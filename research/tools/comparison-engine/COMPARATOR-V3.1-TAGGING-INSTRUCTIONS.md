# Comparator v3.1 Tagging Instructions

Current branch inspected:

- `main`

Existing comparator tags inspected:

- none matching `comparator*` were present at the time of writing

Suggested tag:

`comparator-v3.1-frozen`

Purpose:

- preserve the frozen ECR-000003 comparison baseline
- support future reproducibility checks
- distinguish official `3.1.0` outputs from later explainability or scoring work

Recommended operator steps:

1. Confirm the intended commit contains:
   - Comparator `3.1.0` code
   - the approval record
   - the freeze record
   - the permanent freeze document
2. Verify no unreviewed scoring changes are included.
3. Create an annotated tag locally:

```bash
git tag -a comparator-v3.1-frozen -m "Freeze Comparator v3.1.0 for official ECR-000003 measurements"
```

4. Review the tag target before pushing.
5. Push only after explicit human approval:

```bash
git push origin comparator-v3.1-frozen
```

Do not create the tag automatically from this package.
