# Domain Leakage Report

| Packet | Provider | Introduced Terms | Classification | Notes |
|---|---|---|---|---|
| ECR-000003-EXP001-P001A | gpt | none | generic_procedural_language | low |
| ECR-000003-EXP001-P001A | claude | evidence | possible_structural_inference | Low. No domain terminology was introduced. Structural observations were derived solely from graph edges and node notes. The recognized pattern is broad enough that it maps to multiple procedure families; no specific domain structure was imported. |
| ECR-000003-EXP001-P001A | gemini | none | generic_procedural_language | none |
| ECR-000003-EXP001-P001B | gpt | none | generic_procedural_language | low |
| ECR-000003-EXP001-P001B | claude | none | generic_procedural_language | low; no domain terms were introduced; structural observations are grounded solely in graph edges and node notes; the parallel-path-with-reeval topology is generic enough that no specific artifact was assumed |
| ECR-000003-EXP001-P001B | gemini | none | generic_procedural_language | generic_procedural_language |
| ECR-000003-EXP001-P001C | gpt | none | generic_procedural_language | low |
| ECR-000003-EXP001-P001C | claude | diagnosis; evidence | likely_prior_knowledge_leakage | Low-to-moderate. The resemblance noted in recognized_artifact could bias interpretation toward diagnosis-style semantics; extraction was restricted to packet vocabulary (paths, differentiating input, re-sorting, separation) and no domain terminology was imported into any layer. |
| ECR-000003-EXP001-P001C | gemini | none | generic_procedural_language | none |
| ECR-000003-EXP001-P001D | gpt | none | generic_procedural_language | low |
| ECR-000003-EXP001-P001D | claude | diagnosis; hypothesis testing | likely_prior_knowledge_leakage | low-to-moderate: the familiar 'generate-then-discriminate' shape creates a temptation to import domain framing (e.g., hypothesis testing or diagnosis vocabulary); this was avoided by keeping all labels at the packet's own level of abstraction (paths, differentiating input, fit, separation). |
| ECR-000003-EXP001-P001D | gemini | none | generic_procedural_language | generic_procedural_language |

Leakage classifications are observational and may still reflect structural inference rather than memorized framework recall.
