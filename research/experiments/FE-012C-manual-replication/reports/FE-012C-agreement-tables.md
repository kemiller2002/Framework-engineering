# FE-012C Agreement Tables

## Per-Packet Agreement

| packet_id | models_present | entry_agreement | exit_agreement | dominant_agreement | shape_agreement | transition_agreement | recognized_count | missing_primitive_count | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FE-012C-P001 | 3 | full | full | full | full | moderate | 3 | 0 | artifact recognized |
| FE-012C-P002 | 3 | full | full | full | full | strong | 3 | 0 | artifact recognized |
| FE-012C-P003 | 3 | full | full | full | mixed | strong | 3 | 0 | shape mismatch; artifact recognized |
| FE-012C-P004 | 3 | full | full | full | full | strong | 3 | 0 | artifact recognized |
| FE-012C-P005 | 3 | full | mixed | full | mixed | strong | 3 | 0 | exit mismatch; shape mismatch; artifact recognized |
| FE-012C-P006 | 3 | full | mixed | mixed | mixed | strong | 3 | 0 | exit mismatch; dominant mismatch; shape mismatch; artifact recognized |
| FE-012C-P007 | 3 | full | mixed | full | mixed | strong | 3 | 0 | exit mismatch; shape mismatch; artifact recognized |
| FE-012C-P008 | 3 | full | full | full | mixed | strong | 3 | 0 | shape mismatch; artifact recognized |
| FE-012C-P009 | 3 | full | mixed | full | full | strong | 3 | 0 | exit mismatch; artifact recognized |
| FE-012C-P010 | 3 | full | full | full | full | strong | 3 | 0 | artifact recognized |
| FE-012C-P011 | 3 | full | full | full | full | strong | 3 | 0 | artifact recognized |
| FE-012C-P012 | 3 | full | full | mixed | mixed | strong | 3 | 0 | dominant mismatch; shape mismatch; artifact recognized |
| FE-012C-P013 | 3 | full | full | full | full | strong | 3 | 0 | artifact recognized |
| FE-012C-P014 | 3 | full | full | full | full | strong | 3 | 0 | artifact recognized |
| FE-012C-P015 | 3 | full | full | mixed | full | strong | 3 | 0 | dominant mismatch; artifact recognized |

## Transition Frequency Table

| transition | count | packets_seen |
| --- | --- | --- |
| Bound -> Generate | 15 | FE-012C-P001, FE-012C-P002, FE-012C-P006, FE-012C-P008, FE-012C-P012 |
| Reassess -> Observe | 15 | FE-012C-P001, FE-012C-P003, FE-012C-P004, FE-012C-P006, FE-012C-P007, FE-012C-P015 |
| Bound -> Observe | 12 | FE-012C-P004, FE-012C-P007, FE-012C-P009, FE-012C-P010 |
| Evaluate -> Decide | 10 | FE-012C-P001, FE-012C-P002, FE-012C-P005, FE-012C-P006 |
| Classify -> Interpret | 9 | FE-012C-P003, FE-012C-P009, FE-012C-P014 |
| Decide -> Act | 9 | FE-012C-P007, FE-012C-P011, FE-012C-P015 |
| Observe -> Classify | 9 | FE-012C-P003, FE-012C-P009, FE-012C-P010 |
| Act -> Reassess | 6 | FE-012C-P007, FE-012C-P015 |
| Bound -> Classify | 6 | FE-012C-P013, FE-012C-P014 |
| Compare -> Evaluate | 6 | FE-012C-P002, FE-012C-P005 |
| Generate -> Explain | 6 | FE-012C-P006, FE-012C-P008 |
| Interpret -> Decide | 6 | FE-012C-P003, FE-012C-P015 |
| Verify -> Reassess | 6 | FE-012C-P006, FE-012C-P012 |
| Prioritize -> Decide | 4 | FE-012C-P009, FE-012C-P011 |
| Reassess -> Bound | 4 | FE-012C-P011, FE-012C-P012 |
| Verify -> Decide | 4 | FE-012C-P001, FE-012C-P007 |
| Act -> Reflect | 3 | FE-012C-P011 |
| Act -> Verify | 3 | FE-012C-P012 |
| Allocate -> Communicate | 3 | FE-012C-P004 |
| Bound -> Prioritize | 3 | FE-012C-P011 |
| Classify -> Compare | 3 | FE-012C-P005 |
| Classify -> Evaluate | 3 | FE-012C-P010 |
| Classify -> Generate | 3 | FE-012C-P013 |
| Classify -> Verify | 3 | FE-012C-P008 |
| Communicate -> Prioritize | 3 | FE-012C-P004 |
| Coordinate -> Reassess | 3 | FE-012C-P004 |
| Decide -> Communicate | 3 | FE-012C-P002 |
| Decide -> Reassess | 3 | FE-012C-P003 |
| Decide -> Verify | 3 | FE-012C-P006 |
| Evaluate -> Communicate | 3 | FE-012C-P013 |
| Evaluate -> Prioritize | 3 | FE-012C-P009 |
| Explain -> Classify | 3 | FE-012C-P008 |
| Explain -> Evaluate | 3 | FE-012C-P006 |
| Explain -> Verify | 3 | FE-012C-P007 |
| Generate -> Compare | 3 | FE-012C-P002 |
| Generate -> Evaluate | 3 | FE-012C-P013 |
| Generate -> Observe | 3 | FE-012C-P001 |
| Generate -> Prioritize | 3 | FE-012C-P012 |
| Interpret -> Evaluate | 3 | FE-012C-P009 |
| Observe -> Allocate | 3 | FE-012C-P004 |
| Observe -> Bound | 3 | FE-012C-P006 |
| Observe -> Evaluate | 3 | FE-012C-P001 |
| Observe -> Explain | 3 | FE-012C-P007 |
| Observe -> Interpret | 3 | FE-012C-P015 |
| Prioritize -> Communicate | 3 | FE-012C-P012 |
| Prioritize -> Coordinate | 3 | FE-012C-P004 |
| Reassess -> Prioritize | 3 | FE-012C-P011, FE-012C-P012 |
| Reflect -> Reassess | 3 | FE-012C-P011 |
| Communicate -> Act | 2 | FE-012C-P012 |
| Reassess -> Allocate | 2 | FE-012C-P004 |
| Communicate -> Coordinate | 1 | FE-012C-P012 |
| Compare -> Decide | 1 | FE-012C-P005 |
| Coordinate -> Act | 1 | FE-012C-P012 |
| Evaluate -> Generate | 1 | FE-012C-P001 |
| Evaluate -> Observe | 1 | FE-012C-P001 |
| Evaluate -> Reassess | 1 | FE-012C-P001 |
| Evaluate -> Verify | 1 | FE-012C-P001 |
| Reassess -> Explain | 1 | FE-012C-P007 |
| Reassess -> Generate | 1 | FE-012C-P001 |
| Verify -> Generate | 1 | FE-012C-P001 |
| Verify -> Observe | 1 | FE-012C-P001 |

## Disagreement Table

| packet_id | disagreement_type | gpt | claude | gemini | notes |
| --- | --- | --- | --- | --- | --- |
| FE-012C-P001 | Transition structure | Bound -> Generate; Generate -> Observe; Observe -> Evaluate; Evaluate -> Reassess; Reassess -> Observe; Reassess -> Generate; Evaluate -> Decide | Bound -> Generate; Generate -> Observe; Observe -> Evaluate; Evaluate -> Decide; Evaluate -> Observe; Evaluate -> Generate | Bound -> Generate; Generate -> Observe; Observe -> Evaluate; Evaluate -> Verify; Verify -> Decide; Verify -> Observe; Verify -> Generate |  |
| FE-012C-P003 | Reasoning shape | Cyclic | Cyclic-Branching | Cyclic |  |
| FE-012C-P004 | Transition structure | Bound -> Observe; Observe -> Allocate; Allocate -> Communicate; Communicate -> Prioritize; Prioritize -> Coordinate; Coordinate -> Reassess; Reassess -> Allocate | Bound -> Observe; Observe -> Allocate; Allocate -> Communicate; Communicate -> Prioritize; Prioritize -> Coordinate; Coordinate -> Reassess; Reassess -> Observe | Bound -> Observe; Observe -> Allocate; Allocate -> Communicate; Communicate -> Prioritize; Prioritize -> Coordinate; Coordinate -> Reassess; Reassess -> Observe; Reassess -> Allocate |  |
| FE-012C-P005 | Exit primitive | Decide | Evaluate | Decide |  |
| FE-012C-P005 | Reasoning shape | Linear | Linear | Branching |  |
| FE-012C-P005 | Transition structure | Classify -> Compare; Compare -> Evaluate; Evaluate -> Decide | Classify -> Compare; Compare -> Evaluate | Classify -> Compare; Compare -> Evaluate; Compare -> Decide; Evaluate -> Decide |  |
| FE-012C-P006 | Exit primitive | Reassess | Verify | Reassess |  |
| FE-012C-P006 | Dominant primitive | Evaluate | Generate | Evaluate |  |
| FE-012C-P006 | Reasoning shape | Cyclic | Cyclic-Branching | Cyclic |  |
| FE-012C-P007 | Exit primitive | Reassess | Act | Reassess |  |
| FE-012C-P007 | Reasoning shape | Cyclic | Cyclic-Branching | Cyclic |  |
| FE-012C-P007 | Transition structure | Bound -> Observe; Observe -> Explain; Explain -> Verify; Verify -> Decide; Decide -> Act; Act -> Reassess; Reassess -> Observe | Bound -> Observe; Observe -> Explain; Explain -> Verify; Verify -> Decide; Decide -> Act; Act -> Reassess; Reassess -> Observe | Bound -> Observe; Observe -> Explain; Explain -> Verify; Verify -> Decide; Decide -> Act; Act -> Reassess; Reassess -> Observe; Reassess -> Explain |  |
| FE-012C-P008 | Reasoning shape | Branching | Linear | Linear |  |
| FE-012C-P009 | Exit primitive | Prioritize | Prioritize | Decide |  |
| FE-012C-P009 | Transition structure | Bound -> Observe; Observe -> Classify; Classify -> Interpret; Interpret -> Evaluate; Evaluate -> Prioritize | Bound -> Observe; Observe -> Classify; Classify -> Interpret; Interpret -> Evaluate; Evaluate -> Prioritize | Bound -> Observe; Observe -> Classify; Classify -> Interpret; Interpret -> Evaluate; Evaluate -> Prioritize; Prioritize -> Decide |  |
| FE-012C-P011 | Transition structure | Bound -> Prioritize; Prioritize -> Decide; Decide -> Act; Act -> Reflect; Reflect -> Reassess; Reassess -> Prioritize | Bound -> Prioritize; Prioritize -> Decide; Decide -> Act; Act -> Reflect; Reflect -> Reassess; Reassess -> Bound | Bound -> Prioritize; Prioritize -> Decide; Decide -> Act; Act -> Reflect; Reflect -> Reassess; Reassess -> Bound |  |
| FE-012C-P012 | Dominant primitive | Prioritize | Communicate | Coordinate |  |
| FE-012C-P012 | Reasoning shape | Cyclic | Cyclic-Branching | Cyclic |  |
| FE-012C-P012 | Transition structure | Bound -> Generate; Generate -> Prioritize; Prioritize -> Communicate; Communicate -> Act; Act -> Verify; Verify -> Reassess; Reassess -> Prioritize | Bound -> Generate; Generate -> Prioritize; Prioritize -> Communicate; Communicate -> Act; Act -> Verify; Verify -> Reassess; Reassess -> Bound | Bound -> Generate; Generate -> Prioritize; Prioritize -> Communicate; Communicate -> Coordinate; Coordinate -> Act; Act -> Verify; Verify -> Reassess; Reassess -> Bound; Reassess -> Prioritize |  |
| FE-012C-P015 | Dominant primitive | Act | Observe | Decide |  |

