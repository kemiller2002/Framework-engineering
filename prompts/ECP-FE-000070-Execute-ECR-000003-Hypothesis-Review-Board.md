# Engineering Change Package

**ID:** ECP-FE-000070  
**Title:** Execute the ECR-000003 Hypothesis Review Board  
**Repository:** framework-engineering  
**Category:** Research Governance  
**Priority:** Critical

## Purpose

Run the first formal Hypothesis Review Board for ECR-000003.

Review completed evidence from EXP-001, EXP-002, and EXP-003 for:

- H002 Representation Independence
- H003 Multi-Model Convergence
- H013 Recognition Bias
- H015 Measurement Instrument Reliability
- H016 Structural Recognition
- H017 Procedural Compression
- H018 Procedural Isomorphism

The board must determine supporting evidence, challenging evidence, mixed findings, alternative explanations, kill-condition status, proposed qualitative direction, evidence strength, and the next evidence needed.

The board does not prove hypotheses correct. It reviews the evidence and prepares decisions for human approval.

## Guardrails

Do not:

- run models,
- alter raw responses or packets,
- change Comparator v3.1 or 3.2 outputs,
- overwrite accepted EDRs,
- introduce numerical confidence,
- mark hypotheses proven,
- validate Framework Engineering, Clarity, EDF, or HelixNote,
- create ECR-000004 automatically,
- hide contradictory evidence,
- erase prior hypothesis states.

## 1. Verify Board Readiness

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/review-board/HRB-READINESS.md

Verify:

- all three experiment evidence states,
- all three EDRs,
- Comparator v3.1 manifests,
- Comparator 3.2 explainability outputs,
- Findings Report,
- threats and claims reviews,
- Hypothesis Evidence Matrix,
- kill conditions,
- experiment review records.

Use:

| Readiness Item | Path | Status | Blocking |
|---|---|---|---|

Allowed overall status:

- READY
- READY_WITH_WARNINGS
- BLOCKED

Do not proceed to final recommendations if blocked.

## 2. Create the Board Packet

Create:

    review-board/HYPOTHESIS-REVIEW-BOARD-PACKET.md

Include:

- board purpose,
- evidence scope,
- instrument versions,
- summaries of EXP-001, EXP-002, and EXP-003,
- known instrument limits,
- material threats,
- hypotheses under review,
- board decision rules.

Decision rules:

1. One experiment cannot prove a hypothesis.
2. Model agreement is not independent validation.
3. Provider-specific behavior is not automatically procedural behavior.
4. Literal disagreement is not structural disagreement.
5. Recognition is separate from structural recovery.
6. Instrument findings are not automatically theory findings.
7. Product claims require separate evidence.
8. Kill conditions remain visible.
9. Mixed evidence remains mixed.
10. Uncertainty is acceptable.

## 3. Create One Review Record per Hypothesis

Create:

    review-board/hypotheses/H002-review.md
    review-board/hypotheses/H003-review.md
    review-board/hypotheses/H013-review.md
    review-board/hypotheses/H015-review.md
    review-board/hypotheses/H016-review.md
    review-board/hypotheses/H017-review.md
    review-board/hypotheses/H018-review.md

Each review must include:

- hypothesis ID and name,
- current statement,
- research question,
- prior direction and strength,
- prior kill-condition status,
- evidence supporting with durable sources,
- evidence challenging with durable sources,
- mixed evidence,
- provider, representation, and domain effects,
- relevant instrument findings,
- threats,
- alternative explanations,
- kill condition and status,
- proposed direction,
- proposed evidence strength,
- board recommendation,
- rationale,
- next evidence needed,
- blank human decision, reviewer, and date fields.

Allowed directions:

- supported
- slightly_supported
- mixed
- neutral
- slightly_challenged
- challenged
- rejected
- unknown
- waiting

Allowed strengths:

- none
- insufficient
- weak
- moderate
- strong
- compelling

Allowed recommendations:

- retain
- strengthen_qualitatively
- weaken_qualitatively
- split
- suspend
- retire
- defer

Kill-condition statuses:

- not_tested
- tested_not_met
- partially_met
- met_pending_review
- met_and_accepted

## 4. Seed Reviews Conservatively

Use factual evidence only. Treat these as review proposals, not decisions.

Suggested starting postures:

- H002: slightly_supported; weak or moderate; retain
- H003: mixed or slightly_supported; weak or moderate; retain
- H013: mixed; weak or moderate; retain
- H015: supported; moderate; retain
- H016: slightly_supported; weak or moderate; retain
- H017: slightly_supported; weak or moderate; retain
- H018: slightly_supported; weak or moderate; retain

Preserve challenging evidence and limitations for each.

## 5. Create the Board Summary

Create:

    review-board/HYPOTHESIS-REVIEW-BOARD-SUMMARY.md

Include:

| Hypothesis | Prior Direction | Proposed Direction | Prior Strength | Proposed Strength | Kill Condition | Recommendation |
|---|---|---|---|---|---|---|

Also include:

- strongest supporting patterns,
- strongest challenges,
- mixed findings,
- most affected hypotheses,
- least-tested hypotheses,
- possible splits,
- instrument dependencies,
- limiting threats,
- next evidence priorities,
- human decisions required.

Do not mark accepted automatically.

## 6. Review Possible Hypothesis Splits

Create:

    review-board/HYPOTHESIS-SPLIT-CANDIDATES.md

Evaluate:

- H003: backbone convergence vs primitive convergence vs recognition convergence
- H013: recognition persistence vs recognition import vs effect on structural recovery
- H016: topology-driven recognition vs semantic-cue-driven recognition
- H017: role compression vs transition compression vs constraint compression

Use:

| Hypothesis | Proposed Split | Evidence | Benefit | Risk | Recommendation |
|---|---|---|---|---|---|

Do not split automatically.

## 7. Review Kill Conditions

Create:

    review-board/HYPOTHESIS-KILL-CONDITION-REVIEW.md

For every hypothesis record:

- current kill condition,
- whether ECR-000003 tested it,
- relevant evidence,
- whether it is too weak or broad,
- recommended refinement.

Do not weaken kill conditions because results are favorable.

## 8. Create the Board Decision Record

Create:

    review-board/HYPOTHESIS-REVIEW-BOARD-DECISION.md

Include blank human fields for:

- board date,
- reviewer,
- hypothesis decisions,
- accepted splits,
- deferred decisions,
- rejected recommendations,
- matrix update approval,
- claims review approval,
- next research action approval,
- board outcome.

Allowed outcomes:

- accepted
- accepted_with_notes
- needs_revision
- deferred

Do not fill final decisions automatically.

## 9. Create the Matrix Update Proposal

Create:

    research/operating-system/hypothesis-matrix-inputs/ECR-000003-HRB-proposal.md

For each hypothesis include:

- current matrix state,
- proposed state,
- evidence references,
- rationale,
- kill-condition status,
- reviewer approval field.

Do not update the durable matrix until the board approves.

## 10. Prepare the Next Research Input

Create:

    review-board/HRB-NEXT-RESEARCH-INPUT.md

Evaluate:

1. Negative non-isomorphic controls
2. Human baseline procedural extraction
3. Model-version repeatability
4. Recognition-control replication
5. Additional procedural families
6. Constraint-layer calibration

Use:

| Candidate | Hypotheses Affected | Falsification Value | Information Gain | Effort | Priority |
|---|---|---|---|---|---|

Do not create ECR-000004.

## 11. Update Dashboards and Current State

Update:

    research/operating-system/evidence-dashboard/index.md
    ECR-000003-CLOSURE-DASHBOARD.md
    CURRENT_STATE.md

Set:

Current Phase:
ECR-000003 Hypothesis Review Board

Current Goal:
Review each active hypothesis against accepted ECR-000003 evidence, assess kill conditions, approve qualitative updates, and select the next highest-information research action.

Immediate Human Action:

    Open review-board/HYPOTHESIS-REVIEW-BOARD-PACKET.md

Then review:

    review-board/hypotheses/
    review-board/HYPOTHESIS-REVIEW-BOARD-SUMMARY.md
    review-board/HYPOTHESIS-REVIEW-BOARD-DECISION.md

## 12. Verification

Add tests verifying:

1. Every review references durable evidence.
2. Supporting and challenging evidence both appear.
3. No numerical confidence is introduced.
4. No hypothesis is marked proven.
5. Kill conditions remain visible.
6. Proposed values use allowed enums.
7. Matrix changes remain proposals.
8. Product claims remain separate.
9. ECR-000004 is not created.
10. Accepted EDRs are not overwritten.
11. Raw response hashes remain unchanged.
12. Comparator outputs remain unchanged.
13. Human-decision fields remain blank unless already approved.
14. Dashboard state matches actual artifacts.

## Implementation Report

Create:

    review-board/HRB-IMPLEMENTATION-REPORT.md

Include:

| Deliverable | Path | Status | Human Review Required |
|---|---|---|---|

Also include readiness, reviews created, gaps, split candidates, kill-condition concerns, and exact next human actions.

## Success Criteria

1. HRB readiness is verified.
2. The board packet exists.
3. One review exists for every hypothesis.
4. Supporting and challenging evidence are cited.
5. Mixed evidence is preserved.
6. Kill conditions are reviewed.
7. Split candidates are documented.
8. The summary exists.
9. The decision record exists.
10. The matrix update remains a proposal.
11. Next-research input is prepared.
12. Dashboards and Current State are updated.
13. No hypothesis is marked proven.
14. No product is marked validated.
15. No new ECR is created automatically.
16. Exact human decisions are clearly identified.
