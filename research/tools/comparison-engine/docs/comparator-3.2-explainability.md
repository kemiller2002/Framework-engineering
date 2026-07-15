# Comparator 3.2 Explainability

## Purpose

Comparator 3.2 is a post-processing explainability layer for Comparator v3.1 outputs.

Comparator v3.1 answers:

> Do these outputs agree?

Comparator 3.2 answers:

> Why do they agree or disagree, and which differences matter?

## Guardrail

Comparator 3.2 does not:

- rescore Comparator v3.1 outputs
- overwrite official v3.1 files
- update hypotheses automatically
- replace human review

## Inputs

Comparator 3.2 requires:

- official Comparator v3.1 outputs
- normalized response files
- a valid normalization certificate

It refuses to run when official inputs are incomplete or when response files appear to have changed since the official v3.1 comparison.

## Outputs

Per experiment, Comparator 3.2 writes:

- machine-readable pairwise difference records
- layer-specific explanation reports
- compression and elaboration analysis
- review-priority guidance
- EDR explainability input

At the ECR level it writes:

- a cross-experiment explainability summary
- an implementation report
- closure readiness

## Commands

From the ECR root:

```bash
npm run explain:all
npm run reports:explainability
```

From an experiment directory:

```bash
npm run explain:v3.2
```

## Limitations

- Explainability classifications are heuristic.
- Comparator 3.2 inherits Comparator v3.1 ontology limitations.
- Explanations may identify review targets without resolving them automatically.
