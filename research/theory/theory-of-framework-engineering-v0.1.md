# Theory of Framework Engineering v0.1

## Purpose

This document integrates the current research evidence from FE-008, FE-011A, FE-012A, and FE-012B into a provisional theory statement.

It does not promote Framework Engineering to Foundation.

It does not claim proof.

## Evidence Base

- FE-008 and FE-008A:
  Knowledge artifact characterization and identity-capability separation work.
- FE-011A:
  Internal blind pilot on framework redesign structure and output quality.
- FE-012A:
  Internal blind primitive extraction and reconstruction experiment.
- FE-012B:
  Internal primitive synthesis experiment for novel problems.

## Core Definitions

Observation:
A finding tied to current evidence.

Hypothesis:
A claim under active test.

Prediction:
A forward-looking expectation that should be testable later.

Open Question:
A major unresolved issue that blocks stronger theory.

Framework Engineering:
At present, a research program for characterizing, comparing, redesigning, and testing frameworks and adjacent knowledge artifacts.

Primitive Reasoning Operation:
A provisional low-level reasoning function used to describe procedural structure independently from domain labels.

Procedural Reasoning Grammar:
A hypothesized composition of reasoning primitives that structures analysis, diagnosis, evaluation, choice, verification, reflection, and reassessment.

Execution or Coordination Grammar:
A separate but related hypothesized composition for timing, allocation, synchronization, sequencing, and coordinated action.

## Theory v0.1

Framework Engineering currently has evidence as a characterization and improvement methodology, not yet as a full engineering discipline.

The current evidence supports four provisional claims:

1. Knowledge artifacts are easier to reason about when identity is separated from capabilities.
2. Structured redesign can improve traceability and evidence handling, but it also tends to add complexity.
3. A finite set of reasoning primitives may capture a meaningful portion of procedural artifact structure across domains.
4. Primitive sufficiency appears weaker in coordination-heavy problems than in reasoning-heavy problems.

The current theory does not support stronger claims than that.

It does not yet show that Framework Engineering can reliably design superior frameworks.

It does not yet show that the primitive vocabulary is stable under independent extraction.

It does not yet show that reasoning grammar and execution grammar are cleanly separable.

## Current Observations

### Observation 1

FE-008 provisionally supports Identity-Capability separation.

The evidence suggests that artifacts overlap too much for single-label classification to remain stable without separating what an artifact is from what it can do.

### Observation 2

FE-011A suggests structured redesigns improve traceability and evidence handling but increase complexity.

The strongest FE-011A pattern was not simply "better output."

It was stronger reasoning traceability, clearer evidence linkage, and better uncertainty handling in more structured variants, with added verbosity and process overhead.

### Observation 3

FE-012A suggests primitive reasoning operations may reconstruct procedural artifacts, but independent validation is still missing.

The internal run showed partial vocabulary stabilization and strong or moderate reconstruction for most artifacts, but the result remains vulnerable to same-model bias and extractor non-independence.

### Observation 4

FE-012B suggests primitive reasoning operations may synthesize coherent procedural structures, but coordination-heavy problems exposed missing primitive pressure.

The current frozen vocabulary handled many reasoning-heavy problems, but synthesis pressure increased when explicit sequencing, synchronization, or scheduling became central.

## Hypotheses

### Hypothesis 1

Framework Engineering can become a disciplined method for framework characterization and redesign before it becomes a reliable framework-generation discipline.

### Hypothesis 2

Reasoning-heavy artifacts rely on a relatively compact procedural reasoning grammar.

### Hypothesis 3

Execution-heavy artifacts require additional coordination primitives not yet established in the accepted vocabulary.

### Hypothesis 4

Some observed redesign gains in FE-011A may come from structure in general rather than from Framework Engineering specifically.

## Emergent Design Laws

The following laws are provisional design tendencies derived from current evidence, not accepted doctrine:

1. Bound scope before reasoning.
2. Separate observation from interpretation.
3. Preserve uncertainty.
4. Preserve alternatives until evidence narrows them.
5. Verify before closure.
6. Add reassessment triggers in dynamic contexts.
7. Add only enough structure to solve the identified weakness.

See [emergent-design-laws-v0.1.md](/Users/kevinmiller/dev/Framework-engineering/research/theory/emergent-design-laws-v0.1.md).

## Predictions

- Independent extractors will converge more strongly on reasoning-heavy artifacts than on coordination-heavy artifacts.
- Primitive vocabulary growth will slow for reasoning artifacts before it slows for coordination artifacts.
- Framework redesigns that separate observation, interpretation, uncertainty, and verification will usually improve traceability, but not always net usefulness.
- Execution-heavy artifacts will continue to pressure the current vocabulary for additional primitives such as synchronization, scheduling, allocation, sequencing, or coordination.

## Falsification Criteria

See [falsification-criteria.md](/Users/kevinmiller/dev/Framework-engineering/research/theory/falsification-criteria.md).

At minimum, the theory weakens if:

- independent extractors do not converge
- primitive vocabulary keeps expanding
- reconstruction fails outside familiar domains
- synthesized frameworks are incoherent to independent reviewers
- redesigned frameworks do not improve outputs
- reasoning and execution grammars cannot be separated

## Open Questions

- Are Identity and Capability stable under independent reviewers at larger scale?
- Which observed redesign gains are specific to Framework Engineering rather than to generic scaffolding?
- Do reasoning and execution grammars separate cleanly, or are they entangled in practice?
- Are `Compare` and `Prioritize` genuine durable primitives or temporary repair terms?
- Are `Synchronize`, `Schedule`, `Sequence`, `Allocate`, and `Coordinate` genuine execution primitives or just domain-specific variants?
- Can the current theory survive independent human testing rather than internal same-model runs?

## Next Required Work

- Execute independent FE-008 reviewer comparisons at larger scale.
- Re-run FE-011A with stronger blinding and independent evaluation.
- Re-run FE-012A with independent extractors and audited merge disagreements.
- Re-run FE-012B with independent reviewers and a larger novelty set.
- Test whether reasoning and execution grammars can be separated without distorting real artifacts.

## Status

Research theory.

Provisional.
