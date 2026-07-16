# ECR-000003 Hypothesis Split Candidates

| Hypothesis | Proposed Split | Evidence | Benefit | Risk | Recommendation |
|---|---|---|---|---|---|
| H003 | backbone convergence vs primitive convergence vs recognition convergence | `EXP-003` supports stronger backbone convergence than primitive convergence; provider recognition patterns diverge. | separates stronger and weaker subclaims | may fragment one usable hypothesis into too many thin claims | review split, do not apply automatically |
| H013 | recognition persistence vs recognition import vs effect on structural recovery | explainability shows recognition pressure, leakage, and cases where structure remains stable despite recognition differences | separates mere recognition from causal structural impact | may overfit one ECR to a broad recognition theory | recommended candidate for human review |
| H016 | topology-driven recognition vs semantic-cue-driven recognition | accepted evidence keeps the question active but does not isolate topology alone | clarifies what future controls must falsify | may create a sub-hypothesis before decisive data exists | defer split until a graph-only control exists |
| H017 | role compression vs transition compression vs constraint compression | backbone appears more stable than transitions and constraints in `EXP-002` and `EXP-003` | makes compression claims more precise | increases governance overhead for an early-stage finding | consider only if H017 remains active after further controls |

## Board Note

No split should be accepted automatically. The main value of this file is to prevent the board from compressing materially different subclaims into one over-broad statement.
