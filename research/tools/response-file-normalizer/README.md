# Response File Normalizer

Normalizes ECR response filenames using response metadata rather than manually typed filenames.

The normalizer also produces dataset manifests, normalization certificates, certificate indexes, and certificate verification output for official comparison gating.

## Commands

Dry run:

```bash
npm run normalize -- --ecr-root /path/to/ecr --dry-run
```

Apply:

```bash
npm run normalize -- --ecr-root /path/to/ecr --apply
```

Verify certificates:

```bash
npm run normalize -- --ecr-root /path/to/ecr --all-experiments --verify-only
```

Certificate only:

```bash
npm run normalize -- --ecr-root /path/to/ecr --all-experiments --certificate-only --apply
```

Incoming only:

```bash
npm run normalize -- --ecr-root /path/to/ecr --incoming-only --apply
```

## Guarantees

- Default mode is dry run.
- `--apply` is required to move or rename files.
- Raw response contents are never rewritten.
- SHA-256 hashes are verified before and after every move.
- Reports are generated on every run.
- Certificates become stale when dataset or config hashes change.
- Official comparison is expected to refuse missing, blocked, invalidated, or stale certificates.
