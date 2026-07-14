# ECR-000003 Automated Analysis Pipeline

## Quick Start

Verify only:

```bash
npm run verify
```

Dry-run everything:

```bash
npm run pipeline:dry
```

Normalize response files:

```bash
npm run normalize
```

Run comparisons only:

```bash
npm run compare:all
```

Generate summary reports only:

```bash
npm run reports:all
```

Run complete pipeline:

```bash
npm run pipeline
```

Run one experiment:

```bash
node scripts/run-ecr-000003.js --experiment EXP-002 --compare-all
```

## Safe Recommended Sequence

1. `npm run collect:exp003`
2. `npm run normalize:dry`
3. `npm run normalize`
4. `npm run normalize:verify`
5. `npm run normalize:certify`
6. `npm run pipeline:dry`
7. Review normalization and completeness reports.
8. `npm run pipeline`
9. Review final readiness report.
10. Complete EDRs manually.

## Phone Upload Workflow

1. Put phone-saved responses under:
   `incoming-responses/gpt/`
   `incoming-responses/claude/`
   `incoming-responses/gemini/`
2. Response metadata must include `packet_id`.
3. Run `npm run normalize`.
4. Run `npm run pipeline`.

## Collection First

Use response collection before normalization:

1. Collect responses.
2. Normalize responses.
3. Verify dataset.
4. Generate normalization certificates.
5. Run Comparator v3.1.
6. Generate reports.
7. Review EDRs.

## Important Guardrails

* Raw responses are never rewritten.
* Comparators do not update hypotheses.
* EDRs require human completion.
* Pipeline success does not equal hypothesis validation.
* Comparator v3.1 remains frozen for ECR-000003.
