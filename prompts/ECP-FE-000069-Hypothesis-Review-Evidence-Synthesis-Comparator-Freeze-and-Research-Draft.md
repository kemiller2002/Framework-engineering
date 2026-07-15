# Engineering Change Package

**ID:** ECP-FE-000069  
**Title:** Hypothesis Review, Evidence Synthesis, Comparator Freeze, and Research Draft  
**Repository:** framework-engineering  
**Category:** Research Program Synthesis  
**Priority:** Critical

## Purpose

Move the Framework Engineering research program from completed experimentation into formal evidence review and synthesis.

ECR-000003 has been run, normalized, compared, explained, and prepared for closure.

This package must:

1. Hold the first formal Hypothesis Review Board for ECR-000003.
2. Finalize the ECR-000003 Findings Report.
3. Permanently freeze Comparator v3.1 as the official instrument used for ECR-000003.
4. Build a durable Evidence Dashboard.
5. Produce a first research paper draft.
6. Prepare, but not automatically create, the next ECR.
7. Separate research findings from product claims.
8. Preserve unresolved uncertainty and contradictory evidence.

## Core Principle

The purpose of this package is not to prove the hypotheses correct.

The purpose is to determine:

- what evidence was observed,
- which hypotheses gained support,
- which hypotheses were challenged,
- which remain unresolved,
- which claims are defensible,
- what next experiment has the highest expected information gain.

## Scope

Target ECR:

    research/evidence-runs/ECR-000003-representation-sensitivity/

Target hypotheses:

- H002 Representation Independence
- H003 Multi-Model Convergence
- H013 Recognition Bias
- H015 Measurement Instrument Reliability
- H016 Structural Recognition
- H017 Procedural Compression
- H018 Procedural Isomorphism

Target instrument:

    Comparator v3.1.0

Target explainability layer:

    Comparator 3.2.0 Explainability

## Guardrails

Do not:

- run models,
- alter raw responses,
- alter experiment packets,
- alter official Comparator v3.1 results,
- change hypothesis confidence numerically,
- mark hypotheses proven,
- claim universal procedural grammar,
- claim Framework Engineering validated,
- claim Clarity validated,
- claim EDF validated,
- claim HelixNote validated,
- create ECR-000004 automatically,
- hide contradictory evidence,
- delete rejected interpretations,
- overwrite accepted EDRs,
- change scientific conclusions merely to improve narrative clarity.

## Phase 1 — Verify Synthesis Inputs

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/ECR-000003-SYNTHESIS-READINESS.md

Verify current versions of:

- ECR-000003 Findings Report
- ECR-000003 Closure Record
- ECR-000003 Closure Dashboard
- ECR-000003 Summary EDR
- EXP-001 EDR
- EXP-002 EDR
- EXP-003 EDR
- EXP-001 Review Board record
- EXP-002 Review Board record
- EXP-003 Review Board record
- ECR Review Board record
- Hypothesis Evidence Matrix
- Hypothesis Matrix update proposal
- Scientific Claims Registry
- Threats-to-Validity Register
- Difference Pattern Registry
- Next Research Decision
- Comparator v3.1 approval and freeze records
- Comparator 3.2 explainability summary

Format:

| Required Artifact | Path | Present | Current | Blocking |
|---|---|---|---|---|

Allowed status:

- READY
- READY_WITH_WARNINGS
- BLOCKED

Do not continue to final review if required evidence sources are missing or stale.

## Phase 2 — Hypothesis Review Board

Create or update:

    research/evidence-runs/ECR-000003-representation-sensitivity/review-board/HYPOTHESIS-REVIEW-BOARD.md

For each hypothesis include:

- Research question
- Prior direction
- Prior evidence strength
- Evidence supporting
- Evidence challenging
- Contradictory or mixed evidence
- Instrument limitations
- Threats to validity
- Kill condition
- Kill condition status
- Proposed direction
- Proposed evidence strength
- Board recommendation
- Rationale
- Next evidence needed

Allowed kill-condition values:

- not_tested
- tested_not_met
- partially_met
- met_pending_review
- met_and_accepted

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

Allowed evidence strengths:

- none
- insufficient
- weak
- moderate
- strong
- compelling

Allowed board recommendations:

- retain
- strengthen_qualitatively
- weaken_qualitatively
- split
- suspend
- retire
- defer

Every evidence item must cite a durable repository source.

Do not mark board recommendations accepted automatically.

## Phase 3 — Hypothesis Review Summary

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/review-board/HYPOTHESIS-REVIEW-SUMMARY.md

Include:

| Hypothesis | Prior Direction | Proposed Direction | Prior Strength | Proposed Strength | Kill Condition | Recommendation |
|---|---|---|---|---|---|---|

Add:

- strongest gains,
- strongest challenges,
- unresolved hypotheses,
- hypotheses that may need splitting,
- hypotheses not sufficiently tested,
- hypotheses whose support depends strongly on instrument assumptions.

## Phase 4 — Hypothesis Evidence Matrix Update

Target:

    research/operating-system/hypothesis-evidence-matrix.md

If the review has not been approved, create instead:

    research/operating-system/hypothesis-matrix-inputs/ECR-000003-board-proposal.md

Do not silently change the durable matrix without a review record.

Preserve:

- prior value,
- proposed value,
- supporting evidence,
- challenging evidence,
- kill-condition status,
- reviewer,
- decision date.

## Phase 5 — Finalize ECR-000003 Findings

Create or update:

    research/evidence-runs/ECR-000003-representation-sensitivity/ECR-000003-FINDINGS.md

Required structure:

# ECR-000003 Findings

## Executive Summary

## Research Questions

- RQ-REP-001
- RQ-REP-002
- RQ-REP-003
- RQ-REP-004

## Method Summary

Include:

- experiment structure,
- providers,
- normalization,
- dataset certification,
- Comparator v3.1,
- Comparator 3.2 explainability,
- EDR review,
- hypothesis review.

## EXP-001 Findings

## EXP-002 Findings

## EXP-003 Findings

## Cross-Experiment Findings

Separate:

- repeated observations,
- provider-specific patterns,
- representation effects,
- domain effects,
- recognition effects,
- structural backbone effects,
- primitive effects,
- constraint effects,
- instrument findings.

## Hypothesis Evidence Summary

| Hypothesis | Proposed Direction | Proposed Strength | Key Support | Key Challenge |
|---|---|---|---|---|

## Claims Supported Cautiously

Use formulations such as:

- evidence is consistent with,
- observations suggest,
- candidate methodological finding,
- candidate theoretical finding,
- warrants further testing.

## Claims Not Supported

Explicitly include:

- Framework Engineering is proven,
- universal procedural grammar is proven,
- Clarity improves real-world decisions,
- EDF improves reasoning,
- human and model reasoning are equivalent,
- all model providers behave similarly,
- recognition is required for structural recovery.

## Threats to Validity

## Remaining Uncertainty

## Recommended Next Research Action

## What ECR-000003 Contributes

## What ECR-000003 Does Not Establish

## Phase 6 — Permanent Comparator v3.1 Freeze

Create:

    research/tools/comparison-engine/COMPARATOR-V3.1-PERMANENT-FREEZE.md

Include:

Comparator Version:

    3.1.0

Freeze Scope:

- official ECR-000003 measurements,
- reproducibility baseline,
- future comparison reference.

Frozen components:

- recognition rules,
- structural rules,
- primitive reporting rules,
- constraint reporting rules,
- representation reporting rules,
- ontology version,
- output contract,
- tolerant parsing behavior.

Allowed future changes:

- security correction,
- raw-data safety correction,
- output corruption correction,
- adapter-only correction that does not change scoring.

Disallowed changes:

- threshold tuning,
- ontology tuning to increase agreement,
- recognition reclassification,
- changed score-bearing fields,
- changed agreement categories,
- retrospective reinterpretation of ECR-000003.

Any future scoring change must use Comparator v3.2 or later with a new version, regression suite, approval, and impact report.

## Git Freeze Preparation

Create:

    research/tools/comparison-engine/COMPARATOR-V3.1-TAGGING-INSTRUCTIONS.md

Inspect branch and tag conventions first.

Suggested tag:

    comparator-v3.1-frozen

Do not create the Git tag automatically.

## Phase 7 — Evidence Dashboard

Create:

    research/operating-system/evidence-dashboard/

Files:

    README.md
    index.md
    evidence-dashboard.json
    hypothesis-status.md
    experiment-status.md
    claims-status.md
    threats-status.md
    instrument-status.md
    unresolved-uncertainty.md
    next-research-action.md
    build-dashboard.js

The dashboard must answer:

1. What experiments are complete?
2. What hypotheses are active?
3. Which hypotheses gained support?
4. Which hypotheses were challenged?
5. What evidence supports each status?
6. What claims are defensible?
7. What claims remain unsupported?
8. What threats remain material?
9. Which instrument version produced the evidence?
10. What is the next highest-information research action?

Create:

    research/operating-system/evidence-dashboard/index.md

Include:

# Framework Engineering Evidence Dashboard

## Current Research State

## Completed ECRs

## Active Hypotheses

| Hypothesis | Direction | Evidence Strength | Latest Evidence | Next Test |
|---|---|---|---|---|

## Current Claims

## Instrument Status

## Material Threats

## Unresolved Uncertainty

## Next Research Action

## What May Be Said Publicly

## What Must Not Be Claimed

Create machine-readable:

    evidence-dashboard.json

Do not calculate numerical confidence.

Add an `evidence:dashboard` script where an existing package already exists.

## Phase 8 — First Research Paper Draft

Create:

    research/papers/framework-engineering-procedural-recovery-draft.md

Working title:

# Recovering Procedural Structure Across Topology, Representation, and Domain Changes

At the top include:

> Internal research draft. Not peer reviewed. Claims remain provisional.

Required sections:

- Abstract
- Introduction
- Research Questions
- Methodology
- EXP-001 Topology Perturbation
- EXP-002 Cross-Representation Stability
- EXP-003 Procedural Isomorphism
- Results
- Discussion
- Threats to Validity
- Implications for Framework Engineering
- Implications for Measurement
- Future Work
- Conclusion
- Appendix A — Instruments
- Appendix B — Experiment Artifacts
- Appendix C — Hypothesis Mapping

Create:

    research/papers/framework-engineering-procedural-recovery-evidence-map.md

Format:

| Paper Section | Claim or Statement | Repository Evidence | Review Status |
|---|---|---|---|

Any unsupported statement must be labeled:

    interpretation_pending_review

## Phase 9 — External Review Preparation

Create:

    research/review/external-review-packet.md

Include:

- research summary,
- methodology summary,
- experiment descriptions,
- findings summary,
- comparator description,
- threats to validity,
- known limitations,
- questions for reviewers.

Questions should include:

1. Are the experiments discriminating?
2. Are interpretations stronger than the evidence permits?
3. Does Comparator v3.1 separate surface and structure responsibly?
4. Are alternative explanations missing?
5. Are kill conditions meaningful?
6. What replication would be most persuasive?
7. Is the paper framing defensible?

Do not send this packet.

## Phase 10 — Next ECR Candidate Evaluation

Create or update:

    research/evidence-runs/ECR-000003-representation-sensitivity/NEXT-RESEARCH-DECISION.md

Evaluate:

### Candidate A — Human Baseline Procedural Extraction

Can human experts independently recover similar procedural structures?

### Candidate B — Negative Non-Isomorphic Controls

Can the instrument distinguish superficially similar but structurally different procedures?

### Candidate C — Model-Version Stability

Do providers produce stable results across model versions and time?

### Candidate D — Additional Procedural Families

Do observed patterns generalize beyond the current artifact family?

### Candidate E — Recognition-Control Replication

Does recognition change extraction quality or unsupported import?

Score qualitatively:

- expected information gain,
- hypotheses affected,
- falsification value,
- effort,
- dependency value,
- publication value,
- urgency.

Use:

- low
- medium
- high
- very_high

Recommend one candidate.

Do not create ECR-000004 automatically.

Prefer Negative Non-Isomorphic Controls if the highest risk is false structural equivalence.

Prefer Human Baseline if the highest risk is model-only behavior.

## Phase 11 — Research/Product Separation

Create or update:

    research/operating-system/research-product-boundary.md

Clarify:

### Research Program

- Framework Engineering hypotheses
- procedural extraction
- comparator methodology
- evidence runs
- EDRs
- review boards

### Scientific Instrument

- normalization
- certification
- Comparator v3.1
- Comparator explainability
- evidence dashboard

### Product or Practice Frameworks

- Clarity
- EDF
- HelixNote

Rules:

- product claims require separate testing,
- research may inform product design,
- research does not automatically validate outcomes,
- marketing language must not exceed claims-registry status.

## Phase 12 — Research Queue

Update:

    research/operating-system/research-queue/research-queue.md

Mark:

- ECR-000003 experiments complete,
- ECR-000003 review in progress or complete,
- comparator freeze complete,
- findings draft complete,
- paper draft complete,
- next ECR candidate selected but not active.

## Phase 13 — Current State

Update:

    CURRENT_STATE.md

Expected state:

Current Phase:
ECR-000003 Hypothesis Review and Research Synthesis

Current Goal:
Review the evidence, finalize findings, freeze Comparator v3.1, build the Evidence Dashboard, prepare the research draft, and select the next highest-information experiment.

Immediate Human Action:

    Review HYPOTHESIS-REVIEW-BOARD.md

Then:

    Review ECR-000003-FINDINGS.md
    Review evidence-dashboard/index.md
    Review the research paper draft
    Approve the next research decision

## Phase 14 — Final Implementation Report

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/ECR-000003-SYNTHESIS-IMPLEMENTATION-REPORT.md

Include:

| Deliverable | Path | Status | Human Review Required |
|---|---|---|---|

Also include:

- hypothesis review status,
- findings report status,
- comparator freeze status,
- dashboard status,
- paper draft status,
- external review packet status,
- next ECR decision status,
- blockers,
- exact next human actions.

## Tests and Verification

Verify:

1. Official Comparator v3.1 outputs remain unchanged.
2. Freeze record matches version 3.1.0.
3. Hypothesis Review Board references durable evidence.
4. Findings Report contains no unsupported established claims.
5. Dashboard values match source artifacts.
6. Paper claims map to evidence.
7. Product claims remain separate.
8. ECR-000004 is not created.
9. Numerical confidence is not introduced.
10. Challenging evidence remains visible.
11. Current State points to actual files.
12. Research queue reflects actual status.
13. Raw response hashes remain unchanged.
14. Accepted EDRs are not overwritten.
15. Next research recommendation includes alternatives and rationale.

## Success Criteria

This ECP is complete when:

1. Synthesis readiness is verified.
2. The Hypothesis Review Board packet is complete.
3. A hypothesis update proposal exists.
4. ECR-000003 Findings are finalized for review.
5. Comparator v3.1 has a permanent freeze record.
6. Git tagging instructions exist.
7. The Evidence Dashboard is generated.
8. The first paper draft exists.
9. Every paper claim maps to durable evidence.
10. External review material exists.
11. Next ECR candidates are evaluated.
12. One next research action is recommended.
13. Research and product boundaries are explicit.
14. Research queue and Current State are updated.
15. No hypothesis is marked proven.
16. No product is marked validated.
17. ECR-000004 is not automatically created.
18. Exact remaining human decisions are clearly listed.
