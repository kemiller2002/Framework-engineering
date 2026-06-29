# FE-012C Primitive Grammar Agreement Harness

## Purpose

FE-012C is a local experiment harness for testing whether independent models converge on primitive grammar extraction.

The harness compares:

- primitive sequence
- transitions
- entry primitives
- exit primitives
- loops
- branches
- dominant primitives

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Add API keys to `.env`.

## Run

Extract model outputs:

```bash
npm run extract
```

Build transition summaries:

```bash
npm run matrix
```

Compare extractor agreement:

```bash
npm run compare
```

## Interpretation Cautions

- This is model-based replication, not human validation.
- Agreement does not prove the theory.
- Disagreement is useful evidence.
- Error files should be reviewed rather than ignored.
- Same prompt and primitive list reduce one source of variation, but they do not remove provider-specific biases.

## Failure Handling

- Provider failures should not stop the full run.
- Invalid JSON should be captured as an error artifact.
- Results should be treated as provisional until independently reviewed.
