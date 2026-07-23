---
id: FE-EVAL-ROADMAP-2026-07-23
title: Framework Engineering Research and Implementation Roadmap
artifactType: roadmap
status: proposed
version: "1.0"
confidence: 0.6
completion: 1
authorAgent: Codex
created: 2026-07-23
updated: 2026-07-23
hypothesisIds: [FEH-001, FEH-002, FEH-003, FEH-004, FEH-005, FEH-006, FEH-007, FEH-008, FEH-009, FEH-010]
---

# Framework Engineering Research and Implementation Roadmap

| Field | Value |
|---|---|
| Record ID | FE-EVAL-ROADMAP-2026-07-23 |
| Version | 1.0 |
| Status | proposed, dependency-ordered |
| Authoring agent | Codex |
| Created | 2026-07-23T14:05:00-04:00 |
| Parent records | FE-EVAL-REP-2026-07-23 |
| Evidence dependencies | EV-FE-001 through EV-FE-008 |
| Hypothesis dependencies | FEH-001 through FEH-010 |
| Supersedes | none |
| Confidence | moderate on ordering; low on estimates |
| Completion state | planning complete; work items open |

Priority is information value and dependency, not calendar order. Effort is agent/human workdays and excludes participant recruitment.

| ID / stage | Objective and rationale | Dependencies; findings/hypotheses | Method and required evidence | Output; success / falsification | Risk; effort; priority; parallelization; agent | State |
|---|---|---|---|---|---|
| FE-RM-000 / 0 | Accept an authority/ID policy and machine baseline; traceability cannot be audited while authority is inferred. | EV-FE-004/005; FEH-004 | Sample legacy records, define status precedence and ID scope, human approval. | Policy + inventory manifest; ≥95% critical-path records resolved / reviewers cannot agree on authority. | false authority; 2-4d; P0; serial; governance+data agent | open |
| FE-RM-001 / 1 | Test definition and defensible boundary against adjacent fields. | FE-RM-000 helpful; FEH-001 | primary literature/standards review, feature matrix, blind expert classification. | boundary report; non-redundant mechanisms and scope / complete subsumption. | novelty bias; 5-10d; P0; protocol then parallel reviews; research agent | open |
| FE-RM-002 / 2 | Test FE-specific causal value against complexity-matched alternatives. | FE-RM-001; FEH-001/009 | preregistered randomized tasks; FE, generic structured, adjacent-method, and minimal controls; quality/time/cost. | comparative dataset; material net effect / no benefit or excess cost. | evaluator bias; 10-20d; P0; parallel blinded runs; experimental agent | blocked by RM-001 |
| FE-RM-003 / 2 | Establish independent human baseline and negative controls for ECR-000003. | accepted protocol; H002/H003/H013/H015/H018 | blinded analysts, non-isomorphic controls, adjudication, inter-rater metrics. | accepted baseline; backbone effect survives / collapses under controls. | recruitment/training; 10-15d; P0; parallel analysts; empirical agent | open after protocol |
| FE-RM-004 / 3 | Define minimal execution contract only if utility signal survives. | FE-RM-002; FEH-007 | distill required inputs, outputs, entry/exit, recovery, examples; usability trials. | versioned contract; independent completion / material ambiguity. | premature standardization; 5-8d; P1; serial synthesis; method engineer | blocked |
| FE-RM-005 / 4 | Quantify provenance, stable-ID, and REP value/cost. | FE-RM-000; FEH-002/003/004/007/010 | cold-start A/B/C test: repository, minimal package, full REP; inject upstream change. | cost-benefit report; fewer errors/rework net cost / no net benefit. | task realism; 7-12d; P0; parallel blinded agents; eval agent | open after policy |
| FE-RM-006 / 4 | Implement scoped provenance checks for validated mechanisms only. | FE-RM-005 | schema, successor rules, stale-dependency fixtures, migration plan. | validator; catches seeded errors with low false positives / burden exceeds gain. | migration churn; 5-10d; P1; code/data parallel; tooling agent | blocked |
| FE-RM-007 / 5 | Test autonomous and parallel-agent governance. | FE-RM-004/005; FEH-005/006/008 | conflicting missions, ownership rules, branch/merge adjudication, recovery scoring. | concurrency report and protocol; all conflicts detected, history intact / silent corruption. | unsafe auto-merge; 7-12d; P1; intentionally parallel; orchestration evaluator | blocked |
| FE-RM-008 / 6 | Run representative case studies and boundary cases. | FE-RM-002/004 | small/medium/high-consequence tasks across domains, matched baselines, negative results. | case portfolio; stable benefit boundaries / non-generalization. | cherry-picking; 15-30d; P1; parallel studies; mixed team | blocked |
| FE-RM-009 / 7 | Automate only stable artifact contracts and impact analysis. | FE-RM-006/007/008 | implement schemas, graph, stale alerts; benchmark review load. | minimal tooling; measured error/cost reduction / automation adds noise. | tool lock-in; 10-20d; P2; modular parallelism; software agent | blocked |
| FE-RM-010 / 8 | Establish governance and adoption profiles. | FE-RM-008/009 | minimal/full modes, approval and breaking-change policy, onboarding trials. | v1 governance profile; new teams succeed / benefit fails to transfer. | process capture; 8-15d; P2; governance+UX; human-led | blocked |

## Gates

- Gate A: if FE-RM-001 finds full subsumption, rename and simplify the program before further discipline-building.
- Gate B: if FE-RM-002 finds no net benefit, retain only individually validated practices.
- Gate C: if FE-RM-005 finds full REP/provenance cost exceeds benefit, adopt the minimum sufficient manifest.
- Gate D: if FE-RM-007 finds silent conflicts, prohibit autonomous canonical updates.
- Gate E: tooling and adoption cannot begin because documents exist; they require empirical gates above.

## Recommended immediate sequence

1. Human authority decision for ECR-000003 remains separate and should be completed by its board.
2. Execute FE-MISSION-001.
3. Approve the authority/ID policy protocol, then execute FE-MISSION-002.
4. Preregister FE-MISSION-003 and FE-MISSION-004; run only after instruments and stop rules freeze.
5. Use results to kill, narrow, or advance the execution model.
