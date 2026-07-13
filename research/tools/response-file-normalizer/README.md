# Response File Normalizer

Normalizes ECR response filenames using response metadata rather than manually typed filenames.

## Commands

Dry run:

```bash
npm run normalize -- --ecr-root /path/to/ecr --dry-run
```

Apply:

```bash
npm run normalize -- --ecr-root /path/to/ecr --apply
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
