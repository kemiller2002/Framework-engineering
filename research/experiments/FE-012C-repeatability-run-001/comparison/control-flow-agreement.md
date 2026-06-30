# FE-012C Control Flow Agreement

Control-flow comparison covers:

- loops present / absent
- branches present / absent
- reassessment present / absent
- cyclic vs linear vs static shape

| Packet ID | Provider | Prior Loops | Repeat Loops | Prior Branches | Repeat Branches | Prior Reassessment | Repeat Reassessment | Prior Shape Family | Repeat Shape Family | Semantic Category |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FE-012C-P001 | gpt | present | present | present | present | present | present | cyclic | cyclic | structural_drift |
| FE-012C-P002 | gpt | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P003 | gpt | present | present | absent | present | present | present | static | static | structural_drift |
| FE-012C-P004 | gpt | present | present | absent | absent | present | present | static | static | structural_drift |
| FE-012C-P005 | gpt | absent | absent | absent | present | absent | absent | static | static | structural_drift |
| FE-012C-P006 | gpt | present | present | absent | present | present | present | static | static | structural_drift |
| FE-012C-P007 | gpt | present | present | absent | present | present | present | static | static | structural_drift |
| FE-012C-P008 | gpt | absent | present | present | present | absent | absent | static | static | structural_drift |
| FE-012C-P009 | gpt | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P010 | gpt | absent | absent | absent | absent | absent | absent | static | static | stable |
| FE-012C-P011 | gpt | present | present | absent | present | present | present | static | static | structural_drift |
| FE-012C-P012 | gpt | present | present | absent | present | present | present | static | static | structural_drift |
| FE-012C-P013 | gpt | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P014 | gpt | absent | present | absent | present | absent | absent | static | static | structural_drift |
| FE-012C-P015 | gpt | present | present | absent | absent | present | present | static | static | structural_drift |
| FE-012C-P001 | claude | present | present | present | present | absent | present | cyclic | cyclic | structural_drift |
| FE-012C-P002 | claude | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P003 | claude | present | present | present | present | present | present | static | static | structural_drift |
| FE-012C-P004 | claude | present | present | absent | present | present | present | static | static | structural_drift |
| FE-012C-P005 | claude | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P006 | claude | present | present | present | present | present | present | static | static | structural_drift |
| FE-012C-P007 | claude | present | present | present | present | present | present | static | static | structural_drift |
| FE-012C-P008 | claude | absent | present | absent | present | absent | absent | static | static | structural_drift |
| FE-012C-P009 | claude | absent | absent | absent | present | absent | absent | static | static | structural_drift |
| FE-012C-P010 | claude | absent | absent | absent | absent | absent | absent | static | static | stable |
| FE-012C-P011 | claude | present | present | absent | absent | present | present | static | static | unclear |
| FE-012C-P012 | claude | present | present | present | present | present | present | static | static | structural_drift |
| FE-012C-P013 | claude | absent | present | absent | present | absent | absent | static | static | structural_drift |
| FE-012C-P014 | claude | absent | present | absent | present | absent | absent | static | static | structural_drift |
| FE-012C-P015 | claude | present | present | absent | absent | present | present | static | static | structural_drift |
| FE-012C-P001 | gemini | present | present | present | present | absent | present | cyclic | cyclic | structural_drift |
| FE-012C-P002 | gemini | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P003 | gemini | present | present | absent | present | present | present | static | static | structural_drift |
| FE-012C-P004 | gemini | present | absent | absent | absent | present | present | static | static | structural_drift |
| FE-012C-P005 | gemini | absent | absent | present | absent | absent | absent | static | static | structural_drift |
| FE-012C-P006 | gemini | present | absent | absent | absent | present | present | static | static | structural_drift |
| FE-012C-P007 | gemini | present | present | absent | absent | present | present | static | static | stable |
| FE-012C-P008 | gemini | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P009 | gemini | absent | absent | absent | absent | absent | absent | static | static | structural_drift |
| FE-012C-P010 | gemini | absent | absent | absent | absent | absent | absent | static | static | stable |
| FE-012C-P011 | gemini | present | absent | absent | absent | present | present | static | static | structural_drift |
| FE-012C-P012 | gemini | present | present | absent | absent | present | present | static | static | structural_drift |
| FE-012C-P013 | gemini | absent | absent | absent | absent | absent | absent | static | static | stable |
| FE-012C-P014 | gemini | absent | absent | absent | absent | absent | absent | static | static | stable |
| FE-012C-P015 | gemini | present | present | absent | absent | present | present | static | static | structural_drift |

## Summary

- Loop agreement pairs: 37/45
- Branch agreement pairs: 31/45
- Reassessment agreement pairs: 43/45
- Shape-family agreement pairs: 45/45
