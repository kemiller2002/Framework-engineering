# ECR-000003 Board Proposal For Hypothesis Evidence Matrix

Status: `proposal_only`

Do not update the durable hypothesis evidence matrix automatically from this file.

| Hypothesis | Prior Value | Proposed Value | Supporting Evidence | Challenging Evidence | Kill-Condition Status | Reviewer | Decision Date |
|---|---|---|---|---|---|---|---|
| H002 | active / low-moderate | mixed / weak | `EXP-002` representation compliance; `EXP-003` mostly stable backbone | primitive and constraint disagreement across representation changes | tested_not_met | pending human review | pending |
| H003 | active / moderate | slightly_supported / weak | `EXP-003` mostly stable backbone across providers | mixed backbone in `EXP-001` and `EXP-002`; provider-specific recognition patterns | partially_met | pending human review | pending |
| H013 | active / moderate | mixed / moderate | leakage findings and recognition persistence patterns | recognition varied while backbone sometimes remained stable | tested_not_met | pending human review | pending |
| H015 | active / moderate | slightly_supported / moderate | certified datasets, frozen comparator, explainability outputs | tolerant parsing events and no human baseline | tested_not_met | pending human review | pending |
| H016 | active / low | waiting / insufficient | topology perturbation keeps the question active | no clean graph-only control in accepted evidence | not_tested | pending human review | pending |
| H017 | active / low | mixed / weak | compression/elaboration patterns visible in explainability | mixed backbone and disagreement remain | partially_met | pending human review | pending |
| H018 | proposed / very low | slightly_supported / weak | `EXP-003` mostly stable backbone across domains | primitive, transition, and constraint disagreement; leakage findings | tested_not_met | pending human review | pending |

Sources:

- `research/evidence-runs/ECR-000003-representation-sensitivity/review-board/HYPOTHESIS-REVIEW-BOARD.md`
- `research/evidence-runs/ECR-000003-representation-sensitivity/ECR-000003-FINDINGS.md`
