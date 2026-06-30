# FE-012C Dataset Comparison Report

## Purpose

Compare the original FE-012C manual replication dataset against FE-012C repeatability run 001 using the same packet instrument and provider grouping.

## Dataset A Description

Dataset A is the original FE-012C manual replication dataset stored under `research/experiments/FE-012C-manual-replication/responses/`.

- Parsed observations: 45
- Expected observations: 45
- Missing records: 0
- Malformed records: 0

## Dataset B Description

Dataset B is FE-012C repeatability run 001 stored under `research/experiments/FE-012C-repeatability-run-001/responses/`.

- Parsed observations: 45
- Expected observations: 45
- Missing records: 0
- Malformed records: 0
- Parsed with quote normalization: 15

## Data Validity Summary

- Expected packets: 15
- Expected models: 3
- Expected observations per dataset: 45
- Expected observations total: 90
- Parsed observations total: 90

## Overall Stability Summary

- Stable pairs: 1/45 (2.2%)
- Elaboration drift pairs: 8/45 (17.8%)
- Structural drift pairs: 36/45 (80.0%)
- Schema incomparable pairs: 0/45
- Missing or invalid pairs: 0/45

## Backbone Stability

- Backbone-stable pairs: 9/45 (20.0%)
- Entry drift pairs: 8
- Exit drift pairs: 10
- Dominant primitive drift pairs: 13
- Reasoning shape drift pairs: 0

## Elaboration Drift

Elaboration drift is used when backbone fields remain stable but optional elaboration primitives, transitions, loops, branches, ambiguities, or confidence details change.

- Sequence drift pairs: 30
- Transition drift pairs: 34
- Loops drift pairs: 29
- Branches drift pairs: 22

## Structural Drift

Structural drift is used when entry, exit, dominant primitive, reasoning shape, or major sequence changes materially.

- Structural drift pairs: 36

## Recognition Drift

- Recognized artifact changed in 41/45 pairs.

Recognition drift should not be treated as proof of semantic change. It may reflect naming variation, broader artifact recall, or model-specific pattern completion.

## Missing Primitive Drift

- Candidate missing primitive drift occurred in 18/45 pairs.

## Interpretation Constraints

- This is a measurement analysis task, not a validation of theory.
- Stable agreement does not prove the primitive model.
- Drift does not by itself falsify the instrument.
- Some Dataset B files required quote normalization before parsing, which should be treated as a storage-format issue rather than a reasoning result.
- Repeatability conclusions remain sensitive to the constrained primitive vocabulary and to artifact recognition effects.

## Next Recommended Analysis

- Inspect per-packet drift in `FE-012C-drift-analysis.md`.
- Inspect primitive frequency changes in `FE-012C-stability-matrix.md`.
- Inspect per-model tendencies in `FE-012C-model-signatures.md`.
- Inspect transition changes in `FE-012C-transition-comparison.md`.
