# FE-013 Protocol

## Purpose

Provide a structured procedure for extracting compiler-like procedural properties from blinded framework text.

## Phase 1: Parse

Extract:

- entry condition
- exit condition
- preconditions
- postconditions
- required steps
- optional steps
- branch conditions
- loop conditions
- invariants
- termination conditions

## Phase 2: Build Procedural AST

Represent the framework as a tree or graph of procedural constructs.

The AST should capture major structural relations rather than every possible wording detail.

## Phase 3: Extract Constraints

Identify what must be true for the framework to be validly applied.

Constraints should be phrased as obligations or validity conditions, not as primitive labels.

## Phase 4: Normalize

Compare ASTs across artifacts for structural similarity.

Normalization should focus on:

- whether the artifact is static, linear, cyclic, branching, or hierarchical
- whether loops are explicit
- whether branches depend on conditions
- whether invariants and termination conditions are recoverable
