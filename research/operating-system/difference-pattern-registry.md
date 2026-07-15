# Difference Pattern Registry

| Pattern ID | Name | Description | First Observed | Experiments | Typical Cause | Backbone Impact | Status |
|---|---|---|---|---|---|---|---|
| DPR-001 | Lexical Equivalence With Stable Backbone | Lexical phrasing changed while backbone remained stable. | ECR-000003 | EXP-001; EXP-002; EXP-003 | lexical_variance | none | supported |
| DPR-002 | Neutral Pass-Through Expansion | A neutral intermediate step appears without backbone change. | ECR-000003 | EXP-001; EXP-002 | elaboration | elaboration_only | supported |
| DPR-003 | Constraint Concept Moved Across Fields | The same constraint concept appears under different schema fields. | ECR-000003 | EXP-002; EXP-003 | schema_placement | none | supported |
| DPR-004 | Recognition Decay With Stable Extraction | Recognition language changes while extracted structure remains stable. | ECR-000003 | EXP-001; EXP-003 | provider_style | none | supported |
| DPR-005 | Provider-Specific Granularity | Providers vary in decomposition detail while retaining related roles. | ECR-000003 | EXP-001; EXP-002; EXP-003 | provider_style | localized | supported |
| DPR-006 | Domain Vocabulary Shift With Stable Topology | Domain terms differ while topology remains stable. | ECR-000003 | EXP-003 | domain_semantics | none | supported |
| DPR-007 | Primitive Role Agreement With Sequence Disagreement | Roles agree even where sequence order diverges. | ECR-000003 | EXP-001; EXP-003 | compression | localized | supported |
| DPR-008 | Explicit vs Implicit Loop Representation | Loop behavior is expressed directly in one response and indirectly in another. | ECR-000003 | EXP-002; EXP-003 | representation_format | localized | supported |
| DPR-009 | Decide vs Terminate Boundary | Decision and termination wording remain difficult to separate. | ECR-000003 | EXP-002; EXP-003 | comparator_limit | unknown | supported |
| DPR-010 | Evaluate vs Verify Boundary | Evaluation and verification labels remain adjacent and sometimes unresolved. | ECR-000003 | EXP-001; EXP-003 | comparator_limit | unknown | supported |

Patterns are observational and not universal laws.
