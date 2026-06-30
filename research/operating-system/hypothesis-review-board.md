# Hypothesis Review Board

| Hypothesis | Current Confidence | Evidence For | Evidence Against | Dependencies | Competing Hypotheses | Decision | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H001 Procedural Invariance | Moderate |  |  | H003; H015 | H012; H013 | keep | Run ECR-000001 |
| H002 Representation Independence | Low-Moderate |  |  | H004; H008; H015 | H012; H014 | keep | Compare layers in ECR-000001 |
| H003 Multi-Model Convergence | Moderate |  |  | H015 | H013; H014 | keep | Evaluate cross-model agreement |
| H004 Repeatability | Low-Moderate |  |  | H015 | H013; H014 | keep | Extend repeatability after FE-013 |
| H005 Procedural Grammar | Low-Moderate |  |  | H001; H015 | H008; H012; H013 | keep | Evaluate FE-013 and ECR-000001 |
| H006 Control Flow | Moderate |  |  | H005; H015 | H014 | keep | Compare loops and branches |
| H007 Constraint Preservation | Low |  |  | H006; H015 | literal comparator sufficiency | keep | Test constraint layer |
| H008 Procedural AST Recovery | Low |  |  | H005; H006; H015 | forced formalism | keep | Compare AST quality |
| H009 Clarity Relevance | Low-Moderate |  |  | H001; H002; H007 | research-only insight | keep | Track product relevance only |
| H010 EDF Relevance | Low |  |  | H006; H011 | unrelated execution theory | keep | Track execution relevance only |
| H011 Reasoning/Execution Separation | Low |  |  | H006; H010 | H005 | keep | Compare profiles across artifacts |
| H012 Vocabulary Bias | Moderate |  |  | None | H001; H003; H005 | keep | Compare vocabulary-free runs |
| H013 Recognition Bias | Moderate |  |  | None | H003; H005; H015 | keep | Track recognition rate |
| H014 Prompt Robustness | Low |  |  | H015 | H003; H006 | keep | Plan prompt-robustness run |
| H015 Measurement Instrument Reliability | Moderate |  |  | None | H014; H013 | keep | Review schema compliance |
