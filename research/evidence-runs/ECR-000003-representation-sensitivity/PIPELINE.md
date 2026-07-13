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

1. `npm run verify`
2. `npm run pipeline:dry`
3. Review normalization and completeness reports.
4. `npm run pipeline`
5. Review final readiness report.
6. Complete EDRs manually.

## Phone Upload Workflow

1. Put phone-saved responses under:
   `incoming-responses/gpt/`
   `incoming-responses/claude/`
   `incoming-responses/gemini/`
2. Response metadata must include `packet_id`.
3. Run `npm run normalize`.
4. Run `npm run pipeline`.

## Important Guardrails

* Raw responses are never rewritten.
* Comparators do not update hypotheses.
* EDRs require human completion.
* Pipeline success does not equal hypothesis validation.
* Comparator v3.1 remains frozen for ECR-000003.
