# Research Dependency Graph

## How To Read The Graph

The graph tracks how hypotheses support, depend on, or compete with one another.

- `supports` means a stronger upstream hypothesis increases confidence in a downstream hypothesis.
- `depends_on` means a downstream hypothesis should not be interpreted without the upstream hypothesis.
- `competes_with` means an alternative explanation or risk can weaken the claim.
- `risk_propagates_to` means a weakened upstream hypothesis should trigger review of downstream claims.

## Core Hypothesis Clusters

- Structural core: H001, H005, H006, H008
- Reliability and instrument core: H003, H004, H014, H015
- Bias and alternative-explanation core: H012, H013
- Product relevance core: H009, H010, H011
- Representation and comparison core: H002, H007, H008

## Dependency Table

| Hypothesis | Supports | Depends On |
| --- | --- | --- |
| H003 Multi-Model Convergence | H001 Procedural Invariance; H005 Procedural Grammar; H015 Measurement Instrument Reliability | None |
| H004 Repeatability | H002 Representation Independence; H015 Measurement Instrument Reliability | None |
| H005 Procedural Grammar | H006 Control Flow; H008 Procedural AST Recovery | H001 Procedural Invariance |
| H006 Control Flow | H007 Constraint Preservation; H008 Procedural AST Recovery | H005 Procedural Grammar |
| H008 Procedural AST Recovery | H002 Representation Independence; H005 Procedural Grammar | H005 Procedural Grammar; H006 Control Flow |
| H009 Clarity Relevance | None | H001 Procedural Invariance; H002 Representation Independence; H007 Constraint Preservation |
| H010 EDF Relevance | None | H011 Reasoning/Execution Separation; H006 Control Flow |
| H011 Reasoning/Execution Separation | None | H006 Control Flow; H010 EDF Relevance evidence |
| H014 Prompt Robustness | H015 Measurement Instrument Reliability | H015 Measurement Instrument Reliability |
| H015 Measurement Instrument Reliability | All downstream theory-building claims | H003 Multi-Model Convergence; H004 Repeatability; H014 Prompt Robustness |

## Competition Table

| Hypothesis | Competes With |
| --- | --- |
| H007 Constraint Preservation | primitive-sequence-only comparison; literal comparator sufficiency |
| H012 Vocabulary Bias | H001 Procedural Invariance; H003 Multi-Model Convergence; H005 Procedural Grammar |
| H013 Recognition Bias | H003 Multi-Model Convergence; H005 Procedural Grammar; H015 Measurement Instrument Reliability |

## Risk Propagation Rules

- If H015 weakens, all instrument-dependent claims must be reviewed.
- If H003 weakens, claims based on cross-model convergence must be reviewed.
- If H004 weakens, repeatability-dependent claims must be downgraded.
- If H012 strengthens, claims based on provided primitive vocabulary must be downgraded.
- If H013 strengthens, claims based on known-framework packets must be downgraded.
- If H011 weakens, EDF-specific grammar claims must be suspended or revised.
- If H007 weakens, constraint-based comparison should not replace primitive or graph comparison.

## Current Graph Observations

- H015 is a central dependency node because downstream structural claims rely on instrument reliability.
- H012 and H013 are high-leverage competing explanations because they can weaken multiple structure claims at once.
- H009 and H010 should remain downstream consumers until structural and reliability claims have stronger support.
- H007 and H008 are promising but fragile because they depend on both structural and control-flow stability.
