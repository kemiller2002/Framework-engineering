# FE-013 Procedural Language Hypothesis

## Purpose

FE-013 tests whether procedural frameworks can be analyzed like natural-language procedural programs by extracting compiler-like structural properties from their blinded text.

The experiment focuses on:

- entry conditions
- exit conditions
- preconditions
- postconditions
- branches
- loops
- invariants
- termination conditions
- procedural ASTs

## Why This Follows FE-012C

FE-012C showed that models often converged on reasoning shape, transition structure, and dominant procedural elements even when literal primitive sequences diverged.

FE-013 follows that result by testing whether a programming-language-style structural representation is a more informative comparison layer than primitive sequence comparison alone.

## How This Differs From Primitive Extraction

FE-013 is not a primitive extraction study.

It does not use the FE-012C primitive vocabulary.

It asks for compiler-like procedural properties and AST structure rather than primitive sequences.

## Warning

This experiment does not validate Framework Engineering.

It tests a narrow working hypothesis about whether some procedural frameworks exhibit language-like structural properties recoverable from natural-language descriptions.

## Directory Structure

- `hypothesis.md`
- `protocol.md`
- `procedural-ast-schema.md`
- `constraint-extraction-guide.md`
- `packet-template.md`
- `artifact-set.md`
- `pre-registration.md`
- `analysis-plan.md`
- `threats-to-validity.md`
- `interpretation-rules.md`
- `packets/`
- `responses/gpt/`
- `responses/claude/`
- `responses/gemini/`
- `comparison/`

## Manual Workflow

1. Open a packet from `packets/`.
2. Paste the full packet into a fresh GPT, Claude, or Gemini conversation.
3. Save the raw JSON response into the matching provider folder under `responses/`.
4. Repeat until all provider outputs are collected.
5. Compare AST structure, constraints, and disagreement cases in `comparison/`.

## No API Requirement

This experiment is designed to be run manually.

No API, SDK, or automation is required.
