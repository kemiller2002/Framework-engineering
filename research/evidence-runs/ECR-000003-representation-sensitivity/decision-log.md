# ECR-000003 Decision Log

| Date | Decision | Evidence | Rationale | Next Action |
| --- | --- | --- | --- | --- |
| 2026-07-02 | Created ECR-000003 representation-sensitivity series. | ECR-000002 P001C and P001D recognition observations. | Topology, representation format, and domain semantics remain entangled and need separate tests. | Run EXP-001 first and review before continuing. |
| 2026-07-10 | Corrected `P001D` to packet version `1.1`. | EXP-001 readiness verification found the identity-node-expanded packet omitted the explicit terminal edge present in the baseline graph. | The topology-preservation comparison requires the selected-path termination edge to remain explicit. | Exclude pre-fix `P001D` responses from the corrected primary comparison and rerun `P001D` for GPT, Claude, and Gemini. |
|  |  |  |  |  |
