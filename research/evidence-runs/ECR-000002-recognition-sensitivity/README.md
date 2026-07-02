# ECR-000002 Recognition Sensitivity

## Purpose

ECR-000002 is a bundled recognition-sensitivity study.

It tests whether recovered procedural structure remains stable when the same underlying procedure is expressed at different recognition levels.

This run is designed to test multiple related hypotheses in one controlled pass without adding unnecessary new infrastructure.

Models do not update hypotheses directly.

## Core Research Question

How much of the recovered procedural structure is due to the underlying procedure versus recognition of the source artifact?

## Artifact Families

- `P001`: reasoning-heavy inquiry cycle
- `P002`: execution-oriented iterative work cycle
- `P003`: static hierarchical classification structure

Each family has three packet variants by default:

- `A`: canonical
- `B`: paraphrased
- `C`: structural

P001 also has an extension packet:

- `D`: graph_only

## Primary Hypotheses

- H013 Recognition Bias
- H003 Multi-Model Convergence
- H015 Measurement Instrument Reliability

## Secondary Hypotheses

- H001 Procedural Invariance
- H002 Representation Independence
- H005 Procedural Grammar
- H006 Control Flow
- H007 Constraint Preservation
- H008 Procedural AST Recovery
- H011 Reasoning/Execution Separation
- H012 Vocabulary Bias
- H014 Prompt Robustness
- H016 Structural Recognition

## Exploratory Product Relevance

- H009 Clarity Relevance
- H010 EDF Relevance

Product relevance remains observational only.

## Contents

- `pre-registration.md`
- `research-questions.md`
- `hypothesis-impact-matrix.md`
- `artifact-design.md`
- `packet-template.md`
- `response-schema.json`
- `run-instructions.md`
- `analysis-plan.md`
- `interpretation-rules.md`
- `threats-to-validity.md`
- `expected-outcomes.md`
- `decision-log.md`
- `packets/`
- `responses/`
- `comparison/`
- `review/`
