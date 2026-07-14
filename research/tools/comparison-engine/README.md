# Shared Research Comparison Engine

## Purpose

This package provides a reusable comparison engine for Framework Engineering research runs and experiments.

Official comparison now requires a verified normalization certificate for the target experiment. Missing, blocked, invalidated, or stale certificates must prevent official output generation.

It extracts the dimensional comparison approach proven in the ECR-000001 Comparator v3 stack and moves it into shared modules so future evidence runs do not require cloned one-off comparators.

## Architecture

The engine is split into:

- `src/load-responses.js`
  - discovers packet metadata and response files
  - reports missing, malformed, legacy, and version-unclear cases
- `src/parse-response.js`
  - parses raw JSON responses
  - handles common storage issues such as fenced JSON and smart quotes
- `src/normalize-values.js`
  - normalizes strings, object arrays, transition arrays, and observation-like fields
- `src/dimensional-normalizer.js`
  - applies the shared role/object/purpose/stage/control-flow ontology
- `src/compare-*.js`
  - performs layer-specific comparison and recognition analysis
- `src/report-writer.js`
  - writes machine-readable output and Markdown reports
- `src/index.js`
  - validates config, orchestrates loading, comparison, and report generation

## Configuration

Experiments are configured through JSON files validated against `schemas/experiment-config.schema.json`.

Required concepts:

- experiment identity
- experiment root
- response root
- packet root
- provider list
- packet / variant list
- output root

Optional concepts:

- named recognition patterns
- packet labels
- version rules
- terminology watch list
- output filenames
- EDR template path

## Supported Layers

The engine supports:

- literal comparison
- dimensional comparison
- structural comparison
- primitive comparison
- constraint comparison
- representation comparison
- recognition classification
- malformed / missing response reporting
- Markdown report generation
- machine-readable JSON output

## Adding A New ECR Or Experiment

1. Create an experiment config JSON beside the target run.
2. Point `experiment_root`, `response_root`, `packet_root`, and `output_root` at the local directories.
3. List providers and packet variants explicitly.
4. Add named recognition patterns only when you want `recognized` to require explicit framework-family naming.
5. Add version rules when a packet version gate matters.
6. Add a thin wrapper script that calls `runComparisonEngine(configPath)`.

## Literal vs Dimensional Agreement

Literal agreement compares normalized values directly.

Dimensional agreement compares the inferred procedural role, object, purpose, stage, and control-flow dimensions behind the language.

Literal agreement is stricter.
Dimensional agreement is more tolerant.

The engine does not treat dimensional agreement as proof of semantic equivalence.

## Ontology Limitations

The ontology is provisional.

- unresolved matches remain unresolved
- false positives and false negatives are possible
- role matching is intentionally favored over shallow phrasing matches
- dimensional results should still be reviewed by humans when they affect research decisions

## Data-Quality Behavior

The engine never edits raw responses.

It records:

- missing files
- malformed files
- legacy filename mappings
- excluded files
- version-unclear responses

Legacy detection is allowed for audit visibility, but canonical filenames remain primary.

## EDR Draft Generation

When an `edr_template` is configured, the engine produces an observation-only draft populated with:

- experiment metadata
- evidence input paths
- directly measured observations
- recognition persistence results
- data-quality warnings
- unresolved uncertainties

Interpretation, hypothesis direction, and final decision remain for human review.

## Confidence Policy

This engine does not update hypothesis confidence automatically.

Evidence collection and comparison are separated from hypothesis review by design.
