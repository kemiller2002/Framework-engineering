# FE-012C Drift Analysis

## Per-Packet Drift Summary

| Packet ID | Dominant Drift Classification | Provider Breakdown |
| --- | --- | --- |
| FE-012C-P001 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P002 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P003 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P004 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P005 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P006 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:elaboration_drift |
| FE-012C-P007 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:elaboration_drift |
| FE-012C-P008 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P009 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P010 | elaboration_drift | gpt:elaboration_drift, claude:elaboration_drift, gemini:elaboration_drift |
| FE-012C-P011 | elaboration_drift | gpt:structural_drift, claude:elaboration_drift, gemini:elaboration_drift |
| FE-012C-P012 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |
| FE-012C-P013 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:elaboration_drift |
| FE-012C-P014 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:stable |
| FE-012C-P015 | structural_drift | gpt:structural_drift, claude:structural_drift, gemini:structural_drift |

## Per-Model Drift Summary

| Model | Stable | Elaboration Drift | Structural Drift | Schema Incomparable | Missing Or Invalid |
| --- | ---: | ---: | ---: | ---: | ---: |
| GPT | 0 | 1 | 14 | 0 | 0 |
| CLAUDE | 0 | 2 | 13 | 0 | 0 |
| GEMINI | 1 | 5 | 9 | 0 | 0 |

## Field-Specific Drift

| Field | Drift Count |
| --- | ---: |
| entry | 8 |
| exit | 10 |
| dominant primitive | 13 |
| sequence | 30 |
| transitions | 34 |
| loops | 29 |
| branches | 22 |
| reasoning_shape | 0 |

## Backbone Drift Versus Elaboration Drift

- Backbone drift is counted when entry, exit, dominant primitive, reasoning shape, or major non-elaboration sequence changes materially.
- Elaboration drift is counted when backbone remains stable but elaboration-sensitive primitives, transitions, loops, branches, ambiguities, or confidence details shift.
- Schema incomparable is reserved for missing backbone fields attributable to schema mismatch rather than semantic disagreement.
