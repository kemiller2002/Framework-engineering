# ECR-000003 Decision Log

| Date | Decision | Evidence | Rationale | Next Action |
| --- | --- | --- | --- | --- |
| 2026-07-02 | Created ECR-000003 representation-sensitivity series. | ECR-000002 P001C and P001D recognition observations. | Topology, representation format, and domain semantics remain entangled and need separate tests. | Run EXP-001 first and review before continuing. |
| 2026-07-10 | Corrected `P001D` to packet version `1.1`. | EXP-001 readiness verification found the identity-node-expanded packet omitted the explicit terminal edge present in the baseline graph. | The topology-preservation comparison requires the selected-path termination edge to remain explicit. | Exclude pre-fix `P001D` responses from the corrected primary comparison and rerun `P001D` for GPT, Claude, and Gemini. |
| 2026-07-10 | Approved Comparator v3.1 for limited ECR-000003 use and froze it for the remainder of the ECR. | `comparison/calibration/comparator-v3.1-regression-report.md`, `comparison/calibration/comparator-v3.1-approval-record.md`, `comparison/calibration/comparator-v3.1-freeze-record.md`. | Regression passed, run consistency passed, raw response hashes were preserved, and no blocking comparator defect remained. | Complete and accept `EDR-ECR-000003-EXP001` before activating `EXP-002`. |
