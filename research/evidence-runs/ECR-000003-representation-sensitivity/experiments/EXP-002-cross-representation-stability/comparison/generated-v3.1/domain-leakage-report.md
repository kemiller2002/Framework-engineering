# Domain Leakage Report

| Packet | Provider | Introduced Terms | Classification | Notes |
|---|---|---|---|---|
| ECR-000003-EXP002-P001A | gpt | evidence | possible_structural_inference | low; no specific external framework or named artifact was used to complete missing structure. |
| ECR-000003-EXP002-P001A | claude | diagnosis; differential diagnosis; hypothesis testing; evidence | likely_prior_knowledge_leakage | Low-to-moderate: the family recognition could tempt insertion of elimination semantics, evidence-value criteria, or candidate-pruning steps not present in the packet; these were deliberately excluded and flagged as ambiguities instead. |
| ECR-000003-EXP002-P001A | gemini | diagnosis; differential diagnosis; evidence | likely_prior_knowledge_leakage | Low. While external concepts like 'Hypotheses' and 'Evidence' map perfectly to 'paths' and 'input', the extracted fields preserve literal text constraints and structure explicitly defined in the narrative. |
| ECR-000003-EXP002-P001B | gpt | evidence | possible_structural_inference | Low. Extraction was limited to the packet text and explicit procedural implications without importing additional structure. |
| ECR-000003-EXP002-P001B | claude | diagnosis; differential diagnosis; hypothesis testing; evidence | likely_prior_knowledge_leakage | Low-to-moderate. Main risk points: (1) glossing 'paths' as hypotheses/candidates imports a diagnostic framing; (2) listing PRUNE_CANDIDATES and SELECT_CANDIDATE as candidate missing primitives is informed by knowledge of typical procedures in this family, though both were flagged as unsupported rather than asserted. No steps, conditions, or loop structure were added beyond packet text. |
| ECR-000003-EXP002-P001B | gemini | none | generic_procedural_language | generic_procedural_language |
| ECR-000003-EXP002-P001C | gpt | none | generic_procedural_language | low; extraction limited to explicit graph structure and annotations. |
| ECR-000003-EXP002-P001C | claude | none | generic_procedural_language | low; the only interpretive vocabulary used ('dispatch', 'converge', 'evaluate', 'iterate') is generic control-flow terminology derived from graph shape and the three stated guards, not from any recognized source artifact |
| ECR-000003-EXP002-P001C | gemini | none | generic_procedural_language | generic_procedural_language |
| ECR-000003-EXP002-P001D | gpt | none | generic_procedural_language | low |
| ECR-000003-EXP002-P001D | claude | none | generic_procedural_language | low — all state names, condition names, and edges were taken verbatim from the packet; abstraction labels in the primitive layer (e.g., 'enumerate_options', 'evaluate_against_threshold') are derived directly from packet condition text ('path_x listed', 'threshold not met') and introduce no domain vocabulary. Residual risk is that the primitive labels themselves impose a slightly more purposive reading than the bare table warrants. |
| ECR-000003-EXP002-P001D | gemini | none | generic_procedural_language | Low. Extraction parameters are bound directly to the explicit explicit literal keys provided in the variant transition block table text. |

Leakage classifications are observational and may still reflect structural inference rather than memorized framework recall.
